import React from "react";

import './Toolkit.scss'
import SizeTool from "../SizeTool/SizeTool";

//Gameplan:
/* 
Instead of the Toolkit having to know about the current flexblock, its parent, and its children (which is a mess of info to know) in order to put constraints on its buttons (like disabling them), it is easier just to allow the user to push the buttons and then send the requests to the flexblocks. If the flexblocks can do it, they will and send back a success message, if not then they won't and send back a failure message, and the toolkit can just display that failure message if it didn't work.
*/

class Toolkit extends React.Component {

  state = {
    selectedFlexBlockDetails: null,
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.selectedFlexBlock || prevProps.selectedFlexBlock.props.details.id !== this.props.selectedFlexBlock.props.details.id) {
      this.setState({selectedFlexBlockDetails: this.props.selectedFlexBlock.details})
    }
  }

  handleCreateInside = () => {
    this.props.selectedFlexBlock.createInside();
  }

  handleSizeAdjust = (dimension, increase) => {
    if (dimension === 'width') {

    }
    else if (dimension === 'height') {

    }
    else {
      throw new Error(`invalid dimension of name: ${dimension}`)
    }
  }

  render() {
    return (
      <div className="toolkit">
        <h2 className="toolkit__title">Toolkit</h2>

        <section className="toolkit__section">
          <h3 className="toolkit__section-title">Create</h3>
          <div className="creation-btn-ctr">
            <button >before</button>
            <button onClick={this.handleCreateInside}>inside</button>
            <button>after</button>
          </div>
        </section>

        <section className="toolkit__section">
          <h3 className="toolkit__section-title">Selected FlexBlock Editor</h3>

          <div className="size-ctr">
            <h4 className="size-ctr__title">Width:</h4>
            <SizeTool size={0} />
          </div>
          <div className="size-ctr">
            <h4 className="size-ctr__title">Height:</h4>
            <SizeTool size={0} />
          </div>


        </section>
      </div>
    )
  }
}

export default Toolkit;