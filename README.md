# Redux Simple Routing

*Simple, elegant, and flexible routing for React/Redux applications.*

Stable version: 0.7.0

Designed for browser-based Redux applications, this tool allows declarative
mapping of URL to components. This library of functions and components is
written around the route-parser library and exposes an elegant interface for
params, splats, optional params/splats, query parameters, and more.

## Features

- Manages which component to render based on the route
- Named pages for easier navigation and structure
- Deeply integrated with Redux, with optional React components
- Super lightweight!

## Install

Ensure you have: `Redux` installed in your application. You may want `React`
and `PropTypes` installed as well if you want to use convenience wrappers.

``` sh
npm install redux-simple-routing --save
```

## Defining your routes and adding the reducer

Your first step is to define the mapping of routes to names. This allows you to
refer to your pages easier when transitioning. This is inspired by
`Backbone.Router`. The format for routes can be found in the **route-parser**
documentation: 

Create a reducer file named something like `route.js` and fill in with the
following logic:

``` js
import { Route, routeReducer } from 'redux-simple-routing';

export const route = routeReducer({
  'dashboard': new Route('/(?query=:query)'),
  'editor': new Route('/editor/:movieId(/:packageId)'),
  'notFound': new Route('/*'),
});

```

This is then registered with all your other reducers:

``` js
import { combineReducers } from 'redux';
import { ui } from './ui';
import { alerts } from './alerts';

// Import your new reducer and attach in the `combineReducers` below.
import { route } from './route';

export default combineReducers({
  ui,
  alerts,
  route,
});
```

Note: The name of your reducer must be `route` for now, may be customizable
in the future.

## Rendering the correct page

Now that you have routes defined into `redux-simple-routing` you'll naturally
want the application to reflect the state of the URL to a given component. This
library gives you access to a Higher-Order-Component to set the mapping of 
route names to components and will automatically monitor the URL and re-render
whenever a route is changed.

Note: This library uses `context` and therefore will need the `store` provided.
This is generally accomplished using a react-redux `Provider`.

``` js
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { maintainActivePage } from 'redux-simple-routing';
import { DashboardPage } from '../components/pages/dashboard';
import { EditorPage } from '../components/pages/editor';
import { NotFoundPage } from '../components/pages/not-found';

// This HoC will take in a mapping of route names to React.Component classes.
const ActivePage = maintainActivePage({
  dashboard: DashboardPage,
  notFound: NotFoundPage,
});

export class App extends Component {
  render() {
    const { store } = this.props;

    return (
      <Provider store={store} key="provider">
        {/* Whenever the page changes this component will re-render itself with
        the proper component */}
        <ActivePage />
      </Provider>
    );
  }

  static propTypes = {
    store: PropTypes.object.isRequired,
  }
}
```

## Change the URL using JSX

A very common way to change the URL will be to use the included `Link`
component.

It works very simply by wrapping the nested element in a `<nav/>` element that
has a click handler that will dispatch a `PUSH` action to the store whenever
clicked.

### Available props

- `to` - Used to set the route name to transition to, omit if you want the current
- `params` - An object used to supply data to format the URL

Example:

``` js
import { Link } from 'redux-simple-routing';

class Header extends Component {
  render() {
    return (
      <div className="tool-bar">
        <Link to="dashboard"><button>Dashboard</button></Link>
        <Link to="editor" params={{ movieId: '60020435' }}><button>Random Movie ID</button></Link>
      </div>
    );
  }
}
```

## Changing the URL programmatically

You can also change the URL very easily using the same API as `Link` via
dispatching an action to your store. An action is provided out-of-the-box which
you can use in your `mapDispatchToProps` function.

``` js
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { routeActions } from 'redux-simple-routing';

export class MyComponent extends Component {
  render() {
    const { push, replace, route } = this.props;

    return (
      <div onClick={() => push('someRoute', { id: 0 })}>Push a new routeName with no params</div>

      {route.routeName === 'someRoute' && (
        <div onClick={() => replace({ id: 5 })}>Replace the current URL id param</div> 
      )}
    );
  }

  static mapStateToProps = state => ({
    route: state.route,
  })

  static mapDispatchToProps = dispatch => bindActionCreators({
    ...routeActions,
  }, dispatch)
}

export const ConnectedMyComponent = connect(
  MyComponent.mapStateToProps,
  MyComponent.mapDispatchToProps
)(Header);
```
