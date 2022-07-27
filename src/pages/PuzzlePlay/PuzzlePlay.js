import React from 'react';
import {v4 as uuidv4} from 'uuid'; 

import './PuzzlePlay.scss';
import FlexBlock from '../../components/FlexBlock';

class PuzzlePlay extends React.Component {

  state={
    flexBlockPuzzle : null
  }

  createChildren = () =>{
    let children = [];
    for (let i=0; i< 2; i++) {
      children.push(<FlexBlock key={uuidv4()} parentAsk={null} />)
    }
    return children;
  }

  createPuzzle = () => {
    let boardDetails = {
      isBaseBoard:true,
      direction: 'column'
    }

    let children = this.createChildren();
    const parent = <FlexBlock details={boardDetails} unheldChildren={children} />
    return parent;
  }

  componentDidMount() {
    this.setState({flexBlockPuzzle: this.createPuzzle()})
  }

  render(){
    return(
      <div className='puzzle-pg'>
        <h1>Puzzle Page</h1>
        {this.state.flexBlockPuzzle}
      </div>

    )
  }
}

export default PuzzlePlay;