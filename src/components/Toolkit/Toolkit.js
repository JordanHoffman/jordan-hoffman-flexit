import React from "react";  

import './Toolkit.scss'

//Gameplan:
/* 
Instead of the Toolkit having to know about the current flexblock, its parent, and its children (which is a mess of info to know) in order to put constraints on its buttons (like disabling them), it is easier just to allow the user to push the buttons and then send the requests to the flexblocks. If the flexblocks can do it, they will and send back a success message, if not then they won't and send back a failure message, and the toolkit can just display that failure message if it didn't work.
*/

class Toolkit extends React.Component {

  componentDidUpdate(prevProps) {
    //If we receive a new flexblock handler, first pass the flexblock our callback handler in order for it to start a communication with us (complete the handshake). Then get the info on the newly selected flexblock for toolkit to update the parts of its display which represent the flexblock's details (e.g. width and height)
    if (prevProps.selectedFlexBlockHandler !== this.props.selectedFlexBlockHandler) {
      this.props.selectedFlexBlockHandler({'receiveToolkitRequestHandler': this.handleRequest});
      this.props.selectedFlexBlockHandler({'getInfoForToolkit': null});
    }
  }

  handleCreateInside = ()=>{
    this.props.selectedFlexBlockHandler({'createInside': null});
  }

  handleRequest = (req) => {

  }

  render(){
    return(
      <div className="toolkit">
        <button onClick={this.handleCreateInside}>Create</button>
      </div>
    )
  }
}

export default Toolkit;