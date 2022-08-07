import PuzzlePlay from './pages/PuzzlePlay';
import StageSelect from './pages/StageSelect';
import { BrowserRouter, Switch, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter >
      <div className="App">
        <Switch>
          <Route path={"/play"} render={routerProps => <PuzzlePlay {...routerProps} />} />
          <Route path={"/select"} render={routerProps => <StageSelect {...routerProps} />} />
          <Route path={"/"} render={routerProps => <StageSelect {...routerProps} />} />
        </Switch>

      </div>
    </BrowserRouter>
  );
}

export default App;
