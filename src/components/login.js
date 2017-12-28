import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';

import * as actions from '../actions/index';
import { loginUser } from '../actions/index';

class Login extends Component {


  renderAlert() {
    if (this.props.errorMessage) {
      return (
        <div className="alert alert-danger">
          <strong>Error: </strong> {this.props.errorMessage}
        </div>
      );
    }
  }

  onSubmit(values) {
    // this.props.searchOrders(values)
    console.log(values);
    this.props.loginUser(values.email, values.password);
  }

  renderField(field) {

    return (
      <div className='form-group'>
        <label >{field.label}</label><br />
        <input className='form-control' type='text' placeholder={field.placeholder} {...field.input} />
        {/*<div className='text-help'>
          {touched ? error : ''}
        </div>*/}
      </div>
    )


  }

  static contextTypes = {
    router: React.PropTypes.object
  }

  componentWillMount() {
    if (this.props.authenticated) {
      this.context.router.history.push('/');
    }
  }

      componentWillUpdate(nextProps) {
      if (nextProps.authenticated) {
        this.context.router.history.push('/');
      }
    }


  render() {
    const { handleSubmit, fields: { email, password } } = this.props;

    // if (this.props.authenticated) {
    //     this.context.router.history.push('/');
    // }

    return (
      <form className='searchForm' onSubmit={handleSubmit(this.onSubmit.bind(this))}>

        <Field
          label='User name'
          name='email'
          component={this.renderField}
          placeholder='Email'
        />
        <Field
          label='Password'
          name='password'
          component={this.renderField}
          placeholder='Password'
        />

        {this.renderAlert()}
        <button action="submit" className="btn btn-primary">Sign in</button>
      </form>
    );
  }
}


const mapDispatchToProps = (dispatch) => {
  return {
    loginUser: (email, password) => dispatch(loginUser(email, password))
  }
}



function mapStateToProps(state) {

  return {
    errorMessage: state.auth.error,
    authenticated: state.auth.authenticated
  };
}

export default reduxForm({
  form: 'signin',
  fields: ['email', 'password']
})(connect(mapStateToProps, mapDispatchToProps)(Login));


