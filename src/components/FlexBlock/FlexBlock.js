import React from 'react';
import './FlexBlock.scss';

class FlexBlock extends React.Component {

  state = {
    directChildren : this.props.unheldChildren
  }

  getBoardPos = () =>{
    const parentPos = this.props.parentBoardPos;
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
    console.log(this.state.directChildren)
  }

  render(){
    let className = 'flexblock';
    const base=className;

    if (this.props.details.isBaseBoard) className += ` ${base}--base-board`;
    if (this.props.details.direction === "column") className += ` ${base}--dir-column`;

    return(
      <div className={className}>
        {this.state.directChildren.map(unheldChild => {
          return (React.cloneElement(unheldChild, {parentAsk:this.parentAsk}))
        })}
      </div>
    )
  }
}

FlexBlock.defaultProps = {
  details:{},
  parentBoardPos: 0,
  unheldChildren: []
};

export default FlexBlock;