import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { monitorActiveRoute } from '../utils';

export default routesToPages => class ActivePage extends Component {
  render() {
    const { ActivePage } = this.state;

    return (
      <ActivePage {...this.props} />
    );
  }

  static contextTypes = {
    store: PropTypes.object,
  };

  constructor(props, context) {
    super(props, context);
    this.state = { ActivePage: routesToPages.notFound };
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  componentDidMount() {
    monitorActiveRoute(this.context.store);
    this.unsubscribe = this.context.store.subscribe(this.setActivePage);
  }

  setActivePage = () => {
    const { route } = this.context.store.getState();
    this.setState({ ActivePage: routesToPages[route.routeName] });
  }
};
