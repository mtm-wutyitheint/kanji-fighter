import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import React from "react";
import GuardedRoute from "./guardedRoute";
import CommingSoon from "./pages/comming-soon";
import Content from './pages/content';
import Learn from "./pages/learn";
import Quiz from "./pages/quiz/quiz";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Profile from "./pages/profile/profile";
import Top from './pages/top/top';
import TopNav from "./components/top-navigation/top-nav";
import ScoreDetail from "./pages/score-detail/score-detail";
import ForgetPassword from "./pages/forget-password/forget-password";
import ResetPassword from "./pages/reset-password/reset-password";

function App() {
  const LoginContainer = () => (
    <div className="container">
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route path="/forget-password" component={ForgetPassword}></Route>
      <Route path="/reset-password" component={ResetPassword}></Route>
      <Route exact path="/" render={() => <Redirect to="/top" />} />
    </div>
  )

  const DefaultContainer = () => (
    <div>
      <div className="container">
        <TopNav />
        <GuardedRoute path="/comming-soon" component={CommingSoon} />
        <GuardedRoute path="/content" component={Content} />
        <GuardedRoute path="/top" component={Top} />
        <GuardedRoute path="/learn" component={Learn} />
        <GuardedRoute path="/quiz" component={Quiz} />
        <GuardedRoute path="/profile" component={Profile} />
        <GuardedRoute path="/score-detail" component={ScoreDetail}></GuardedRoute>
      </div>
    </div>
  )

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
