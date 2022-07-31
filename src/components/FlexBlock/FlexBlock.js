import React from 'react';
import './FlexBlock.scss';
import { v4 as uuidv4 } from 'uuid';

/**
 * List of props
 * key
 * parentAsk - a function to allow communication to the parent flexblock
 * playPageHandle - a function to allow communication to the PuzzlePlay Page Component
 * initialChildData - gives info for constructing the goal puzzle and/or building up a loaded puzzle to continue.
 */
class FlexBlock extends React.Component {

  state = {
    size: this.props.details.initialSize,
    boardOffset : this.props.boardOffset,
    childData : this.props.initialChildData.map(childDataObj => {return {...childDataObj, key:uuidv4()}})
  }

  selfRef = React.createRef();

  getBoardPos = () =>{
    let [xPos, yPos] = [this.selfRef.current.getBoundingClientRect().x, this.selfRef.current.getBoundingClientRect().y]
    if (this.props.boardOffset.x || this.props.boardOffset.y) {
      xPos -= this.props.boardOffset.x;
      yPos -= this.props.boardOffset.y;
    }
    return {x:xPos, y:yPos};
  }

  parentAsk = (request, theChild) => {
    switch (request) {
      case "listNumber":
        console.log(theChild);
        break;
      default:
          console.warn('invalid request asked to parent')
    }
  }

  componentDidMount() {
    //Initial setup for the base flexblock involves 
    if (this.props.details.isBaseBoard) {
      //set the boardOffset that all other inner flexblocks will need for their location calculation. Update this board offset on window resize.
      const [xPos, yPos] = [this.selfRef.current.getBoundingClientRect().x, this.selfRef.current.getBoundingClientRect().y]
      this.setState({boardOffset:{x: xPos, y:yPos}})

      window.addEventListener('resize', e => {
        const [xPos, yPos] = [this.selfRef.current.getBoundingClientRect().x, this.selfRef.current.getBoundingClientRect().y]
        this.setState({boardOffset:{x: xPos, y:yPos}})
      })

      //Give the toolkit an initial handle to the base board flexblock.
      this.props.playPageHandle( {'selected': this.handleRequest});
    }
  }

  componentDidUpdate() {
    // console.log(this.getBoardPos());
  }

  handleRequest = () => {
    console.log('received request');
    console.log('my y position: ' + this.getBoardPos().y);
  }

  handleClick = (e)=> {
    this.props.playPageHandle( {'selected': this.handleRequest});
    e.stopPropagation();
  }

  render(){
    let className = 'flexblock';
    const base=className;

    if (this.props.details.isBaseBoard) className += ` ${base}--base-board`;
    if (this.props.details.direction === "column") className += ` ${base}--dir-column`;

    return(
      <div className={className} ref={this.selfRef} onClick={this.handleClick}>
        {this.state.childData.map(childDataObj => {
          return (
            <FlexBlock 
              key={childDataObj.key} 
              parentAsk={this.parentAsk}
              boardOffset={this.state.boardOffset}
              playPageHandle={this.props.playPageHandle}
            />
          )
        })}
      </div>
    )
  }
}

FlexBlock.defaultProps = {
  details:{
    initialSize : {x: 1, y:1}
  },
  parentBoardPos: 0,
  unheldChildren: [],
  boardOffset:{x:0,y:0},
  initialChildData : []
};

export default FlexBlock;