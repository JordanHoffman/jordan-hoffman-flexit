import './App.css';
import PuzzlePlay from './pages/PuzzlePlay';
import { BrowserRouter, Switch, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter >
    <div className="App">
      <Switch>
        <Route 
          path={"/"}
          render={routerProps => <PuzzlePlay {...routerProps} />}
        />
      </Switch>

    </div>
    </BrowserRouter>
  );
}

export default App;
