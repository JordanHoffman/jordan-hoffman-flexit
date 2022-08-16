import React from "react";

import './Toolkit.scss'
import SizeTool from "../SizeTool";
import { RadioOff, RadioOn } from "../../Utility/svg-loader"
import DropDownTool from "../DropDownTool";
import Toast from "../Toast";
import C from "../../Utility/Constants";

class Toolkit extends React.Component {

  state = {
    selectedFlexBlockDetails: null,
    toastInfo: null
  }

  toastTimeoutId = null;

  toastLocations = Object.freeze({
    creation: 'creation',
    adjustWidth: 'adjustWidth',
    adjustHeight: 'adjustHeight'
  })

  componentDidUpdate(prevProps) {

    //logic mainly for initial mounting to check if there's a selected flexblock and assign the state once it comes in.
    if (this.props.selectedFlexBlock) {
      if (!this.state.selectedFlexBlockDetails || this.state.selectedFlexBlockDetails.id !== this.props.selectedFlexBlock.props.details.id) {
        let currentDetails = this.props.selectedFlexBlock.props.details;
        if (currentDetails.isBaseBoard) currentDetails = this.props.selectedFlexBlock.getBaseBoardDetails();

        this.setState({ selectedFlexBlockDetails: currentDetails });
      }
    }

    //logic for deselecting an old flexblock when a new one is selected.
    if (prevProps.selectedFlexBlock) {
      if (this.props.selectedFlexBlock.props.details.id !== prevProps.selectedFlexBlock.props.details.id) {
        prevProps.selectedFlexBlock.deselect()
      }
    }

    // logic for displaying toast messages
    if (this.state.toastInfo && !this.toastTimeoutId) {
      this.toastTimeoutId = setTimeout(() => {
        this.setState({ toastInfo: null })
        this.toastTimeoutId = null;
      }, 2000);
    }
  }

  componentWillUnmount() {
    if (this.toastTimeoutId) clearTimeout(this.toastTimeoutId);
  }

  handleCreate = (e) => {
    let hasRoom;
    const sibling = e.target.dataset.sibling;
    if (!sibling) {
      hasRoom = this.props.selectedFlexBlock.attemptCreateInside();
    }
    else {
      hasRoom = this.props.selectedFlexBlock.attemptCreateSibling(sibling);
    }

    if (!hasRoom) {
      if (this.toastTimeoutId) {
        clearTimeout(this.toastTimeoutId);
        this.toastTimeoutId = null;
      }
      this.setState({
        toastInfo: {
          location: this.toastLocations.creation,
          message: "not enough room",
        }
      })
    }
  }

  handleDelete = () => {
    this.props.selectedFlexBlock.attemptDelete();
  }

  handleChangeDirection = (e) => {
    const desiredDirection = e.target.dataset.direction;
    if (this.state.selectedFlexBlockDetails.flexDirection !== desiredDirection) {
      const updatedDetails = this.props.selectedFlexBlock.attemptChangeFlexDirection(desiredDirection);
      this.setState({ selectedFlexBlockDetails: updatedDetails });
    }
  }

  handleSizeAdjust = (e) => {
    const result = this.props.selectedFlexBlock.attemptSizeAdjust(e.target.dataset.dimension, e.target.dataset.adjustment)

    if (result.fail) {
      const location = e.target.dataset.dimension === 'width' ? this.toastLocations.adjustWidth : this.toastLocations.adjustHeight;

      let message = ''
      switch (result.reason){
        case C.flexFail.Room:
          message = 'not enough room'
          break;
        case C.flexFail.Overlap:
          message = `a single child cannot entirely overlap its parent`
          break;
        default:
          console.warn('unidentified flex fail message: ' + result.reason);
          break;
      }
      if (this.toastTimeoutId) {
        clearTimeout(this.toastTimeoutId);
        this.toastTimeoutId = null;
      }
      this.setState({
        toastInfo: {
          location: location,
          message: message,
        }
      })
    }
    else {
      this.setState({ selectedFlexBlockDetails: result })
    }
  }

  handleDistribution = (e) => {
    const updatedDetails = this.props.selectedFlexBlock.attemptDistribution(e.target.name, e.target.value);
    this.setState({ selectedFlexBlockDetails: updatedDetails })
  }

  render() {
    const width = this.state.selectedFlexBlockDetails ? this.state.selectedFlexBlockDetails.size.x : 0;
    const height = this.state.selectedFlexBlockDetails ? this.state.selectedFlexBlockDetails.size.y : 0;
    const directionRow = this.state.selectedFlexBlockDetails ? this.state.selectedFlexBlockDetails.flexDirection === 'row' : false;
    const justifyContent = this.state.selectedFlexBlockDetails ? this.state.selectedFlexBlockDetails.justifyContent : '';
    const alignItems = this.state.selectedFlexBlockDetails ? this.state.selectedFlexBlockDetails.alignItems : '';
    const alignSelf = this.state.selectedFlexBlockDetails ? this.state.selectedFlexBlockDetails.alignSelf : '';
    const isBaseBoard = this.state.selectedFlexBlockDetails ? this.state.selectedFlexBlockDetails.isBaseBoard : true;

    const toastLoc = this.state.toastInfo ? this.state.toastInfo.location : null;
    const toastMessage = this.state.toastInfo ? this.state.toastInfo.message : null;

    return (
      <div className="toolkit">
        <h2 className="toolkit__title">Toolkit</h2>

        <div className="toolkit__contents">

          <section className="toolkit__section">
            <h3 className="toolkit__section-title">
              {(toastLoc === this.toastLocations.creation) && <Toast ctrClass='toolkit__toast' message={toastMessage} />}
              FlexBlock Creation
            </h3>

            <div className="creation-btn-ctr">
              {!isBaseBoard && <button className="creation-btn" data-sibling="before" onClick={this.handleCreate}>before</button>}

              <button className="creation-btn" onClick={this.handleCreate}>inside</button>

              {!isBaseBoard && <button className="creation-btn" data-sibling="after" onClick={this.handleCreate}>after</button>}
            </div>

            {!isBaseBoard && <button className="deletion-btn" onClick={this.handleDelete}>DELETE</button>}

          </section>


          <section className="toolkit__section toolkit__section--details">

            <h3 className="toolkit__section-title">FlexBlock Details</h3>

            <div className="detail-ctr">
              <h4 className="detail-ctr__title">Flex Direction:</h4>

              <div className="detail-ctr__controls detail-ctr__controls--flexDirection">
                <div className="radio-ctr">
                  <h5 className="detail-ctr__subtitle">row</h5>
                  <button className="radio-button" data-direction="row" onClick={this.handleChangeDirection}>
                    {directionRow ? <RadioOn className="radio-button__svg" /> : <RadioOff className="radio-button__svg" />}
                  </button>
                </div>

                <div className="radio-ctr">
                  <h5 className="detail-ctr__subtitle">column</h5>
                  <button className="radio-button" data-direction="column" onClick={this.handleChangeDirection}>
                    {directionRow ? <RadioOff className="radio-button__svg" /> : <RadioOn className="radio-button__svg" />}
                  </button>
                </div>
              </div>

            </div>

            <div className="detail-ctr">
              <h4 className="detail-ctr__title">
                {(toastLoc === this.toastLocations.adjustWidth) && <Toast ctrClass='toolkit__toast' message={toastMessage} />}
                Width:
              </h4>
              <SizeTool ctrClass="detail-ctr__controls detail-ctr__controls--sizetool"
                value={width}
                dimension='width'
                isBaseBoard={isBaseBoard}
                handleSizeAdjust={this.handleSizeAdjust} />
            </div>

            <div className="detail-ctr">
              <h4 className="detail-ctr__title">
                {(toastLoc === this.toastLocations.adjustHeight) && <Toast ctrClass='toolkit__toast' message={toastMessage} />}
                Height:
              </h4>
              <SizeTool ctrClass="detail-ctr__controls detail-ctr__controls--sizetool"
                value={height}
                dimension='height'
                isBaseBoard={isBaseBoard}
                handleSizeAdjust={this.handleSizeAdjust} />
            </div>

            <div className="detail-ctr">
              <h4 className="detail-ctr__title">Justify Content:</h4>
              <DropDownTool ctrClass="detail-ctr__controls detail-ctr__controls--dropdown"
                name="justifyContent"
                value={justifyContent}
                options={C.justifyContent}
                handleDistribution={this.handleDistribution} />
            </div>

            <div className="detail-ctr">
              <h4 className="detail-ctr__title">Align Items:</h4>
              <DropDownTool ctrClass="detail-ctr__controls detail-ctr__controls--dropdown"
                name="alignItems"
                value={alignItems}
                options={C.alignContent}
                handleDistribution={this.handleDistribution} />
            </div>

            {!isBaseBoard && <div className="detail-ctr">
              <h4 className="detail-ctr__title">Align Self:</h4>
              <DropDownTool ctrClass="detail-ctr__controls detail-ctr__controls--dropdown"
                name="alignSelf"
                value={alignSelf}
                options={C.alignSelf}
                handleDistribution={this.handleDistribution} />
            </div>
            }

          </section>

        </div>

      </div>
    )
  }
}

export default Toolkit;