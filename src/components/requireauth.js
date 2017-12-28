import React, { Component } from 'react';
import { connect } from 'react-redux';

export default function(ComposedComponent) {
  class Authentication extends Component {
    static contextTypes = {
      router: React.PropTypes.object
    }

    componentWillMount() {
      if (this.props.authenticated !== "user" && this.props.authenticated !== "admin") {
        this.context.router.history.push('/signin');
      }
    }

    componentWillUpdate(nextProps) {
      if (nextProps.authenticated !== "user" && nextProps.authenticated == "admin") {
        this.context.router.history.push('/signin');
      }
    }

    render() {
      return <ComposedComponent {...this.props} />
    }
  }

  function mapStateToProps(state) {

    console.log("RequireAuth")
    console.log(state.auth)
    
    return { authenticated: state.auth.authenticated };
  }

  return connect(mapStateToProps)(Authentication);
}