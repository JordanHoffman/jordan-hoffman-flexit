import React from "react";  
import './Toolkit.scss'

//Gameplan:
/* 
Instead of the Toolkit having to know about the current flexblock, its parent, and its children (which is a mess of info to know) in order to put constraints on its buttons (like disabling them), it is easier just to allow the user to push the buttons and then send the requests to the flexblocks. If the flexblocks can do it, they will and send back a success message, if not then they won't and send back a failure message, and the toolkit can just display that failure message if it didn't work.
*/

class Toolkit extends React.Component {

  componentDidUpdate(prevProps) {
    if (prevProps.selectedFlexBlockHandler !== this.props.selectedFlexBlockHandler) {
      this.props.selectedFlexBlockHandler({'getInfoForToolkit': null});
    }
  }

  handleCreateInside = ()=>{
    this.props.selectedFlexBlockHandler({'createInside': null});
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