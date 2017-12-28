import { GET_PRODUCTS, PRODUCT_UPDATE_DATA_SUCCESS  } from '../actions/types'
import _ from 'lodash';

const INITIAL_STATE = {
  products: [],
  productUpdateSuccess : {}
}

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case GET_PRODUCTS:
      return { ...state, products: _.mapKeys(action.payload.data, 'product_refid') }
    case PRODUCT_UPDATE_DATA_SUCCESS:
      return { ...state, productUpdateSuccess: action.payload }
    default:
      return state
  }
}
