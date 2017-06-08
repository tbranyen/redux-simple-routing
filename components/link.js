import React, { Component } from 'react';
import PropTypes from 'prop-types';
import types from '../route-types';
import { getActiveRoute, setActiveRoute } from '../utils';

export default class Link extends Component {
  render() {
    const { children, to, params, ...rest } = this.props;

    return (
      <nav {...rest} onClick={this.navigateTo}>{this.props.children}</nav>
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
    params: null,
  }

  navigateTo = () => {
    const { to, params } = this.props;
    const { store } = this.context;
    const state = getActiveRoute();

    store.dispatch({ type: types.PUSH_STATE, routeName: to, params });
  }
}
