import { GET_ORDERS, ORDER_DATA_ITEM_IS_LOADING, ORDERSN11_DATA_DETAIL_SUCCESS, ORDERSN11_DATA_DETAIL_FAIL, ORDERS_DATA_DETAIL_COUNT_SUCCESS, INITIALIZE_ARCHIVE_DATA, ARCHIVE_ORDER_SUCCESS, ORDERS_ARCHIVE_DETAIL_SUCCESS, ORDERS_FILTER_SUCCESS, ORDERS_WITHOUT_INVOICE_GET_SUCCESS, ORDER_DATA_DETAIL_SUCCESS, ORDERS_UPDATE_DATA_SUCCESS, ORDERS_DATA_DETAIL_SUCCESS, ORDER_DATA_IS_LOADING, ORDER_DATA_HAS_ERRORED, ORDER_DATA_SUCCESS } from '../actions/types'
import _ from 'lodash'

const INITIAL_STATE = {
  orderDetail: [],
  archivedOrderDetail: [],
  itemsHasErrored: null,
  itemsIsLoading: false,
  orderItemIsLoading: {},
  itemUpdateSuccess: {},
  orders: [],
  orderWithoutInvoice: {},
  orderFilter: false,
  archive: {},
  archiveList: [],
  count: 0

}

export function orderReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case ORDERS_DATA_DETAIL_COUNT_SUCCESS:
      return { ...state, count: action.payload }
    case ORDER_DATA_HAS_ERRORED:
      console.log(action);
      return { ...state, itemsHasErrored: action.hasErrored }
    case ORDER_DATA_IS_LOADING:
      return { ...state, itemsIsLoading: action.isLoading }
    case ORDERS_UPDATE_DATA_SUCCESS:
      return { ...state, itemsHasErrored: null, orderItemIsLoading: {}, itemUpdateSuccess: action.payload }
    case ORDER_DATA_DETAIL_SUCCESS:
      return { ...state, itemsHasErrored: null, archiveList: [], orderDetail: manageOrders(action.payload) }
    case ORDERS_ARCHIVE_DETAIL_SUCCESS:
      return { ...state, itemsHasErrored: null, orderDetail: [], archivedOrderDetail: manageOrders(action.payload) }
    case ORDERSN11_DATA_DETAIL_SUCCESS:
      return { ...state, itemsHasErrored: null, orderDetail: action.payload }
    case ORDERSN11_DATA_DETAIL_FAIL:
      return { ...state, itemsHasErrored: action.payload}
    case ARCHIVE_ORDER_SUCCESS:
      var objectIndex = _.findIndex(state.archiveList, (o) => { return o.order_id === action.payload.order_id })
      if (objectIndex != -1) {
        return {
          ...state,
          archiveList: state.archiveList.map(todo => todo.order_id === action.payload.order_id ?
            { ...todo, archive_state: action.payload.archive_state } :
            todo
          )
        };

      }
      else {
        return { ...state, archiveList: [...state.archiveList, action.payload] }
      }
    case ORDERS_DATA_DETAIL_SUCCESS:
      return { ...state, itemsHasErrored: null, itemUpdateSuccess: {}, orderItemIsLoading: {}, orderDetail: manageOrders(action.payload) }
    case ORDER_DATA_ITEM_IS_LOADING:
      return { ...state, orderItemIsLoading: action.payload }
    case ORDER_DATA_SUCCESS:
      return { ...state, itemsHasErrored: null, orders: _.mapKeys(action.payload, 'id') }
    case ORDERS_FILTER_SUCCESS:
      return { ...state, itemsHasErrored: null, orderFilter: action.payload }
    case GET_ORDERS:
      return { ...state, itemsHasErrored: null, orders: _.mapKeys(action.payload, 'id') }
    case ORDERS_WITHOUT_INVOICE_GET_SUCCESS:
      return { ...state, itemsHasErrored:null, orderWithoutInvoice: manageOrders(action.payload) }
    default:
      return state;
  }
}

function manageOrders(orders) {
  var orderList = []

  _.forEach(orders, (order) => {
    if (order) {
      if (orderList[order.order_id] == undefined) {
        orderList[order.order_id] = order
        const products = [{
          'product_id': order.product_id,
          'product_name': order.product_name,
          'product_code': order.product_code,
          'product_quantity': order.product_quantity,
          'product_price': order.product_price,
          'product_unit_price': order.product_unit_price,
          'product_unit_price_with_tax': order.product_unit_price_with_tax,
          'product_price_with_tax': order.product_price_with_tax
        }]

        orderList[order.order_id].products = products
      } else {
        const product = {
          'product_id': order.product_id,
          'product_name': order.product_name,
          'product_code': order.product_code,
          'product_quantity': order.product_quantity,
          'product_unit_price': order.product_unit_price,
          'product_unit_price_with_tax': order.product_unit_price_with_tax,
          'product_price': order.product_price,
          'product_price_with_tax': order.product_price_with_tax
        }

        orderList[order.order_id].products.push(product)
      }
    }
  })
  return _.mapKeys(orderList, 'order_id')
}

