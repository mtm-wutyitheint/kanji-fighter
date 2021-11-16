import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import React, { useEffect, useState } from "react";
import GuardedRoute from "./guardedRoute";
import Content from "./pages/content";
import Learn from "./pages/learn";
import Quiz from "./pages/quiz/quiz";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Profile from "./pages/profile/profile";
import Top from "./pages/top/top";
import TopNav from "./components/top-navigation/top-nav";
import ScoreDetail from "./pages/score-detail/score-detail";
import ForgetPassword from "./pages/forget-password/forget-password";
import ResetPassword from "./pages/reset-password/reset-password";
import Home from "./pages/game/game";
import ChatPlay from "./pages/chat-play/chat-play";
import CardPlay from "./pages/card-play/card-play";

function App() {
  
  const LoginContainer = () => (
    <div className="container">
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route path="/forget-password" component={ForgetPassword}></Route>
      <Route path="/reset-password" component={ResetPassword}></Route>
      <Route exact path="/" render={() => <Redirect to="/top" />} />
    </div>
  );

  const [isshow, showNavbar] = useState(false);
  useEffect(() => {
    showNavbar(sessionStorage.getItem('game'));
  }, [isshow]);

  const DefaultContainer = () => (
    <div>
      <div className="container">
        {sessionStorage.getItem('game') === 'false' && <TopNav />}
        <GuardedRoute path="/game" component={Home} />
        <GuardedRoute path="/content" component={Content} />
        <GuardedRoute path="/top" component={Top} />
        <GuardedRoute path="/learn" component={Learn} />
        <GuardedRoute path="/quiz" component={Quiz} />
        <GuardedRoute path="/profile" component={Profile} />
        <GuardedRoute
          path="/score-detail"
          component={ScoreDetail}
        ></GuardedRoute>
        <GuardedRoute path="/chat-play" component={ChatPlay} />
        <GuardedRoute path="/card-play" component={CardPlay} />
      </div>
    </div>
  );

  return (
    <Router>
      <Switch>
        <div className="App">
          <Route component={DefaultContainer} />
          <Route component={LoginContainer} />
        </div>
      </Switch>
    </Router>
  );
}

export default App;
