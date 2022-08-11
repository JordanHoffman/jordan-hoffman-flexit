import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import './StageSelect.scss'
import { API_URL } from '../../config/index';

class StageSelect extends React.Component {

  state = {
    difficulty: 'easy',
    easyPuzzleData: [],
    mediumPuzzleData: [],
    hardPuzzleData: []
  }

  componentDidMount() {
    //the response is an array of all puzzle data objects of the form [{id: 1234, difficulty:'medium', number: 4}]. Filter into seperate arrays for easy medium and hard, then sort by their "number" property.

    let reqst = API_URL ? API_URL : ('http://' + document.location.hostname + ":8080/");
    axios.get(reqst + 'api/puzzles/all-general')
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

    let loadingPuzzles = []
    if (chosenDifficultyPuzzles.length === 0) {
      for (let i = 0; i < 2; i++) {
        loadingPuzzles.push(
          <button className="puzzle-card puzzle-card--loading" key={'loading' + i}>
            <div className="sk-fading-circle">
              <div className="sk-circle1 sk-circle"></div>
              <div className="sk-circle2 sk-circle"></div>
              <div className="sk-circle3 sk-circle"></div>
              <div className="sk-circle4 sk-circle"></div>
              <div className="sk-circle5 sk-circle"></div>
              <div className="sk-circle6 sk-circle"></div>
              <div className="sk-circle7 sk-circle"></div>
              <div className="sk-circle8 sk-circle"></div>
              <div className="sk-circle9 sk-circle"></div>
              <div className="sk-circle10 sk-circle"></div>
              <div className="sk-circle11 sk-circle"></div>
              <div className="sk-circle12 sk-circle"></div>
            </div>
          </button>
        )
      }
    }

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

        <div className={"puzzle-choices-holder" + ` puzzle-choices-holder--${this.state.difficulty}`}>
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

          {loadingPuzzles}

          {[1, 2, 3, 4, 5, 6, 7, 8].map((number) => {
            return (
              <button className="puzzle-card" key={'unused' + number}>
                coming soon
              </button>
            )
          })}
        </div>


      </div>
    )

  }
}

export default StageSelect;