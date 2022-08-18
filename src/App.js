import PuzzlePlay from './pages/PuzzlePlay';
import StageSelect from './pages/StageSelect';
import { Switch, Route } from "react-router-dom";

function App(props) {

  return (
    <div className="App">
      <Switch>
        <Route path={"/play/:puzzleId"} render={routerProps => <PuzzlePlay {...routerProps} />} />
        <Route path={"/select"} render={routerProps => <StageSelect auth0={props.auth0} {...routerProps} />} />
        <Route path={"/"} render={routerProps => <StageSelect auth0={props.auth0} {...routerProps} />} />
      </Switch>

    </div>
  );
}

export default App;
