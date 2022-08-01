import React from 'react';

import './PuzzlePlay.scss';
import Toolkit from '../../components/Toolkit';
import FlexBlock from '../../components/FlexBlock';
import helperFunctions from '../../Utility/HelperFunctions';

class PuzzlePlay extends React.Component {

  state={
    flexBlockPuzzle : null,
    //the flow is that upon flexblock selection (via user click), it calls PuzzlePlay's handleFlexBlockRequest which updates the state's selectedFlexBlockHandler. The sole purpose is to pass the flexblock's handler to the toolkit via props. From that point, toolkit handshakes with the flexblock to allow the two to communicate together.
    selectedFlexBlockHandler : null,
  }

  componentDidMount() {
    this.setState({flexBlockPuzzle: this.createPuzzle()})
  }

  createChildren = () =>{
    let children = [helperFunctions.createDefaultDetailsObj(), helperFunctions.createDefaultDetailsObj()];
    return children;
  }

  createPuzzle = () => {
    const details = helperFunctions.createDetailsObj({isBaseBoard: true, size:{x:5,y:5} , flexDirection: 'column'})

    let children = this.createChildren();
    const parent = <FlexBlock 
    key={details.id}
    details={details} 
    childDetailsArray={children} 
    playPageHandle={this.handleFlexBlockRequest}
    />
    return parent;
  }

  handleFlexBlockRequest = (req) => {
    const key = Object.keys(req)[0]
    const data = req[key]
    switch (key) {
      case 'selected':
        this.setState({selectedFlexBlockHandler: data});
        break;
      default:
        console.warn('invalid request to puzze play pg from flexblock: ' + req)
    }
  }



  render(){
    return(
      <div className='puzzle-pg'>
        <Toolkit selectedFlexBlockHandler={this.state.selectedFlexBlockHandler}/>
        <h1>Puzzle Page</h1>
        {this.state.flexBlockPuzzle}
      </div>

    )
  }
}

export default PuzzlePlay;