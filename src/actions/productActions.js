import { GET_PRODUCTS, PRODUCT_DATA_HAS_ERRORED, PRODUCT_DATA_IS_LOADING, PRODUCT_UPDATE_DATA_SUCCESS } from './types'
import Axios from 'axios'
import _ from 'lodash'

export function getAllProducts () {
  const request = Axios.get('/api/product/get')
  return {
    type: GET_PRODUCTS,
    payload: request
  }
}

export function productsHasErrored (bool) {
  return {
    type: PRODUCT_DATA_HAS_ERRORED,
    hasErrored: bool
  }
}
export function productsIsLoading (bool) {
  return {
    type: PRODUCT_DATA_IS_LOADING,
    isLoading: bool
  }
}

export function productsFetchDataSuccess (values) {
  return {
    type: PRODUCT_UPDATE_DATA_SUCCESS,
    payload: values
  }
}

export function updateProduct (values) {
  let url = `/api/product/update?`
  _.forEach(values, (value, key) => {
    url += key + '=' + value + '&'
  })

  return (dispatch) => {
    dispatch(productsIsLoading(true))

    fetch(url)
           .then((response) => {
             if (!response.ok) {
               throw Error(response.statusText)
             } else {
             }
             dispatch(productsIsLoading(false))

             return response
           })
            .then((response) => response.json())
            .then((items) => dispatch(productsFetchDataSuccess(values)))
            .catch((error) => {
              console.log(error)
              dispatch(productsHasErrored(true))
            })
  }
}
