import React from "react";  
import './Toolkit.scss'

class Toolkit extends React.Component {


  componentDidUpdate(prevProps) {
    if (prevProps.selectedFlexBlockHandler !== this.props.selectedFlexBlockHandler) {
      this.props.selectedFlexBlockHandler();
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