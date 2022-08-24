import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { cloneDeep } from 'lodash';
import axios from 'axios';

import './PuzzlePlay.scss';
import Toolkit from '../../components/Toolkit';
import FlexBlock from '../../components/FlexBlock';
import helperFunctions from '../../Utility/HelperFunctions';
import C from '../../Utility/Constants';
import { API_URL } from '../../config';
import { Link } from 'react-router-dom';
import Loading from "../../components/LoadingAnimation";

class PuzzlePlay extends React.Component {

  state = {
    flexBlockGoalPuzzle: null,
    flexBlockWorkPuzzle: null,
    selectedFlexBlock: null,
    workBaseBoard: null,
    goalBaseBoard: null,
    puzzleDifficulty: null,
    puzzleNumber: null,
    won: false,
    saveStatus: C.saveStatus.Ready,
    userAlreadyCompleted: false
  }

  winTimeoutId = null;
  saveTimeoutId = null;

  componentDidMount() {
    // Use this instead of loadWorkPuzzle for developer mode where you can create new puzzles for the user to play that have different baseboard sizes
    // this.setState({flexBlockWorkPuzzle: this.createPuzzle()})

    const puzzleId = this.props.match.params.puzzleId;

    let reqst = API_URL ? API_URL : ('http://' + document.location.hostname + ":8080/");

    //If user is logged in, retrieve specific user data on puzzle
    if (this.props.location.state && this.props.location.state.loginToken) {

      axios.get((reqst + 'api/users/specific/' + puzzleId), {
        headers: {
          authorization: `Bearer ${this.props.location.state.loginToken}`,
        }
      })
        .then((resp) => {
          const puzzleObject = JSON.parse(resp.data.puzzleObject);

          const hasSavedData = resp.data.savedPuzzle ? true : false;
          const workPuzzleObject = resp.data.savedPuzzle ? JSON.parse(resp.data.savedPuzzle) : puzzleObject;
          this.setState({ flexBlockWorkPuzzle: this.loadWorkPuzzle(workPuzzleObject, hasSavedData), puzzleDifficulty: resp.data.difficulty, puzzleNumber: resp.data.number, userAlreadyCompleted: resp.data.complete })
          this.setState({ flexBlockGoalPuzzle: this.loadSavedPuzzle(puzzleObject, false) })
        })
        .catch((error) => {
          console.error(error)
        })
    }
    //If user is not logged in, retrieve specific generic data on puzzle
    else {
      axios.get(reqst + 'api/puzzles/specific/' + puzzleId)
        .then((resp) => {
          const puzzleObject = JSON.parse(resp.data.puzzleObject);
          this.setState({ flexBlockWorkPuzzle: this.loadWorkPuzzle(puzzleObject, false), puzzleDifficulty: resp.data.difficulty, puzzleNumber: resp.data.number })
          this.setState({ flexBlockGoalPuzzle: this.loadSavedPuzzle(puzzleObject, false) })
        })
        .catch((error) => {
          console.error(error)
        })
    }
  }

  componentDidUpdate() {
    if (this.state.won && !this.winTimeoutId) {
      this.winTimeoutId = setTimeout(() => {
        //This safeguard is for if anyone should just bypass the stage select and put the url of an exact puzzle play pg to start off with.
        if (this.props.location.state && this.props.location.state.prevPg === 'stage-select') {
          this.props.history.pop();
        }
        else {
          this.props.history.replace('/select')
        }
      }, 2500);
    }
  }

  componentWillUnmount() {
    clearTimeout(this.winTimeoutId);
    clearTimeout(this.saveTimeoutId);
  }

  //This legacy function is still useful for experimenting/creating puzzles with different baseboard sizes.
  createPuzzle = () => {
    const parentDetails = helperFunctions.createDetailsObj({ isBaseBoard: true, size: { x: 7, y: 7 }, flexDirection: 'row', alignSelf: 'center' })

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

  createDetailIDs = (puzzleDetailObject) => {
    puzzleDetailObject.id = uuidv4();

    if (puzzleDetailObject.initialChildDetailsArray.length) {
      puzzleDetailObject.initialChildDetailsArray.forEach(detail => {
        this.createDetailIDs(detail)
      });
    }
  }

  loadGoalPuzzle = (puzzleObject) => {
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

  //Loads either a saved work puzzle if the argument is true, or the target goal puzzle if false
  loadSavedPuzzle(puzzleObject, isWorkPuzzle) {
    let puzzleObjectClone = cloneDeep(puzzleObject)
    this.createDetailIDs(puzzleObjectClone);

    const parent = <FlexBlock
      key={puzzleObjectClone.id}
      details={puzzleObjectClone}
      initialChildDetailsArray={puzzleObjectClone.initialChildDetailsArray}
      selectedListener={this.newFlexBlockSelected}
      receiveBaseBoardHandle={this.receiveBaseBoardHandle}
      layer={0}
      isWorkPuzzle={isWorkPuzzle}
    />

    return parent;
  }

  //Loads either the saved puzzle if there is one, or an empty baseboard with standard initialization
  loadWorkPuzzle = (puzzleObject, fromSaved) => {
    if (fromSaved) {
      return this.loadSavedPuzzle(puzzleObject, true);
    }

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

    const puzzleId = this.props.match.params.puzzleId;
    let reqst = API_URL ? API_URL : ('http://' + document.location.hostname + ":8080/");

    this.setState({saveStatus: C.saveStatus.Saving});
    axios.put((reqst + 'api/users/saveSpecific/' + puzzleId), {puzzleObject: saveObject}, {
      headers: {
        authorization: `Bearer ${this.props.location.state.loginToken}`,
      }
    })
      .then((resp) => {
        //successful save
        this.setState({saveStatus: C.saveStatus.CompleteMessage})
        this.saveTimeoutId = setTimeout(() => {
          this.setState({saveStatus: C.saveStatus.Ready})
        }, 1000);
      })
      .catch((error) => {
        console.warn('unable to save with following error:')
        console.warn(error);
        this.setState({saveStatus: C.saveStatus.Ready})
      })
  }


  attemptDownload = () => {
    let saveObject = this.state.workBaseBoard.attemptSave();

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

    let victory = true;
    if (result.goalMismatches.length) {
      victory = false;
      this.state.goalBaseBoard.findAndDisplayMismatches(result.goalMismatches)
    }
    if (result.submissionMismatches.length) {
      victory = false;
      this.state.workBaseBoard.findAndDisplayMismatches(result.submissionMismatches)
    }

    if (victory) {
      //if user logged in and this puzzle is not recorded as a win, the submit to DB that it was won
      const puzzleId = this.props.match.params.puzzleId;
      let reqst = API_URL ? API_URL : ('http://' + document.location.hostname + ":8080/");

      if (this.props.location.state && this.props.location.state.loginToken && !this.state.userAlreadyCompleted) {
        axios.put((reqst + 'api/users/completedSpecific/' + puzzleId), {}, {
          headers: {
            authorization: `Bearer ${this.props.location.state.loginToken}`,
          }
        })
          .then((resp) => {
            this.setState({ won: true });
          })
          .catch((error) => {
            console.error(error);
            this.setState({ won: true });
          })
      } else {
        this.setState({ won: true });
      }
    }
  }

  render() {
    const loggedIn = this.props.location.state && this.props.location.state.loginToken;

    let saveButtonDisplay = 'save';
    let saveButtonDisable = false;
    let saveButtonModifier = ''
    if (this.state.saveStatus === C.saveStatus.Saving) {
      saveButtonModifier = ' action-btn--saveInProgress'
      saveButtonDisplay = <>{'a'}<Loading ctrOverrideClass='save-animation-ctr'/></>
      saveButtonDisable = true
    } else if (this.state.saveStatus === C.saveStatus.CompleteMessage) {
      saveButtonModifier = ' action-btn--saveCmpltMsg'
      saveButtonDisplay = 'saved!';
      saveButtonDisable = true;
    }

    return (
      <div className={'puzzle-pg' + (this.state.won ? " puzzle-pg--disable" : "")}>
        <div className={'win-screen' + (this.state.won ? " win-screen--show" : "")}>WINNER!</div>
        <Toolkit selectedFlexBlock={this.state.selectedFlexBlock} />

        <section className='puzzle-section'>

          <h2 className='puzzle-section__title'>Workspace</h2>

          <div className='puzzle-section__contents'>

            <div className='puzzle-section__infobar'>

              <div className='layer-subsection'>
                <h3 className='layer-subsection__title'>Layer Legend</h3>
                <div className='layer-legend'>
                  {C.layers.map((layerColor, i) => {
                    return (
                      <div key={'layerColor' + i} className={`layer-info-ctr`}>
                        <p className='layer-info-ctr__level layer-info-ctr__level--tablet'>{i}</p>
                        <div className={`layer-info-ctr__color layer-info-ctr__color--${i + 1}`}>
                          <p className='layer-info-ctr__level layer-info-ctr__level--mobile'>{i}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className='action-btn-subsection'>
                {loggedIn && <button className={'action-btn action-btn--save' + saveButtonModifier} disabled={saveButtonDisable} onClick={this.attemptSave}>{saveButtonDisplay}</button>}
                <button className='action-btn action-btn--submit' onClick={this.attemptSubmit}>SUBMIT</button>
              </div>


            </div>

            {this.state.flexBlockWorkPuzzle}
          </div>

        </section>


        <section className='puzzle-section puzzle-section--goal'>
          <h2 className='puzzle-section__title'>Goal</h2>

          <div className='puzzle-section__contents'>
            <div className='puzzle-section__infobar'>
              <div className='puzzle-stats'>
                <p className='puzzle-stats__name'>{`Puzzle #${this.state.puzzleNumber}`}</p>
                <p className='puzzle-stats__difficulty'>{`Difficulty: ${this.state.puzzleDifficulty}`}</p>
              </div>
              <Link to={{ pathname: '/' }} className='action-btn action-btn--exit'>EXIT</Link>
            </div>

            {this.state.flexBlockGoalPuzzle}
          </div>

        </section>
      </div>

    )
  }
}

export default PuzzlePlay;