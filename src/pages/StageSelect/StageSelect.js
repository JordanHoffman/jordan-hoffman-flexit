import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import './StageSelect.scss'

class StageSelect extends React.Component {

  state = {
    difficulty: 'easy',
    easyPuzzleData: [],
    mediumPuzzleData: [],
    hardPuzzleData: []
  }

  componentDidMount() {
    //the response is an array of all puzzle data objects of the form [{id: 1234, difficulty:'medium', number: 4}]. Filter into seperate arrays for easy medium and hard, then sort by their "number" property.
    axios.get('http://localhost:8080/api/puzzles/all-general')
      .then((resp) => {
        const easyPuzzleData = resp.data.filter(puzzleDataObject => puzzleDataObject.difficulty === 'easy').sort((a, b) => a.number - b.number);
        const mediumPuzzleData = resp.data.filter(puzzleDataObject => puzzleDataObject.difficulty === 'medium').sort((a, b) => a.number - b.number);
        const hardPuzzleData = resp.data.filter(puzzleDataObject => puzzleDataObject.difficulty === 'hard').sort((a, b) => a.number - b.number);

        this.setState({
          easyPuzzleData: easyPuzzleData,
          mediumPuzzleData: mediumPuzzleData,
          hardPuzzleData: hardPuzzleData
        })
      })
      .catch((error) => {
        console.error(error)
      })
  }

  chooseDifficulty = (e) => {
    this.setState({ difficulty: e.target.dataset.difficulty });
  }

  render() {
    let chosenDifficultyPuzzles = this.state.easyPuzzleData;
    if (this.state.difficulty === 'medium') chosenDifficultyPuzzles = this.state.mediumPuzzleData;
    else if (this.state.difficulty === 'hard') chosenDifficultyPuzzles = this.state.hardPuzzleData;

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

        <div className="puzzle-choices-holder">
          {chosenDifficultyPuzzles.map((puzzleObject, i) => {
            return (
              <Link className="puzzle-card"
                key={puzzleObject.id}
                to={{
                  pathname: ("/play/" + puzzleObject.id),
                  prevPg: 'stage-select'
                }}>
                <span className="puzzle-card__number">{i + 1}</span>
              </Link>
            )
          })}
        </div>


      </div>
    )

  }
}

export default StageSelect;