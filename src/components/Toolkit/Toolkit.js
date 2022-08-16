import React from "react";

import './Toolkit.scss'
import SizeTool from "../SizeTool";
import { RadioOff, RadioOn } from "../../Utility/svg-loader"
import DropDownTool from "../DropDownTool";
import Toast from "../Toast";
import Confirmer from "../Confirmer";
import C from "../../Utility/Constants";

class Toolkit extends React.Component {

  state = {
    selectedFlexBlockDetails: null,
    toastInfo: null,
    displayDeleteConfirm: false,
    displayFlexDirectionConfirm: false,
  }

  toastTimeoutId = null;

  toastLocations = Object.freeze({
    creation: 'creation',
    adjustWidth: 'adjustWidth',
    adjustHeight: 'adjustHeight'
  })

  //Logic to close confirmers if you click outside of them (like how a modal would work). There was a bug where you would click on something that would bring up a confirmer, but this would immediately hide that confirmer since it counts as clicking outside of them. So I needed to allow for clicks on elements which bring up the confirmer (which is fine because the confirmer overlaps them when it's active).
  handleConfirmHiding = ({ target }) => {
    if (!target.closest('.toolkit-confirmer--delete, .deletion-btn-ctr') && this.state.displayDeleteConfirm) {
      this.setState({displayDeleteConfirm: false});
    }
    if (!target.closest('.toolkit-confirmer--flexDirection, .detail-ctr--flexDirection') && this.state.displayFlexDirectionConfirm) {
      this.setState({displayFlexDirectionConfirm: false});
    }
  }

  componentDidMount() {
    //For listening for clicks outside of confirmers when they're active
    document.addEventListener('click', this.handleConfirmHiding)
  }

  componentDidUpdate(prevProps) {

    //logic mainly for initial mounting to check if there's a selected flexblock and assign the state once it comes in.
    if (this.props.selectedFlexBlock) {
      if (!this.state.selectedFlexBlockDetails || this.state.selectedFlexBlockDetails.id !== this.props.selectedFlexBlock.props.details.id) {
        let currentDetails = this.props.selectedFlexBlock.props.details;
        if (currentDetails.isBaseBoard) currentDetails = this.props.selectedFlexBlock.getBaseBoardDetails();

        this.setState({ selectedFlexBlockDetails: currentDetails });
      }
    }

    //logic for deselecting an old flexblock when a new one is selected, and resetting the confirmers if they're out.
    if (prevProps.selectedFlexBlock) {
      if (this.props.selectedFlexBlock.props.details.id !== prevProps.selectedFlexBlock.props.details.id) {
        prevProps.selectedFlexBlock.deselect()
        this.setState({displayDeleteConfirm: false, displayFlexDirectionConfirm: false});
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
    document.removeEventListener('click', this.handleConfirmHiding);
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
    const result = this.props.selectedFlexBlock.attemptDelete(false);
    if (result.fail) {
      this.setState({ displayDeleteConfirm: true })
    }
  }

  onDeleteConfirm = (e) => {
    let confirm = e.target.dataset.confirm;
    if (confirm === 'confirm') {
      this.props.selectedFlexBlock.attemptDelete(true);
    }
    this.setState({ displayDeleteConfirm: false })
  }

  handleChangeDirection = (e) => {
    const desiredDirection = e.target.dataset.direction;
    if (this.state.selectedFlexBlockDetails.flexDirection !== desiredDirection) {
      const result = this.props.selectedFlexBlock.attemptChangeFlexDirection(desiredDirection, false);
      if (result.fail) {
        this.setState({ displayFlexDirectionConfirm: true })
      }
      else {
        this.setState({ selectedFlexBlockDetails: result.details });
      }
    }
  }

  onChangeDirectionConfirm = (e) => {
    let confirm = e.target.dataset.confirm;
    if (confirm === 'confirm') {
      const desiredDirection = this.state.selectedFlexBlockDetails.flexDirection === 'row' ? 'column' : 'row';
      const result = this.props.selectedFlexBlock.attemptChangeFlexDirection(desiredDirection, true);
      this.setState({ selectedFlexBlockDetails: result.details });
    }
    this.setState({ displayFlexDirectionConfirm: false })
  }

  handleSizeAdjust = (e) => {
    const result = this.props.selectedFlexBlock.attemptSizeAdjust(e.target.dataset.dimension, e.target.dataset.adjustment)

    if (result.fail) {
      const location = e.target.dataset.dimension === 'width' ? this.toastLocations.adjustWidth : this.toastLocations.adjustHeight;

      let message = ''
      switch (result.reason) {
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

    const confirmMessage = "this will delete all children"

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

            {!isBaseBoard &&
              <div className="deletion-btn-ctr">
                <button className="deletion-btn" onClick={this.handleDelete}>DELETE</button>
                <Confirmer
                  ctrClass="toolkit__confirmer toolkit__confirmer--delete"
                  visible={this.state.displayDeleteConfirm}
                  message={confirmMessage}
                  handleConfirm={this.onDeleteConfirm}>
                </Confirmer>
              </div>
            }

          </section>


          <section className="toolkit__section toolkit__section--details">

            <h3 className="toolkit__section-title">FlexBlock Details</h3>

            <div className="detail-ctr detail-ctr--flexDirection">
              <h4 className="detail-ctr__title">Flex Direction:</h4>
              <Confirmer
                ctrClass="toolkit__confirmer toolkit__confirmer--flexDirection"
                visible={this.state.displayFlexDirectionConfirm}
                message={confirmMessage}
                handleConfirm={this.onChangeDirectionConfirm}>
              </Confirmer>

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