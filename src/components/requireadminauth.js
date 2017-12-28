import React, { Component } from 'react';
import { connect } from 'react-redux';

export default function(ComposedComponent) {
  class AdminAuthentication extends Component {
    static contextTypes = {
      router: React.PropTypes.object
    }

    componentWillMount() {
      if (this.props.authenticated !== "admin") {
        this.context.router.history.push('/signin');
      }
    }

    componentWillUpdate(nextProps) {
      if (nextProps.authenticated !== "admin") {
        this.context.router.history.push('/signin');
      }
    }

    render() {
      return <ComposedComponent {...this.props} />
    }
  }

  function mapStateToProps(state) {
    return { authenticated: state.auth.authenticated };
  }

  return connect(mapStateToProps)(AdminAuthentication);
}