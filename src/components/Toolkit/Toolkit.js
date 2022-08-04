import React from "react";

import './Toolkit.scss'
import SizeTool from "../SizeTool";
import { RadioOff, RadioOn } from "../../Utility/svg-loader"
import DropDownTool from "../DropDownTool";

//Gameplan:
/* 
Instead of the Toolkit having to know about the current flexblock, its parent, and its children (which is a mess of info to know) in order to put constraints on its buttons (like disabling them), it is easier just to allow the user to push the buttons and then send the requests to the flexblocks. If the flexblocks can do it, they will and send back a success message, if not then they won't and send back a failure message, and the toolkit can just display that failure message if it didn't work.
*/

class Toolkit extends React.Component {

  state = {
    selectedFlexBlockDetails: null,
  }

  componentDidUpdate(prevProps) {

    //logic mainly for initial mounting to check if there's a selected flexblock and assign the state once it comes in.
    if (this.props.selectedFlexBlock) {
      if (!this.state.selectedFlexBlockDetails || this.state.selectedFlexBlockDetails.id !== this.props.selectedFlexBlock.props.details.id)
        this.setState({ selectedFlexBlockDetails: this.props.selectedFlexBlock.props.details })
    }

    //logic for deselecting an old flexblock when a new one is selected.
    if (prevProps.selectedFlexBlock) {
      if (this.props.selectedFlexBlock.props.details.id !== prevProps.selectedFlexBlock.props.details.id) {
        prevProps.selectedFlexBlock.deselect()
      }
    }
  }

  handleCreateInside = () => {
    this.props.selectedFlexBlock.createInside();
  }

  handleDelete = () => {
    this.props.selectedFlexBlock.attemptDelete();
  }

  //TODO CONTINUE FROM HERE
  handleSizeAdjust = (e) => {
    //result will either be the new details of the updated flexblock or false if it was unable to update
    const result = this.props.selectedFlexBlock.attemptSizeAdjust(e.target.dataset.dimension, e.target.dataset.adjustment)

    if (result) {
      this.setState({ selectedFlexBlockDetails: result })
    }
    // this.props.selectedFlexBlock.attemptSizeAdjust(e.data)
    // if (dimension === 'width') {

    // }
    // else if (dimension === 'height') {

    // }
    // else {
    //   throw new Error(`invalid dimension of name: ${dimension}`)
    // }
  }

  render() {
    const width = this.state.selectedFlexBlockDetails ? this.state.selectedFlexBlockDetails.size.x : 0;
    const height = this.state.selectedFlexBlockDetails ? this.state.selectedFlexBlockDetails.size.y : 0;

    return (
      <div className="toolkit">
        <h2 className="toolkit__title">Toolkit</h2>

        <section className="toolkit__section">
          <h3 className="toolkit__section-title">FlexBlock Creation</h3>

          <div className="creation-btn-ctr">
            <button className="creation-btn">before</button>
            <button className="creation-btn" onClick={this.handleCreateInside}>inside</button>
            <button className="creation-btn">after</button>
          </div>
          <button className="deletion-btn" onClick={this.handleDelete}>DELETE</button>
        </section>


        <section className="toolkit__section toolkit__section--details">

          <h3 className="toolkit__section-title">FlexBlock Details</h3>

          <div className="detail-ctr">
            <h4 className="detail-ctr__title">Flex Direction:</h4>

            <div className="detail-ctr__controls detail-ctr__controls--flexDirection">
              <div className="radio-ctr">
                <h5 className="detail-ctr__subtitle">row</h5>
                <button className="radio-button">
                  <RadioOff className="radio-button__svg" />
                </button>
              </div>
              <div className="radio-ctr">
                <h5 className="detail-ctr__subtitle">column</h5>
                <button className="radio-button">
                  <RadioOn className="radio-button__svg" />
                </button>
              </div>
            </div>

          </div>

          <div className="detail-ctr">
            <h4 className="detail-ctr__title">Width:</h4>
            <SizeTool ctrClass="detail-ctr__controls detail-ctr__controls--sizetool" value={width} dimension='width' handleSizeAdjust={this.handleSizeAdjust} />
          </div>

          <div className="detail-ctr">
            <h4 className="detail-ctr__title">Height:</h4>
            <SizeTool ctrClass="detail-ctr__controls detail-ctr__controls--sizetool" value={height} dimension='height' handleSizeAdjust={this.handleSizeAdjust} />
          </div>

          <div className="detail-ctr">
            <h4 className="detail-ctr__title">Justify Content:</h4>
            <DropDownTool ctrClass="detail-ctr__controls" options={['start','center','end','between','around','evenly']}/>
          </div>

          <div className="detail-ctr">
            <h4 className="detail-ctr__title">Align Items:</h4>
            <DropDownTool ctrClass="detail-ctr__controls" options={['start','center','end','between','around','evenly']}/>
          </div>

          <div className="detail-ctr">
            <h4 className="detail-ctr__title">Align Self:</h4>
            <DropDownTool ctrClass="detail-ctr__controls" options={['start','center','end','between','around','evenly']}/>
          </div>

        </section>


      </div>
    )
  }
}

export default Toolkit;