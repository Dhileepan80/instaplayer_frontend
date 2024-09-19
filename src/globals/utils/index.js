import React, { useLayoutEffect, useRef } from 'react';
import { Redirect, Route, useLocation } from 'react-router-dom/cjs/react-router-dom.min';

export function setRequestToken(token) {
  window.localStorage.setItem('request_token', token);
}

export function PrivateRoute({ path, component, ...cprops }) {
  const Component = component;

  return (
    <>
      {!window.localStorage.getItem('request_token')
        ? (
          <Redirect to="/login" />
        ) : (
          <Route path={path} component={Component} {...cprops} />
        )}
    </>
  );
}

export function AfterLogin() {
  console.log('after login called')
  return (
    <>
      {window.localStorage.getItem('request_token') ? (
        <Redirect to="/home" />
      ) : (
        <Redirect to="/login" />
      )}
    </>
  );
}

export function logout() {
  window.localStorage.removeItem('request_token');
  window.localStorage.removeItem('activePage');
  window.localStorage.removeItem('searchQuery');

  document.location.href = '/';
}

const apiCancelTokens = [];

export function setApiCancelTokens(cFn) {
  apiCancelTokens.push(cFn);
}

function clearPrevPageApiRequests() {
  apiCancelTokens.forEach((cFn) => cFn());
}

export function useCancelPrePageApi() {
  const location = useLocation();

  const previousPath = useRef('');
  const currentPath = useRef('');

  useLayoutEffect(() => {
    if (!previousPath.current && !currentPath.current) {
      previousPath.current = location.pathname;
      currentPath.current = location.pathname;
    } else {
      previousPath.current = currentPath.current;
      currentPath.current = location.pathname;
    }

    if (previousPath.current !== currentPath.current) {
      clearPrevPageApiRequests();
    }
  }, [location.pathname]);

}
