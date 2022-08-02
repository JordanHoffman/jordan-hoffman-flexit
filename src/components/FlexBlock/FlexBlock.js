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
    // details: this.props.details,
    boardOffset: this.props.boardOffset,
    childDetailsArray: this.props.initialChildDetailsArray
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

  // parentAsk = (request, theChild) => {
  //   switch (request) {
  //     case "listNumber":
  //       console.log(theChild);
  //       break;
  //     default:
  //       console.warn('invalid request asked to parent')
  //   }
  // }

  componentDidMount() {
    //Initial setup for the base flexblock involves 
    if (this.props.details.isBaseBoard) {
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

  //TODO: Handle special cases for complete overlap of single child to parent.
  parentHandleSizeAdjust = (dimension, adjustment, id) => {
    let updatedChildDetailsArray = cloneDeep(this.state.childDetailsArray);
    let updatedChildDetailObj = updatedChildDetailsArray.find(childDetailObj => childDetailObj.id === id);

    //DECREMENT logic handled in the child
    if (adjustment === 'decrement') {
      if (dimension === 'width') {
        updatedChildDetailObj.size.x -= 1;
      }
      else {
        updatedChildDetailObj.size.y -= 1;
      }
      this.setState({ childDetailsArray: updatedChildDetailsArray });
      return updatedChildDetailObj;
    }
    //INCREMENT
    else {
      //FLEX DIRECTION ROW
      if (this.props.details.flexDirection === 'row') {
        if (dimension === 'width') { //sum all to see
          const widthSum = this.state.childDetailsArray.reduce((prevSum, currChildDetails) => prevSum + currChildDetails.size.x, 0)
          if (widthSum < this.props.details.size.x) {
            updatedChildDetailObj.size.x += 1;
            this.setState({ childDetailsArray: updatedChildDetailsArray });
            return updatedChildDetailObj;
          }
          else return false;
        }
        else { //just check parent
          if (updatedChildDetailObj.size.y < this.props.details.size.y) {
            updatedChildDetailObj.size.y += 1;
            this.setState({ childDetailsArray: updatedChildDetailsArray });
            return updatedChildDetailObj;
          }
          else return false;
        }
      }
      //FLEX DIRECTION COLUMN
      else {

      }

    }
  }

  //Since a flexblock's details come from props, size adjusting must be handled by the parent.
  attemptSizeAdjust = (dimension, adjustment) => {
    //No size adjusting for the base board.
    if (this.props.details.isBaseBoard) return false;

    //DECREMENT
    if (adjustment === 'decrement') {
      if ((dimension === 'width' && this.props.details.size.x === 1) || (dimension === 'height' && this.props.details.size.y === 1)) {
        return false; //cant decrement if its already at its smallest
      }

      //FLEX DIRECTION ROW
      if (this.props.details.flexDirection === 'row') {
        //WIDTH 
        if (dimension === 'width'){ 
          //get sum of children width
          const widthSum = this.state.childDetailsArray.reduce((prevSum, currChildDetails) => prevSum + currChildDetails.size.x, 0)

          //Sufficient space to reduce width
          if (widthSum < this.props.details.size.x) {
            //Special case where reducing width would cause single child to completely overlap parent
            if (this.state.childDetailsArray.length === 1) {
              const childWidth = this.state.childDetailsArray[0].size.x;
              const childHeight = this.state.childDetailsArray[0].size.y;
              if (childWidth === this.props.details.size.x - 1 && childHeight === this.props.details.size.y) {
                return false //special case met
              }
            }
            //Width can be reduced. Let parent handle it.
            return this.props.parent.parentHandleSizeAdjust(dimension, adjustment, this.props.details.id);
          }
          //Not enough space to reduce width anymore
          else return false;
        }
        //HEIGHT
        else {
          const maxChildHeight = this.state.childDetailsArray.reduce((prevMax, currChildDetails) => prevMax > currChildDetails.size.y ? prevMax : currChildDetails.size.y, 0)
          if (this.props.details.size.y > maxChildHeight) {
            //Special case where reducing height would make the child completely overlap it.
            if (this.state.childDetailsArray.length === 1) {
              const childWidth = this.state.childDetailsArray[0].size.x;
              const childHeight = this.state.childDetailsArray[0].size.y;
              if (childWidth === this.props.details.size.x && childHeight === this.props.details.size.y - 1) {
                return false //special case met
              }
            }
            //Height can be reduce. Let parent handle it.
            return this.props.parent.parentHandleSizeAdjust(dimension, adjustment, this.props.details.id);
          }
        }


      } 
      //FLEX DIRECTION COLUMN
      else {


      }
    }
    //INCREMENT logic handled in the parent
    else {
      return (this.props.parent.parentHandleSizeAdjust(dimension, adjustment, this.props.details.id));
    }
  }

  createInside = () => {
    //flex dir: row
    if (this.props.details.flexDirection === 'row') {
      let totalChildrenWidth = 0;
      for (const childDetails of this.state.childDetailsArray) {
        totalChildrenWidth += childDetails.size.x;
      }
      if (totalChildrenWidth < this.props.details.size.x) {
        const newChild = helperFunctions.createDefaultDetailsObj();

        this.setState({ childDetailsArray: [...this.state.childDetailsArray, newChild] })
      }
    }
    //flex dir: column
    else {
      let totalChildrenHeight = 0;
      for (const childDetails of this.state.childDetailsArray) {
        totalChildrenHeight += childDetails.size.y;
      }
      if (totalChildrenHeight < this.props.details.size.y) {
        const newChild = helperFunctions.createDefaultDetailsObj();

        this.setState({ childDetailsArray: [...this.state.childDetailsArray, newChild] })
      }
    }
  }

  handleClick = (e) => {
    this.props.selectedListener(this);
    e.stopPropagation();
  }

  render() {
    let className = 'flexblock';
    const base = className;

    if (this.props.details.isBaseBoard) className += ` ${base}--base-board`;
    if (this.props.details.flexDirection === "column") className += ` ${base}--dir-column`;
    className += ` ${base}--layer${this.props.layer}`

    const isBaseBoard = this.props.details.isBaseBoard;
    let parentSize;
    let width;
    let height;

    if (!isBaseBoard) {
      parentSize = this.props.parent.props.details.size;
      width = (this.props.details.size.x / parentSize.x) * 100 + '%';
      height = (this.props.details.size.y / parentSize.y) * 100 + '%';
    }

    return (
      <div className={className} style={!isBaseBoard ? { width: width, height: height } : {}} ref={this.selfRef} onClick={this.handleClick}>
        {this.state.childDetailsArray.map(childDetailObj => {
          return (
            <FlexBlock
              key={childDetailObj.id}
              details={childDetailObj}
              parent={this}
              boardOffset={this.state.boardOffset}
              selectedListener={this.props.selectedListener}
              layer={this.props.layer + 1}
            />
          )
        })}
      </div>
    )
  }
}

FlexBlock.defaultProps = {
  boardOffset: { x: 0, y: 0 },
  initialChildDetailsArray: [],
  parent: null
};

export default FlexBlock;