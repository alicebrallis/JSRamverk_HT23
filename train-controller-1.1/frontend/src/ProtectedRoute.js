// ProtectedRoute.js
import React from 'react';
import { Redirect, Route } from 'react-router-dom';

const ProtectedRoute = ({ component: Component, authenticated, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) => 
        authenticated ? (
          <Component {...props} />
        ) : (
          <Redirect to="login" />
        )
      }
    />
  );
};

export default ProtectedRoute;