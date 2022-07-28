import React from 'react';
import './FlexBlock.scss';

/**
 * List of props
 * key
 * parentAsk - a function to allow communication to the parent flexblock
 * unheldchildren - the jsx component objects that will be rendered by cloning with the parentAsk prop added
 * playPageHandle - a function to allow communication to the PuzzlePlay Page Component
 */
class FlexBlock extends React.Component {

  state = {
    directChildren : this.props.unheldChildren,
    size: {x:1, y:1},
    boardOffset : this.props.boardOffset
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
        {this.state.directChildren.map(unheldChild => {
          return (React.cloneElement(unheldChild, {
            parentAsk:this.parentAsk,
            boardOffset: this.state.boardOffset
          }))
        })}
      </div>
    )
  }
}

FlexBlock.defaultProps = {
  details:{},
  parentBoardPos: 0,
  unheldChildren: [],
  boardOffset:{x:0,y:0}
};

export default FlexBlock;