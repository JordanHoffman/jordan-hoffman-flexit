import React from 'react';

import './PuzzlePlay.scss';
import Toolkit from '../../components/Toolkit';
import FlexBlock from '../../components/FlexBlock';
import helperFunctions from '../../Utility/HelperFunctions';
import C from '../../Utility/Constants';

class PuzzlePlay extends React.Component {

  state = {
    //The fully created puzzle component
    flexBlockPuzzle: null,
    //the flow is that upon flexblock selection (via user click), it calls PuzzlePlay's handleFlexBlockRequest which updates the state's selectedFlexBlockHandler. The sole purpose is to pass the flexblock's handler to the toolkit via props. From that point, toolkit handshakes with the flexblock to allow the two to communicate together.
    selectedFlexBlock: null,
    baseBoard: null
  }

  componentDidMount() {
    this.setState({ flexBlockPuzzle: this.createPuzzle() })
  }

  componentDidUpdate() {

  }

  createChildren = () => {
    let children = [helperFunctions.createDefaultDetailsObj(), helperFunctions.createDefaultDetailsObj()];
    return children;
  }

  createPuzzle = () => {
    const details = helperFunctions.createDetailsObj({ isBaseBoard: true, size: { x: 5, y: 5 }, flexDirection: 'column' })

    let children = this.createChildren();
    const parent = <FlexBlock
      key={details.id}
      details={details}
      initialChildDetailsArray={children}
      selectedListener={this.newFlexBlockSelected}
      receiveBaseBoardHandle={this.receiveBaseBoardHandle}
      layer={0}
    />
    return parent;
  }

  receiveBaseBoardHandle = (baseBoardHandle) => {
    this.setState({ baseBoard: baseBoardHandle })
  }

  newFlexBlockSelected = (selectedFlexBlock) => {

    this.setState({ selectedFlexBlock: selectedFlexBlock });
    // const key = Object.keys(req)[0]
    // const data = req[key]
    // switch (key) {
    //   case 'selected':
    //     this.setState({selectedFlexBlockHandler: data});
    //     break;
    //   default:
    //     console.warn('invalid request to puzze play pg from flexblock: ' + req)
    // }
  }



  render() {
    return (
      <div className='puzzle-pg'>
        <Toolkit selectedFlexBlock={this.state.selectedFlexBlock} />
        <section className='puzzle-section'>
          <h2 className='puzzle-section__title'>Workspace</h2>

          <div className='puzzle-section__info-navbar'>

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
              <button className='save-btn'>SAVE</button>
              <button className='submit-btn'>SUBMIT</button>
            </div>

          </div>

          {this.state.flexBlockPuzzle}

        </section>


        <section className='puzzle-section puzzle-section--goal'>
          <h2 className='puzzle-section__title'>Goal</h2>
        </section>
      </div>

    )
  }
}

export default PuzzlePlay;