import React from "react";  
import './Toolkit.scss'

class Toolkit extends React.Component {

  handleCreateInside = ()=>{
    
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