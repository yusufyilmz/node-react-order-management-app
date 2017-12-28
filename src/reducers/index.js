import { combineReducers } from 'redux'
import ProductReducer from './productReducer'
import { reducer as formReducer } from 'redux-form'
import { orderReducer } from './orderReducer'
import { invoiceReducer } from './invoiceReducer'
import { shippingReducer } from './shippingReducer'
import { parameterReducer } from './parameterReducer'
import { authReducer } from './authReducer';

const rootReducer = combineReducers({
  products: ProductReducer,
  form: formReducer,
  invoice: invoiceReducer,
  order: orderReducer,
  shipping: shippingReducer,
  parameter: parameterReducer,
  auth: authReducer

})

export default rootReducer
