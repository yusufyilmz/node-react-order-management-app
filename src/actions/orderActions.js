import { GET_ORDERS, ARCHIVE_ORDER_SUCCESS, ORDERSN11_DATA_DETAIL_FAIL, ORDERSN11_DATA_DETAIL_SUCCESS, ORDERS_DATA_DETAIL_COUNT_SUCCESS, INITIALIZE_ARCHIVE_DATA, ORDERS_ARCHIVE_DETAIL_SUCCESS, ORDER_DATA_ITEM_IS_LOADING, ORDERS_FILTER_SUCCESS, ORDERS_WITHOUT_INVOICE_GET_SUCCESS, ORDERS_DATA_DETAIL_SUCCESS, SEARCH_ORDER_DATA_IS_LOADING, ORDERS_UPDATE_DATA_SUCCESS, ORDER_DATA_IS_LOADING, ORDER_DATA_HAS_ERRORED, ORDER_DATA_SUCCESS, ORDER_DATA_DETAIL_SUCCESS } from './types'
import Axios from 'axios'
import _ from 'lodash'

function itemsHasErrored(err) {
  return {
    type: ORDER_DATA_HAS_ERRORED,
    hasErrored: err
  }
}
function getOrderIsLoading(bool) {
  return {
    type: ORDER_DATA_IS_LOADING,
    isLoading: bool
  }
}

function initializeArchive(bool) {
  return {
    type: INITIALIZE_ARCHIVE_DATA,
  }
}



function getOrderItemIsLoading(values, bool) {

  const item = {
    order_id: values.order_id,
    isLoading: bool
  }

  return {
    type: ORDER_DATA_ITEM_IS_LOADING,
    payload: item
  }
}




function itemsUpdateDataSuccess(values) {
  return {
    type: ORDERS_UPDATE_DATA_SUCCESS,
    payload: values
  }
}

function searchOrderIsLoading(bool) {
  return {
    type: SEARCH_ORDER_DATA_IS_LOADING,
    isLoading: bool
  }
}

function itemsFetchDataSuccess(items) {
  return {
    type: ORDER_DATA_SUCCESS,
    payload: items
  }
}

function itemDetailDataSuccess(items) {
  return {
    type: ORDER_DATA_DETAIL_SUCCESS,
    payload: items
  }
}

function itemsDetailDataSuccess(items) {

  console.log(items);
  return {
    type: ORDERS_DATA_DETAIL_SUCCESS,
    payload: items
  }
}


function itemsDetailDataSuccess2(items) {

  console.log(items);
  if (items.result === true) {
    return {
      type: ORDERS_DATA_DETAIL_SUCCESS,
      payload: items.value
    }
  }
  else {
    return {
      type: ORDER_DATA_HAS_ERRORED,
      hasErrored: items.value
    }
  }
}



function itemsn11DetailDataSuccess(items) {

  console.log("itemsn11DetailDataSuccess");
  console.log(items);

  if (items.result) {
    return {
      type: ORDERSN11_DATA_DETAIL_SUCCESS,
      payload: items.data
    }
  }
  else {
    return {
      type: ORDERSN11_DATA_DETAIL_FAIL,
      payload: items.error
    }
  }

}




function itemsGetCountSuccess(items) {

  return {
    type: ORDERS_DATA_DETAIL_COUNT_SUCCESS,
    payload: items['COUNT(*)']
  }
}



function itemsArchiveDetailDataSuccess(items) {

  console.log(items);
  return {
    type: ORDERS_ARCHIVE_DETAIL_SUCCESS,
    payload: items
  }
}

function archiveOrderSuccess(items) {

  return {
    type: ARCHIVE_ORDER_SUCCESS,
    payload: items
  }
}





function ordersWithoutInvoiceSuccess(values) {

  console.log("valıes")
  console.log(values)

  return {
    type: ORDERS_WITHOUT_INVOICE_GET_SUCCESS,
    payload: values
  }
}

export function filterOrders() {
  return (dispatch) => {
    dispatch(getOrderIsLoading(true))

    fetch(`/api/order/withoutinvoice`)
      .then((response) => {
        if (!response.ok) {
          throw Error(response.statusText)
        } else {
        }
        dispatch(getOrderIsLoading(false))
        return response
      })
      .then((response) => response.json())
      .then((items) => dispatch(itemsDetailDataSuccess(items)))
      .catch((error) => {
        console.log(error)
        dispatch(itemsHasErrored(error))
      })
  }

}


export function searchOrders(values) {
  let url = '/api/order/search?'

  _.forEach(values, (value, key) => {
    url += key + '=' + value + '&'
  })

  return (dispatch) => {
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw Error(response.statusText)
        } else {
          // console.log(response)
        }
        dispatch(searchOrderIsLoading(false))
        return response
      })
      .then((response) => response.json())
      .then((items) => dispatch(itemsDetailDataSuccess(items)))
      .catch((error) => {
        console.log('error')

        console.log(error)
        dispatch(itemsHasErrored(error))
      })
  }
}






export function getOrderCount() {
  return (dispatch) => {

    fetch(`/api/order/getarchivedcount`)
      .then((response) => {
        if (!response.ok) {
          throw Error(response.statusText)
        } else {
        }
        return response
      })
      .then((response) => response.json())
      .then((items) => dispatch(itemsGetCountSuccess(items)))
      .catch((error) => {
        console.log(error)
        dispatch(itemsHasErrored(error))
      })
  }
}


export function getN11OrderCount() {
  return (dispatch) => {

    fetch(`/api/order/getN11archivedcount`)
      .then((response) => {
        if (!response.ok) {
          throw Error(response.statusText)
        } else {
        }
        return response
      })
      .then((response) => response.json())
      .then((items) => dispatch(itemsGetCountSuccess(items)))
      .catch((error) => {
        console.log(error)
        dispatch(itemsHasErrored(error))
      })
  }
}


export function getDeliveredOrdersDetail() {
  return (dispatch) => {
    dispatch(getOrderIsLoading(true))

    fetch(`/api/order/getdelivered`)
      .then((response) => {
        if (!response.ok) {
          throw Error(response.statusText)
        } else {
        }
        dispatch(getOrderIsLoading(false))
        return response
      })
      .then((response) => response.json())
      .then((items) => dispatch(itemsDetailDataSuccess(items)))
      .catch((error) => {
        console.log(error)
        dispatch(itemsHasErrored(error))
      })
  }
}

// export function getOrdersDetail() {
//   console.log("getOrdersDetail");
//   return (dispatch) => {
//     dispatch(getOrderIsLoading(true))

//     fetch(`/api/order/get`)
//       .then((response) => {
//         if (!response.ok) {
//           throw Error(response.statusText)
//         } else {
//         }
//         dispatch(getOrderIsLoading(false))
//         return response
//       })
//       .then((response) => response.json())
//       .then((items) => dispatch(itemsDetailDataSuccess(items)))
//       .catch((error) => {
//         console.log(error)
//         dispatch(itemsHasErrored(true))
//       })
//   }
// }


export function getN11ArchivedOrdersDetail(values) {
  console.log("getN11ArchivedOrdersDetail");
  return (dispatch) => {
    dispatch(getOrderIsLoading(true))

    fetch(`/api/order/getN11archived?pageid=${values.pageid}&perpage=${values.perpage}`)
      .then((response) => {
        if (!response.ok) {
          throw Error(response.statusText)
        } else {
        }
        dispatch(getOrderIsLoading(false))
        return response
      })
      .then((response) => response.json())
      .then((items) => dispatch(itemsArchiveDetailDataSuccess(items)))
      .catch((error) => {
        console.log(error)
        dispatch(itemsHasErrored(error))
      })
  }
}


export function getArchivedOrdersDetail(values) {
  console.log("getArchivedOrdersDetail");
  return (dispatch) => {
    dispatch(getOrderIsLoading(true))

    fetch(`/api/order/getarchived?pageid=${values.pageid}&perpage=${values.perpage}`)
      .then((response) => {
        if (!response.ok) {
          throw Error(response.statusText)
        } else {
        }
        dispatch(getOrderIsLoading(false))
        return response
      })
      .then((response) => response.json())
      .then((items) => dispatch(itemsArchiveDetailDataSuccess(items)))
      .catch((error) => {
        console.log(error)
        dispatch(itemsHasErrored(error))
      })
  }
}

export function archiveOrder(values) {
  console.log("archive");
  return (dispatch) => {
    dispatch(getOrderIsLoading(true))

    fetch(`/api/order/archive?state=${values.archive_state}&orderid=${values.order_id}&platformid=${values.platform_id}`)
      .then((response) => {
        if (!response.ok) {
          throw Error(response.statusText)
        } else {
        }
        dispatch(getOrderIsLoading(false))
        // dispatch(initializeArchive())

        return response
      })
      .then((response) => response.json())
      .then((items) => dispatch(archiveOrderSuccess(values)))
      .catch((error) => {
        console.log(error)
        dispatch(itemsHasErrored(error))
      })
  }
}


export function updateOrderStatus(values) {
  let url = '/api/order/updatestatus?'
  _.forEach(values, (value, key) => {
    url += key + '=' + value + '&'
  })

  return (dispatch) => {
    dispatch(getOrderItemIsLoading(values, true))

    fetch(url)
      .then(response => {
        if (response.status >= 200 && response.status < 300) {
          dispatch(getOrderItemIsLoading(values, false))

          return response
        } else {
          const error = new Error(response.statusText)
          error.response = response
          // 
          throw error
        }
      })
      .then((response) => response.json())
      .then((items) => dispatch(itemsUpdateDataSuccess(values)))
      .catch(error => dispatch(itemsHasErrored(error)))
  }
}







export function updateOrderShippingId(values) {
  let url = '/api/order/updateshipping?'

  _.forEach(values, (value, key) => {
    url += key + '=' + value + '&'
  })

  return (dispatch) => {
    dispatch(getOrderItemIsLoading(values, true))
    fetch(url)
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          dispatch(getOrderItemIsLoading(values, false))

          return response
        } else {
          const error = new Error(response.statusText)
          error.response = response
          // dispatch(itemsHasErrored(error))
          throw error
        }

      })
      .then((response) => response.json())
      .then((items) => dispatch(itemsUpdateDataSuccess(values)))
      .catch((error) => {
        console.log(error)
        dispatch(itemsHasErrored(error))
      })
  }
}

export function getOrdersWithoutInvoice(values) {
  let url = '/api/order/withoutinvoice'

  // _.forEach(values, (value, key) => {
  //   url += key + '=' + value + '&'
  // })

  return (dispatch) => {
    dispatch(getOrderIsLoading(true))
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw Error(response.statusText)
        } else {
        }
        dispatch(getOrderIsLoading(false))
        //  console.log(response.json())
        return response
      })
      .then((response) => response.json())
      .then((items) => dispatch(ordersWithoutInvoiceSuccess(items)))
      .catch((error) => {
        console.log(error)
        dispatch(itemsHasErrored(error))
      })
  }
}




export function updateOrder(values) {

  return (dispatch) => {

    dispatch(getOrderIsLoading(true))

    fetch("api/order/update", {
      method: 'POST',
      body: JSON.stringify({
        data: values,
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((response) => {
      if (!response.ok) {
        throw Error(response.statusText)
      }

      dispatch(getOrderIsLoading(false))
      return response
    }).then((response) => response.json())
      .then(() => dispatch(itemsUpdateDataSuccess(true)))
      .catch((error) => {
        console.log(error)
        dispatch(itemsHasErrored(error))
      })

  }

}


export function checkNewOrders() {
  return (dispatch) => {
    dispatch(getOrderIsLoading(true))

    fetch(`/api/order/check`)
      .then((response) => {
        if (!response.ok) {
          throw Error(response.statusText)
        } else {
        }
        dispatch(getOrderIsLoading(false))
        return response
      })
      .then((response) => response.json())
      .then((items) => dispatch(itemsDetailDataSuccess(items)))
      .catch((error) => {
        console.log(error)
        dispatch(itemsHasErrored(error))
      })
  }
}


export function checkNewOrder(id) {
  return (dispatch) => {
    dispatch(getOrderIsLoading(true))

    fetch(`/api/order/checkorder?orderid=${id}`)
      .then((response) => {
        if (!response.ok) {
          throw Error(response.statusText)
        } else {
        }
        dispatch(getOrderIsLoading(false))
        return response
      })
      .then((response) => response.json())
      .then((items) => dispatch(itemsDetailDataSuccess2(items)))
      .catch((error) => {
        console.log(error)
        dispatch(itemsHasErrored(error))
      })
  }
}




export function filterOrderStatus(id) {

  console.log("filterorderstatus")
  return (dispatch) => {
    dispatch(getOrderIsLoading(true))

    fetch(`/api/order/filter?id=${id}`)
      .then((response) => {
        if (!response.ok) {
          throw Error(response.statusText)
        } else {
        }
        dispatch(getOrderIsLoading(false))
        return response
      })
      .then((response) => response.json())
      .then((items) => dispatch(itemsDetailDataSuccess(items)))
      .catch((error) => {
        console.log(error)
        dispatch(itemsHasErrored(error))
      })
  }
}




export function getOrdersDetail() {
  console.log("getOrdersDetail");
  return (dispatch) => {
    dispatch(getOrderIsLoading(true))

    fetch(`/api/order/get`)
      .then((response) => {
        if (!response.ok) {
          throw Error(response.statusText)
        } else {
        }
        dispatch(getOrderIsLoading(false))
        return response
      })
      .then((response) => response.json())
      .then((items) => dispatch(itemsDetailDataSuccess(items)))
      .catch((error) => {
        console.log(error)
        dispatch(itemsHasErrored(error))
      })
  }
}


export function getN11OrdersDetail() {
  console.log("getN11OrdersDetail");
  return (dispatch) => {
    dispatch(getOrderIsLoading(true))

    fetch(`/api/order/getn11orders`)
      .then((response) => {
        if (!response.ok) {
          throw Error(response.statusText)
        } else {
        }
        dispatch(getOrderIsLoading(false))
        return response
      })
      .then((response) => response.json())
      .then((items) => dispatch(itemsn11DetailDataSuccess(items)))
      .catch((error) => {
        console.log(error)
        dispatch(itemsHasErrored(error))
      })
  }
}


export function getAllN11OrdersDetail() {
  console.log("getAllN11OrdersDetail");
  return (dispatch) => {
    dispatch(getOrderIsLoading(true))

    fetch(`/api/order/getalln11orders`)
      .then((response) => {
        if (!response.ok) {
          throw Error(response.statusText)
        } else {
        }
        dispatch(getOrderIsLoading(false))
        return response
      })
      .then((response) => response.json())
      .then((items) => dispatch(itemsn11DetailDataSuccess(items)))
      .catch((error) => {
        console.log(error)
        dispatch(itemsHasErrored(error))
      })
  }
}


