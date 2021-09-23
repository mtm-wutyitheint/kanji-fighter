import React from 'react';
import { Route, Redirect } from "react-router-dom";
import { isNil } from 'lodash';

const GuardedRoute = ({ component: Component, auth, ...rest }) => (
  <Route {...rest} render={(props) => (
    isAuth() === true
      ? <Component {...props} />
      : <Redirect to='/login' />
  )} />
)

const isAuth = () => {
  let loginUser = JSON.parse(localStorage.getItem('loginUser'));
  let guestUser = JSON.parse(sessionStorage.getItem('loginUser'));

  if (guestUser) {
    return true;
  }
  if (isNil(loginUser) || isNil(loginUser.jwt) || isNil(loginUser.user)) {
    return false;
  }
  return true;
}

const isLocalUser = () => {
  let loginUser = JSON.parse(localStorage.getItem('loginUser'));
  if (isNil(loginUser) || isNil(loginUser.jwt) || isNil(loginUser.user)) {
    return false;
  }
  return true;
}

export default GuardedRoute;