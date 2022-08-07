import React from "react";
import { Link } from "react-router-dom";

import './StageSelect.scss'

class StageSelect extends React.Component {

  state = {
    difficulty: 'easy',
  }

  chooseDifficulty = (e) => {
    this.setState({ difficulty: e.target.dataset.difficulty });
  }

  render() {
    const emptyPuzzleData = [{}, {}, {}]
    return (
      <div className="stage-select">

        <h1 className="stage-select__title">
          <span className="stage-select__title stage-select__title--special-char">F</span>lex<span className="stage-select__title stage-select__title--special-char">I</span>t
        </h1>

        <h2 className="stage-select__select-message">Choose a Puzzle</h2>

        <div className="difficulty-selector">
          <button
            className={"difficulty-selector__option difficulty-selector__option--left" + (this.state.difficulty === 'easy' ? " difficulty-selector__option--chosen" : "")}
            data-difficulty='easy'
            onClick={this.chooseDifficulty}>easy</button>
          <button
            className={"difficulty-selector__option" + (this.state.difficulty === 'medium' ? " difficulty-selector__option--chosen" : "")}
            data-difficulty='medium'
            onClick={this.chooseDifficulty}>medium</button>
          <button className={"difficulty-selector__option difficulty-selector__option--right" + (this.state.difficulty === 'hard' ? " difficulty-selector__option--chosen" : "")}
            data-difficulty='hard'
            onClick={this.chooseDifficulty}>hard</button>
        </div>

        {/* Map and create Link options. Use state to pass data object to new page. Ex <Link
  to={{
    pathname: "/courses",
    state: { fromDashboard: true }
  }}
/> */}
        <div className="puzzle-choices-holder">
          {emptyPuzzleData.map((puzzleLevel, i) => {
            return (
              <Link className="puzzle-card"
              key={i+this.state.difficulty}
              to={{
                pathname: "/play",
                state: {id:"1234"},
                prevPg: 'stage-select'
              }}>
                <span className="puzzle-card__number">{i+1}</span>
              </Link>
            )
          })}
        </div>


      </div>
    )

  }
}

export default StageSelect;