import React from 'react';
import './PuzzlePlay.scss';
import FlexBlock from '../../components/FlexBlock';

class PuzzlePlay extends React.Component {

  createChildren = ()=>{
    let children = [];
    for (let i=0; i< 2; i++) {
      children.push(<FlexBlock />)
    }
    return children;
  }

  render(){
    const children = this.createChildren();

    const details = {
      isBaseBoard:true,
      direction: 'column'
    }

    return(
      <div className='puzzle-pg'>
        <h1>Puzzle Page</h1>
        <FlexBlock details={details} children={children}/>
      </div>

    )
  }
}

export default PuzzlePlay;