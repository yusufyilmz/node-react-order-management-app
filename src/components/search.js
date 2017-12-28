import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Loading from './loading';

class Search extends Component {
  renderField (field) {
    const { meta: { touched, error } } = field
    const className = `form-group ${touched && error ? 'has-danger' : ''}`

    const aaa = field.label + '_'
    if (field.label) {
      return (

        <div className={className}>

          <label >{field.label}</label><br/>
          <input id={aaa} className='form-control' type='text' placeholder={field.placeholder} {...field.input} />
          <div className='text-help'>
            {touched ? error : ''}
          </div>
        </div>
      )
    } else {
      return (

        <div className={className}>
          <input className='form-control' type='text' placeholder={field.placeholder} {...field.input} />
          <div className='text-help'>
            {touched ? error : ''}
          </div>
        </div>
      )
    }
  }

  onSubmit (values) {
    this.props.searchOrders(values)
  }

  render () {

    if (this.props.hasErrored) {
      return <p>Sorry! There was an error loading the items</p>
    }
    if (this.props.isLoading) {
      return <Loading/>
    }

    const { handleSubmit } = this.props

    return (
      <form className='searchForm' onSubmit={handleSubmit(this.onSubmit.bind(this))}>
        <Field
          label='Customer'
          name='customer_name'
          component={this.renderField}
          placeholder='Name'
        />
        <Field
          name='customer_surname'
          component={this.renderField}
          placeholder='SurName'
        />
        <Field
          name='customer_email'
          component={this.renderField}
          placeholder='Email'
        />
        <Field
          label='Invoice'
          name='invoice_name'
          component={this.renderField}
          placeholder='Name'
        />
        <Field
          name='invoice_surName'
          component={this.renderField}
          placeholder='SurName'
        />
        <Field
          name='invoice_gsm'
          component={this.renderField}
          placeholder='Gsm'
        />

        <Field
          label='Delivery'
          name='delivery_name'
          component={this.renderField}
          placeholder='Name'
        />
        <Field
          name='delivery_surName'
          component={this.renderField}
          placeholder='SurName'
        />
        <Field
          name='delivery_gsm'
          component={this.renderField}
          placeholder='Gsm'
        />

        <Field
          label='Reference'
          name='order_code'
          component={this.renderField}
          placeholder='No'
        />

        <button type='submit' className='btn btn-primary'>Submit</button>
        <Link style ={{width: '100%'}} to='/' className='btn btn-danger'>Cancel</Link>
      </form>
    )
  }
}

function validate (values) {
  // console.log(values) -> { title: 'asdf', categories: 'asdf', content: 'asdf' }
  const errors = {}

  // Validate the inputs from 'values'
//   if (!values.title) {
//     errors.title = "Enter a title";
//   }
//   if (!values.categories) {
//     errors.categories = "Enter some categories";
//   }
//   if (!values.content) {
//     errors.content = "Enter some content please";
//   }

  // If errors is empty, the form is fine to submit
  // If errors has *any* properties, redux form assumes form is invalid
  return errors
}

export default reduxForm({
  validate,
  form: 'OrderSearchForm'
})(connect(null)(Search))
