import { INIT_INVOICE, ADD_INVOICE_SUCCESS, GET_INVOICE_SUCCESS, INVOICE_GET_DATA_SUCCESS, INVOICE_SET_STYLE_SUCCESS, INVOICE_GET_STYLE_SUCCESS, ORDERS_WITHOUT_INVOICE_GET_SUCCESS, INVOICE_DATA_HAS_ERRORED, INVOICE_DATA_IS_LOADING, INVOICE_CREATE_PDF_SUCCESS } from '../actions/types'

const INITIAL_STATE = {
  pdf: null,
  details: [],
  invoiceHasErrored: false,
  invoiceIsLoading: false,
  invoiceStyle: null,
  invoices: [],
  success: false
}

export function invoiceReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case INVOICE_GET_DATA_SUCCESS:
      return { ...state, pdf: null, details: manageInvoiceDetails(action.payload) }
    case INVOICE_CREATE_PDF_SUCCESS:
      return { ...state, pdf: action.payload }
    case INVOICE_DATA_HAS_ERRORED:
      return { ...state, invoiceHasErrored: action.hasErrored }
    case INVOICE_DATA_IS_LOADING:
      return { ...state, pdf: null, invoiceIsLoading: action.isLoading }
    case INVOICE_SET_STYLE_SUCCESS:
      return { ...state, invoiceStyle: action.payload }
    case INVOICE_GET_STYLE_SUCCESS:
      return { ...state, invoiceStyle: action.payload }
    case ADD_INVOICE_SUCCESS:
       return { ...state, success: action.payload }
    case GET_INVOICE_SUCCESS:
            console.log("action.payload")

            console.log(action.payload)

      return { ...state, success: false, invoices: action.payload }

    case INIT_INVOICE: {
      return { ...state, pdf: null }
    }
    default:
      return state
  }
}

function manageInvoiceDetails(invoiceList) {
  var tempInvoice = {}
  if (invoiceList.length <= 0) {
    return tempInvoice
  }
  tempInvoice = invoiceList[0]

  tempInvoice.products = []

  _.forEach(invoiceList, (invoice) => {
    const product = {
      'product_id': invoice.product_id,
      'product_name': invoice.product_name,
      'product_code': invoice.product_code,
      'product_quantity': invoice.product_quantity,
      'product_price': invoice.product_price,
      'product_unit_price': invoice.product_unit_price
    }

    tempInvoice.products.push(product)
  })

  console.log('tempInvoice')

  console.log(tempInvoice)
  return tempInvoice
}
