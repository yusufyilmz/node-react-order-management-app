import { GET_PARAMETERS_SUCCESS, PARAMETER_DATA_IS_LOADING, SET_PARAMETERS_SUCCESS, PARAMETERS_ERROR } from './types'


export function parametersHasErrored(bool) {
  return {
    type: PARAMETERS_ERROR,
    hasErrored: bool
  }
}

export function parametersFetchDataSuccess(values) {

  console.log(values);
  return {
    type: GET_PARAMETERS_SUCCESS,
    payload: values
  }
}

export function parametersSetDataSuccess(values) {
  return {
    type: SET_PARAMETERS_SUCCESS,
    payload: values
  }
}


export function getAllParameters() {

  let url = '/api/parameter/getall'

  return fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw Error(response.statusText)
      } else {
      }
      return response
    })
    .then((response) => response.json())
    .then((items) => parametersFetchDataSuccess(items))
    .catch((error) => {
      console.log(error)
      parametersHasErrored(true)
    })
}


export function setParameter(type, time) {

  let url = `/api/parameter/set?timer_type=${type}&timer_time=${time}`;

  return fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw Error(response.statusText)
      } else {
      }
      return response
    })
    .then((response) => response.json())
    .then((items) => parametersSetDataSuccess(items))
    .catch((error) => {
      console.log(error)
      parametersHasErrored(true)
    })
}

function parameterIsLoading(bool) {
  return {
    type: PARAMETER_DATA_IS_LOADING,
    payload: bool
  }
}



export function setInvoiceParameter(value) {

  let url = `/api/parameter/setinvoice?invoice_seri_no=${value.invoice_seri_no}&invoice_sira_no=${value.invoice_sira_no}`;


  return (dispatch) => {
    dispatch(parameterIsLoading(true))

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw Error(response.statusText)
        } else {
        }
        dispatch(parameterIsLoading(false))

        return response
      })
      .then((response) => response.json())
      .then((items) => dispatch(parametersSetDataSuccess(value)))
      .catch((error) => {
        console.log(error)
        dispatch(parametersHasErrored(true))
      })
  }
}


export function getInvoiceParameter() {

  let url = '/api/parameter/getinvoice'

  return fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw Error(response.statusText)
      } else {
      }
      return response
    })
    .then((response) => response.json())
    .then((items) => parametersFetchDataSuccess(items))
    .catch((error) => {
      console.log(error)
      parametersHasErrored(true)
    })
}