import React from 'react';
import { cloneDeep } from 'lodash';

import './FlexBlock.scss';
import helperFunctions from '../../Utility/HelperFunctions';


/**
 * List of props
 * key
 * details - an object with details pertaining to this specific flexblock
 * parentAsk - a function to allow communication to the parent flexblock
 * selectedListener - a function to give a handle to the newly selected flexblock onclick.
 * initialChildData - gives array of child data objects for constructing the goal puzzle and/or building up a loaded puzzle to continue.
 */
class FlexBlock extends React.Component {

  state = {
    details: this.props.details,
    boardOffset: this.props.boardOffset,
    childDetailsArray: this.props.childDetailsArray
  }

  //meant for getting the position in the DOM.
  selfRef = React.createRef();
  //will hold a callback function from toolkit to allow initiation of a request to toolkit.
  toolkitHandler = null;

  getBoardPos = () => {
    let [xPos, yPos] = [this.selfRef.current.getBoundingClientRect().x, this.selfRef.current.getBoundingClientRect().y]
    if (this.props.boardOffset.x || this.props.boardOffset.y) {
      xPos -= this.props.boardOffset.x;
      yPos -= this.props.boardOffset.y;
    }
    return { x: xPos, y: yPos };
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
    if (this.state.details.isBaseBoard) {
      //set the boardOffset that all other inner flexblocks will need for their location calculation. Update this board offset on window resize.
      const [xPos, yPos] = [this.selfRef.current.getBoundingClientRect().x, this.selfRef.current.getBoundingClientRect().y]
      this.setState({ boardOffset: { x: xPos, y: yPos } })

      window.addEventListener('resize', e => {
        const [xPos, yPos] = [this.selfRef.current.getBoundingClientRect().x, this.selfRef.current.getBoundingClientRect().y]
        this.setState({ boardOffset: { x: xPos, y: yPos } })
      })

      //Give the toolkit an initial handle to the base board flexblock.
      this.props.receiveBaseBoardHandle(this);
      this.props.selectedListener(this);
    }
  }

  createInside = () => {
    if (this.state.details.flexDirection === 'row'){
      let totalChildrenWidth = 0;
      for (const childDetails of this.state.childDetailsArray) {
        totalChildrenWidth += childDetails.size.x;
      }
      if (totalChildrenWidth < this.state.details.size.x) {
        const newChild = helperFunctions.createDefaultDetailsObj();

        this.setState({childDetailsArray: [...this.state.childDetailsArray, newChild]})
      }
    }
    else { //column
      let totalChildrenHeight = 0;
      for (const childDetails of this.state.childDetailsArray) {
        totalChildrenHeight += childDetails.size.y;
      }
      if (totalChildrenHeight < this.state.details.size.y) {
        const newChild = helperFunctions.createDefaultDetailsObj();

        this.setState({childDetailsArray: [...this.state.childDetailsArray, newChild]})
      }
    }
  }

  handleRequest = (req) => {
    const reqName = Object.keys(req)[0];
    const reqData = req[reqName];

    switch (reqName) {
      case 'receiveToolkitRequestHandler':
        this.toolkitHandler = reqData;
        break;
      case 'getInfoForToolkit':
        return cloneDeep(this.state.details);
      case 'createInside':
        //TODO: Check if you have room to add another flexblock and then..... JUST DO IT!!!!!!!!
        break;
      default:
        throw new Error(`Invalid request sent to flexblock with name: ${reqName}`);
    }


    console.log('received request: ' + Object.keys(req)[0]);
    console.log('my y position: ' + this.getBoardPos().y);
  }

  handleClick = (e) => {
    this.props.selectedListener(this);
    e.stopPropagation();
  }

  render() {
    let className = 'flexblock';
    const base = className;

    if (this.state.details.isBaseBoard) className += ` ${base}--base-board`;
    if (this.state.details.flexDirection === "column") className += ` ${base}--dir-column`;

    return (
      <div className={className} ref={this.selfRef} onClick={this.handleClick}>
        {this.state.childDetailsArray.map(childDetailObj => {
          return (
            <FlexBlock
              key={childDetailObj.id}
              details={childDetailObj}
              parentAsk={this.parentAsk}
              boardOffset={this.state.boardOffset}
              selectedListener={this.props.selectedListener}
            />
          )
        })}
      </div>
    )
  }
}

FlexBlock.defaultProps = {
  details: helperFunctions.createDefaultDetailsObj(),
  parentBoardPos: 0,
  boardOffset: { x: 0, y: 0 },
  childDetailsArray: []
};

export default FlexBlock;