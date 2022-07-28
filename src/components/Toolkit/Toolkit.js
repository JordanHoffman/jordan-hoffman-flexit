import React from "react";  
import './Toolkit.scss'

class Toolkit extends React.Component {
//The toolkit will need the info for the current flexblock and its parent.

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