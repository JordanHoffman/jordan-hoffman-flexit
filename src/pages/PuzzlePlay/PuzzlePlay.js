import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { cloneDeep } from 'lodash';

import './PuzzlePlay.scss';
import Toolkit from '../../components/Toolkit';
import FlexBlock from '../../components/FlexBlock';
import helperFunctions from '../../Utility/HelperFunctions';
import C from '../../Utility/Constants';
import puzzleObject from '../../data/FlexBlock_Puzzle_7.json';

class PuzzlePlay extends React.Component {

  state = {
    //The fully created puzzle component
    flexBlockGoalPuzzle: null,
    flexBlockWorkPuzzle: null,
    //the flow is that upon flexblock selection (via user click), it calls PuzzlePlay's handleFlexBlockRequest which updates the state's selectedFlexBlockHandler. The sole purpose is to pass the flexblock's handler to the toolkit via props. From that point, toolkit handshakes with the flexblock to allow the two to communicate together.
    selectedFlexBlock: null,
    workBaseBoard: null,
    goalBaseBoard: null,
  }

  componentDidMount() {
    this.setState({ flexBlockWorkPuzzle: this.loadWorkPuzzle() })
    this.setState({ flexBlockGoalPuzzle: this.loadGoalPuzzle() })
  }

  componentDidUpdate() {

  }

  createChildren = (initialChildDetailsArray) => {
    let children = [helperFunctions.createDefaultDetailsObj(), helperFunctions.createDefaultDetailsObj()];
    return children;
  }

  createPuzzle = () => {
    const parentDetails = helperFunctions.createDetailsObj({ isBaseBoard: true, size: { x: 5, y: 5 }, flexDirection: 'row', alignSelf: 'center' })

    let children = this.createChildren();

    const parent = <FlexBlock
      key={parentDetails.id}
      details={parentDetails}
      initialChildDetailsArray={children}
      selectedListener={this.newFlexBlockSelected}
      receiveBaseBoardHandle={this.receiveBaseBoardHandle}
      layer={0}
    />

    return parent;
  }

  createDetailIDs = (puzzleDetailObject) => {
    puzzleDetailObject.id = uuidv4();

    if (puzzleDetailObject.initialChildDetailsArray.length) {
      puzzleDetailObject.initialChildDetailsArray.forEach(detail => {
        this.createDetailIDs(detail)
      });
    }
  }

  loadGoalPuzzle = () => {
    // const parentDetails = helperFunctions.createDetailsObj(puzzleObject.flexBlockDetails)
    let puzzleObjectClone = cloneDeep(puzzleObject)
    this.createDetailIDs(puzzleObjectClone);

    const parent = <FlexBlock
      key={puzzleObjectClone.id}
      details={puzzleObjectClone}
      initialChildDetailsArray={puzzleObjectClone.initialChildDetailsArray}
      selectedListener={this.newFlexBlockSelected}
      receiveBaseBoardHandle={this.receiveBaseBoardHandle}
      layer={0}
      isWorkPuzzle={false}
    />

    return parent;
  }

  //Loads the empty baseboard for this puzzle with standard initialization
  loadWorkPuzzle = () => {
    const { initialChildDetailsArray, ...details } = puzzleObject
    let parentDetails = cloneDeep(details);
    parentDetails.alignItems = "start";
    parentDetails.justifyContent = "start";
    parentDetails.flexDirection = "row";
    parentDetails = helperFunctions.createDetailsObj(parentDetails);
    const parent = <FlexBlock
      key={parentDetails.id}
      details={parentDetails}
      initialChildDetailsArray={[]}
      selectedListener={this.newFlexBlockSelected}
      receiveBaseBoardHandle={this.receiveBaseBoardHandle}
      layer={0}
      isWorkPuzzle={true}
    />

    return parent;
  }

  receiveBaseBoardHandle = (baseBoardHandle, isWorkBaseBoard) => {
    if (isWorkBaseBoard) {
      this.setState({ workBaseBoard: baseBoardHandle })
    }
    else {
      this.setState({ goalBaseBoard: baseBoardHandle })
    }
  }

  newFlexBlockSelected = (selectedFlexBlock) => {

    this.setState({ selectedFlexBlock: selectedFlexBlock });
  }

  attemptSave = () => {
    let saveObject = this.state.workBaseBoard.attemptSave();
    console.log(saveObject);

    const a = document.createElement("a");
    const content = JSON.stringify(saveObject);
    const file = new Blob([content], { type: 'text/plain' });
    a.href = URL.createObjectURL(file);
    a.download = 'FlexBlock_Puzzle.json';
    a.click();
  }

  checkEquivalence = (goalChildren, submissionChildren, goalIdTrail, submissionIdTrail) => {
    //submission/goal info objects: {size: size, position: position, id: id, childSubmissionInfoArray: childSubmissionInfoArray};

    let matchingSubmissionIndexes = [];

    //any goalChilds that the relating submission failed to match
    let goalMismatches = []
    //any extra submission childs remaining after all goalChilds were matched.
    let submissionMismatches = []

    for (const goalChild of goalChildren) {
      const match = submissionChildren.findIndex(submissionChild => {
        const sizeX = submissionChild.size.x === goalChild.size.x;
        const sizeY = submissionChild.size.y === goalChild.size.y;
        const posX = submissionChild.position.x === goalChild.position.x;
        const posY = submissionChild.position.y === goalChild.position.y;
        return (sizeX && sizeY && posX && posY);
      })

      if (match === -1) {
        goalMismatches.push([...goalIdTrail, goalChild.id]);
      }
      else {
        matchingSubmissionIndexes.push(match);
      }
    }

    if (goalMismatches.length) return { goalMismatches: goalMismatches, submissionMismatches: [] };

    //By this point all the goal ids were matched, but there may be extra submissionChildren to cause a mismatch
    const remainingSubmissionChildren = submissionChildren.filter((submissionChild, possibleRemainingIndex) => {
      return matchingSubmissionIndexes.indexOf(possibleRemainingIndex) === -1
    })
    for (const remainingSubmissionChild of remainingSubmissionChildren) {
      submissionMismatches.push([...submissionIdTrail, remainingSubmissionChild.id])
    }

    if (submissionMismatches.length) return { goalMismatches: [], submissionMismatches: submissionMismatches };

    //By this point everything should match. Now, we need to recursively go into the matching goal and submission children to see if their children also match. We already know which submission corresponds to which goal thanks to the matchingSubmissionIndexes array.
    let result = { goalMismatches: [], submissionMismatches: [] }
    for (let i = 0; i < goalChildren.length; i++) {
      const goalChild = goalChildren[i];
      const correspondingSubmissionChild = submissionChildren[matchingSubmissionIndexes[i]];

      //To prevent infinite recursion, the recursion only occurs if the children themselves have further children to check equivalence for.
      if (goalChild.childSubmissionInfoArray.length || correspondingSubmissionChild.childSubmissionInfoArray.length) {
        const childResult = this.checkEquivalence(
          goalChild.childSubmissionInfoArray,
          correspondingSubmissionChild.childSubmissionInfoArray,
          [...goalIdTrail, goalChild.id],
          [...submissionIdTrail, correspondingSubmissionChild.id]
        )

        result.goalMismatches = result.goalMismatches.concat(childResult.goalMismatches);
        result.submissionMismatches = result.submissionMismatches.concat(childResult.submissionMismatches);
      }
    }

    return result;
  }

  attemptSubmit = () => {
    const goal = this.state.goalBaseBoard.getSubmissionInfo();
    const submission = this.state.workBaseBoard.getSubmissionInfo();
    const result = this.checkEquivalence(goal.childSubmissionInfoArray, submission.childSubmissionInfoArray, [goal.id], [submission.id]);

    console.log(`---
    goal`);
    console.log(goal);

    console.log(`---
    submission`);
    console.log(submission);

    console.log(`---
    result`);
    console.log(result)
  }

  render() {
    return (
      <div className='puzzle-pg'>
        <Toolkit selectedFlexBlock={this.state.selectedFlexBlock} />
        <section className='puzzle-section'>
          <h2 className='puzzle-section__title'>Workspace</h2>

          <div className='puzzle-section__infobar'>

            <div className='layer-subsection'>
              <h3 className='layer-subsection__title'>Layer Legend</h3>
              <div className='layer-legend'>
                {C.layers.map((layerColor, i) => {
                  return (
                    <div key={'layerColor' + i} className={`layer-info-ctr`}>
                      <p className='layer-info-ctr__level'>{i}</p>
                      <div className={`layer-info-ctr__color layer-info-ctr__color--${i + 1}`}></div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className='action-btn-subsection'>
              <button className='save-btn' onClick={this.attemptSave}>SAVE</button>
              <button className='submit-btn' onClick={this.attemptSubmit}>SUBMIT</button>
            </div>

          </div>

          {this.state.flexBlockWorkPuzzle}

        </section>


        <section className='puzzle-section puzzle-section--goal'>
          <h2 className='puzzle-section__title'>Goal</h2>
          <div className='puzzle-section__infobar'>
            <div className='puzzle-stats'>
              <p className='puzzle-stats__name'>Puzzle #1</p>
              <p className='puzzle-stats__difficulty'>Difficulty: Easy</p>
            </div>
            <button className='exit-btn'>EXIT</button>
          </div>

          {this.state.flexBlockGoalPuzzle}

        </section>
      </div>

    )
  }
}

export default PuzzlePlay;