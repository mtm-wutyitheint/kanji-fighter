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

  if (loginUser && loginUser.id === 'guest') {
    return true;
  }

  if (isNil(loginUser) || isNil(loginUser.jwt) || isNil(loginUser.user)) {
    return false;
  }
  return true;
}

export default GuardedRoute;