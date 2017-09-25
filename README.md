# Redux Simple Routing

*Simple, elegant, and flexible routing for React/Redux applications.*

Stable version: 0.6.0

React Router is an excellent choice for routing a React application. In fact,
many would consider it the de-facto choice, which is why I used it at Netflix
to build applications. While the community is strong, I found the API wasn't
for me. Sure you could compose and describe your routes in JSX, but how do you
change a fragment of the URL dynamically? How do you change state within a
given page? I asked this [very
question](https://gist.github.com/tbranyen/9a0ee01a169f548e79e05a09fa3b3d5a) on
Reddit and Twitter and didn't get any solutions. It seems like developers who
use React Router simply never change the URL dynamically.

Starting on a new app I decided to try my hand at improving the routing to work
the way this app needed to function. This is an experimental API, but seems to
work fine for now, so probably won't change unless something major comes up as
a blocker.

## Features

- Manages which page to display based on the route
- Named pages for easier navigation and structure
- Deeply integrated with Redux and React
- Dynamically change which page (root component) is rendered when navigating
- Super lightweight!

## Install

Ensure you already have: `React`, `Redux`, and `PropTypes` installed in your
application.

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
  'dashboard': new Route('/(dashboard)'),
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
    return (
      <div/>
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
