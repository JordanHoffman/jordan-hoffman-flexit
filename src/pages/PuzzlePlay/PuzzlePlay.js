import React from 'react';
import {v4 as uuidv4} from 'uuid'; 

import './PuzzlePlay.scss';
import Toolkit from '../../components/Toolkit';
import FlexBlock from '../../components/FlexBlock';

class PuzzlePlay extends React.Component {

  state={
    flexBlockPuzzle : null,
    selectedFlexBlockHandler : null,
  }

  componentDidMount() {
    this.setState({flexBlockPuzzle: this.createPuzzle()})
  }

  createChildren = () =>{
    let children = [{},{}];
    return children;
  }

  createPuzzle = () => {
    let boardDetails = {
      isBaseBoard:true,
      direction: 'column',
      initialSize: {x: 5, y: 5}
    }

    let children = this.createChildren();
    const parent = <FlexBlock 
    details={boardDetails} 
    initialChildData={children} 
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