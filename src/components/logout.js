import React, { Component } from 'react';
import { connect } from 'react-redux';
import { logoutUser } from '../actions//index';

class Logout extends Component {
  componentWillMount() {
    this.props.logoutUser();
  }

  render() {
    return <div></div>;
  }
}

export default connect(null, { logoutUser } )(Logout);