import React from 'react';
import './FlexBlock.scss';

/**
 * Howdy pal
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
    if (this.props.details.isBaseBoard) {
      const [xPos, yPos] = [this.selfRef.current.getBoundingClientRect().x, this.selfRef.current.getBoundingClientRect().y]
      this.setState({boardOffset:{x: xPos, y:yPos}})
    }
  }

  componentDidUpdate() {
    // console.log(this.getBoardPos());
  }

  handlePlayPageRequest = () => {
    console.log('received play pg request');
    console.log('my y position: ' + this.getBoardPos().y);
  }

  handleClick = (e)=> {
    this.props.playPageHandle( {'selected': this.handlePlayPageRequest});
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