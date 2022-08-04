import React from 'react';
import { cloneDeep, update } from 'lodash';

import './FlexBlock.scss';
import helperFunctions from '../../Utility/HelperFunctions';


/**
 * List of props
 * 
 * key
 * details - an object with details pertaining to this specific flexblock
 * parent - a reference to the parent flexblock
 * selectedListener - a function which is passed a handle to this flexblock when it gets clicked.
 * initialChildDetailsArray - gives array of child flexblock details objects this flexblock will render as its flexblock children.
 */
class FlexBlock extends React.Component {

  state = {
    baseBoardDetails: this.props.details.isBaseBoard ? this.props.details : null,
    boardOffset: this.props.boardOffset,
    childDetailsArray: this.props.initialChildDetailsArray,
    isSelected: false
  }

  //meant for getting the position in the DOM.
  selfRef = React.createRef();
  getBoardPos = () => {
    let [xPos, yPos] = [this.selfRef.current.getBoundingClientRect().x, this.selfRef.current.getBoundingClientRect().y]
    if (this.props.boardOffset.x || this.props.boardOffset.y) {
      xPos -= this.props.boardOffset.x;
      yPos -= this.props.boardOffset.y;
    }
    return { x: xPos, y: yPos };
  }

  componentDidMount() {
    //Initial setup for the base flexblock 
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
      this.selectSelf();
    }
  }

  selectSelf() {
    this.props.selectedListener(this);
    this.setState({ isSelected: true });
  }

  deselect = () => {
    this.setState({ isSelected: false });
  }

  parentHandleChangeFlexDirection = (direction, id) => {
    let updatedChildDetailsArray = cloneDeep(this.state.childDetailsArray);
    let updatedChildDetailObj = updatedChildDetailsArray.find(childDetailObj => childDetailObj.id === id);
    updatedChildDetailObj.flexDirection = direction;
    this.setState({childDetailsArray: updatedChildDetailsArray});
    return (updatedChildDetailObj);
  }

  attemptChangeFlexDirection = (direction) => {
    //NEED TO WARN IF YOU HAVE CHILDREN
    if (this.state.childDetailsArray.length) {
      this.setState({childDetailsArray: []});
    }

    if (this.props.details.isBaseBoard) {
      let updatedBaseBoardDetails = cloneDeep(this.state.baseBoardDetails)
      updatedBaseBoardDetails.flexDirection = direction;
      this.setState({baseBoardDetails: updatedBaseBoardDetails})
      return updatedBaseBoardDetails
    }
    else {
      return (this.props.parent.parentHandleChangeFlexDirection(direction, this.props.details.id))
    }
  } 

  //This function is only called by a child of this flexblock in order to get this flexblock to update its childDetailsArray and thus pass down new props for the child to actually be updated.
  parentHandleSizeAdjust = (dimension, adjustment, id) => {
    let updatedChildDetailsArray = cloneDeep(this.state.childDetailsArray);
    let updatedChildDetailObj = updatedChildDetailsArray.find(childDetailObj => childDetailObj.id === id);

    //DECREMENT logic handled in the child. By this point it's safe to update it.
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
        //WIDTH
        if (dimension === 'width') { //sum all to see
          const widthSum = this.state.childDetailsArray.reduce((prevSum, currChildDetails) => prevSum + currChildDetails.size.x, 0)
          //possible room to increase width further
          if (widthSum < this.props.details.size.x) {
            //Special case where increasing would cause single child to completely overlap parent
            if (this.state.childDetailsArray.length === 1) {
              const childWidth = this.state.childDetailsArray[0].size.x;
              const childHeight = this.state.childDetailsArray[0].size.y;
              if (childWidth === this.props.details.size.x - 1 && childHeight === this.props.details.size.y) {
                return false //special case met
              }
            }

            //width can safely be increased by this point
            updatedChildDetailObj.size.x += 1;
            this.setState({ childDetailsArray: updatedChildDetailsArray });
            return updatedChildDetailObj;
          }
          //no room to increase width further
          else return false
        }
        //HEIGHT
        else {
          //possible room to increase height further
          if (updatedChildDetailObj.size.y < this.props.details.size.y) {
            //Special case where increasing would cause single child to completely overlap parent
            if (this.state.childDetailsArray.length === 1) {
              const childWidth = this.state.childDetailsArray[0].size.x;
              const childHeight = this.state.childDetailsArray[0].size.y;
              if (childWidth === this.props.details.size.x && childHeight === this.props.details.size.y - 1) {
                return false //special case met
              }
            }
            //height can safely be increased by this point
            updatedChildDetailObj.size.y += 1;
            this.setState({ childDetailsArray: updatedChildDetailsArray });
            return updatedChildDetailObj;
          }
          //no room to increase height further
          else return false;
        }
      }
      //FLEX DIRECTION COLUMN
      else {
        //WIDTH
        if (dimension === 'width') {
          //possible room to increase width further
          if (updatedChildDetailObj.size.x < this.props.details.size.x) {
            //Special case where increasing would cause single child to completely overlap parent
            if (this.state.childDetailsArray.length === 1) {
              const childWidth = this.state.childDetailsArray[0].size.x;
              const childHeight = this.state.childDetailsArray[0].size.y;
              if (childWidth === this.props.details.size.x - 1 && childHeight === this.props.details.size.y) {
                return false //special case met
              }
            }
            //width can safely be increased by this point
            updatedChildDetailObj.size.x += 1;
            this.setState({ childDetailsArray: updatedChildDetailsArray });
            return updatedChildDetailObj;
          }
          //no room to increase width further
          else return false;
        }
        //HEIGHT
        else {
          const heightSum = this.state.childDetailsArray.reduce((prevSum, currChildDetails) => prevSum + currChildDetails.size.y, 0)
          //possible room to increase height further
          if (heightSum < this.props.details.size.y) {
            //Special case where increasing would cause single child to completely overlap parent
            if (this.state.childDetailsArray.length === 1) {
              const childWidth = this.state.childDetailsArray[0].size.x;
              const childHeight = this.state.childDetailsArray[0].size.y;
              if (childWidth === this.props.details.size.x && childHeight === this.props.details.size.y - 1) {
                return false //special case met
              }
            }

            //height can safely be increased by this point
            updatedChildDetailObj.size.y += 1;
            this.setState({ childDetailsArray: updatedChildDetailsArray });
            return updatedChildDetailObj;
          }
          //no room to increase height further
          else return false
        }
      }
    }
  }

  //Since a flexblock's details come from props, size adjusting that starts here must ultimately be handled by the parent, and thus a call to the parent's handling function will be made.
  attemptSizeAdjust = (dimension, adjustment) => {
    //No size adjusting for the base board.
    if (this.props.details.isBaseBoard) return false;

    //DECREMENT
    if (adjustment === 'decrement') {
      //Special case: can't decrement if its already at its smallest
      if ((dimension === 'width' && this.props.details.size.x === 1) || (dimension === 'height' && this.props.details.size.y === 1)) {
        return false;
      }

      //FLEX DIRECTION ROW
      if (this.props.details.flexDirection === 'row') {
        //WIDTH 
        if (dimension === 'width') {
          //get sum of children width
          const widthSum = this.state.childDetailsArray.reduce((prevSum, currChildDetails) => prevSum + currChildDetails.size.x, 0)

          //Possible space to reduce width
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
          //Possible space to reduce height
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
          //Not enough space to reduce height anymore
          else return false
        }
      }
      //FLEX DIRECTION COLUMN
      else {
        //WIDTH 
        if (dimension === 'width') {
          const maxChildWidth = this.state.childDetailsArray.reduce((prevMax, currChildDetails) => prevMax > currChildDetails.size.x ? prevMax : currChildDetails.size.x, 0)
          //Possible space to reduce width
          if (this.props.details.size.x > maxChildWidth) {
            //Special case where reducing parent size would make the single child completely overlap it.
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
          else return false
        }
        //HEIGHT
        else {
          //get sum of children height
          const heightSum = this.state.childDetailsArray.reduce((prevSum, currChildDetails) => prevSum + currChildDetails.size.y, 0)

          //Possible space to reduce height
          if (heightSum < this.props.details.size.y) {
            //Special case where reducing height of parent would cause single child to completely overlap parent
            if (this.state.childDetailsArray.length === 1) {
              const childWidth = this.state.childDetailsArray[0].size.x;
              const childHeight = this.state.childDetailsArray[0].size.y;
              if (childWidth === this.props.details.size.x && childHeight === this.props.details.size.y - 1) {
                return false //special case met
              }
            }
            //Height can be reduced. Let parent handle it.
            return this.props.parent.parentHandleSizeAdjust(dimension, adjustment, this.props.details.id);
          }
          //Not enough space to reduce height anymore
          else return false;
        }
      }
    }
    //INCREMENT logic has to be handled in the parent
    else {
      return (this.props.parent.parentHandleSizeAdjust(dimension, adjustment, this.props.details.id));
    }
  }

  spaceAvailableToCreateInside = () => {
    //special case of 1 x 1 block
    if (this.props.details.size.x === 1 && this.props.details.size.y === 1) return false;

    const key = this.props.details.flexDirection === 'row' ? 'x' : 'y';

    const childSum = this.state.childDetailsArray.reduce((prevSum, currChildDetails) => prevSum + currChildDetails.size[key], 0)
    if (childSum < this.props.details.size[key]) {
      return true;
    }
    return false;
  }

  attemptCreateInside = () => {
    if (this.spaceAvailableToCreateInside()) {
      const newChild = helperFunctions.createDefaultDetailsObj();
      this.setState({ childDetailsArray: [...this.state.childDetailsArray, newChild] })
      return true;
    }
    return false;
  }

  parentHandleCreateSibling = (sibling, id) => {
    //check if room is available
    if (this.spaceAvailableToCreateInside()) {
      const relativeIndex = this.state.childDetailsArray.findIndex(childDetailObj => childDetailObj.id === id);
      let updatedChildDetailsArray = [...this.state.childDetailsArray];
      let actualIndex = sibling === "before" ? relativeIndex : relativeIndex + 1;
      updatedChildDetailsArray.splice(actualIndex, 0, helperFunctions.createDefaultDetailsObj());

      this.setState({ childDetailsArray: updatedChildDetailsArray });
      return true;
    }

    return false;
  }

  attemptCreateSibling = (sibling) => {
    if (this.props.details.isBaseBoard) return false;
    return this.props.parent.parentHandleCreateSibling(sibling, this.props.details.id);
  }

  parentHandleDelete = (id) => {
    let updatedChildDetailsArray = cloneDeep(this.state.childDetailsArray).filter(childDetailObj => childDetailObj.id !== id);
    this.setState({ childDetailsArray: updatedChildDetailsArray })
    this.selectSelf();
    return true;
  }

  attemptDelete = () => {
    if (this.props.details.isBaseBoard) return false;

    this.deselect();
    return this.props.parent.parentHandleDelete(this.props.details.id)
  }

  handleClick = (e) => {
    this.selectSelf();
    e.stopPropagation();
  }

  render() {
    //styling preparation obeying BEM
    let className = 'flexblock';
    const base = className;
    const details = this.props.details.isBaseBoard ? this.state.baseBoardDetails : this.props.details;

    if (details.isBaseBoard) className += ` ${base}--base-board`;
    if (details.flexDirection === "column") className += ` ${base}--dir-column`;
    className += ` ${base}--layer${this.props.layer}`

    //active (selected) styling
    if (this.state.isSelected) className += ` ${base}--selected`;

    //Dynamic inline width/height styling
    const isBaseBoard = details.isBaseBoard;
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