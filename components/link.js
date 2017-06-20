import React, { Component } from 'react';
import PropTypes from 'prop-types';
import types from '../route-types';
import { getActiveRoute, setActiveRoute } from '../utils';

const { keys } = Object;

export default class Link extends Component {
  render() {
    const { children, to, params, ...rest } = this.props;
    const additionalState = {
      'data-active': this.isActive() || null,
    };

    return (
      <nav onClick={this.navigateTo} {...additionalState} {...rest}>
        {children}
      </nav>
    );
  }

  static propTypes = {
    to: PropTypes.string,
    params: PropTypes.object,
  }

  static contextTypes = {
    store: PropTypes.object,
  }

  static defaultProps = {
    to: null,
    params: {},
  }

  navigateTo = () => {
    const { to, params } = this.props;
    const { store } = this.context;

    store.dispatch({ type: types.PUSH_STATE, routeName: to, params });
  }

  isActive = () => {
    const { to, params } = this.props;
    const { store } = this.context;
    const activeRoute = getActiveRoute();

    if (!to || to === activeRoute.routeName) {
      const activeParamNames = keys(activeRoute.params || {});

      return !activeParamNames.filter(paramName => {
        return activeRoute.params[paramName] !== params[paramName];
      }).length;
    }
  }
}
