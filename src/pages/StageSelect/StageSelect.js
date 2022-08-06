import React from "react";

import './StageSelect.scss'

class StageSelect extends React.Component {
  render(){
    return(
      <div className="stage-select">

      <h1 className="stage-select__title">
        <span className="stage-select__title stage-select__title--special-char">F</span>lex<span className="stage-select__title stage-select__title--special-char">I</span>t
      </h1>

      <h2 className="stage-select__select-message">Choose a Puzzle</h2>

      <div className="difficulty-selector">
        <button className="difficulty-selector__option difficulty-selector__option--left difficulty-selector__option--chosen">Easy</button>
        <button className="difficulty-selector__option">Medium</button>
        <button className="difficulty-selector__option difficulty-selector__option--right">Hard</button>
      </div>

{/* Map and create Link options. Use state to pass data object to new page. Ex <Link
  to={{
    pathname: "/courses",
    state: { fromDashboard: true }
  }}
/> */}
      <div className="puzzle-choices">

      </div>
      
      
      </div>
    )

  }
}

export default StageSelect;