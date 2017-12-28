import React, { Component } from 'react'
import _ from 'lodash'
import { Link } from 'react-router-dom'
import moment from 'moment';

class InvoiceItem extends Component {
  constructor(props) {
    super(props)

   

  }


  componentDidMount() {

  }

  render() {

    const link = `/invoice/${this.props.item.order_invoice_id}`;

    let time = moment(this.props.item.invoice_prepare_date)
    let timeStr = time.format("DD-MM-YYYY HH:mm:ss");

    // const link = `/invoice/${this.props.item.id}`
    return (

      <tr>
        <td>
          {this.props.item.order_id}
        </td>
        <td>
          {this.props.item.invoice_sira_no}
        </td>

        <td>
          {this.props.item.invoice_seri_no}
        </td>
        <td>
          {this.props.item.invoice_total_price.replace('.', ',')} 
        </td>
        <td>
          {this.props.item.invoice_tax_price.replace('.', ',')} 
        </td>
        <td>
          {timeStr}
        </td>
    
        {/*<td>
          <button className='orderDetailButton'>
            <Link to={link} >Generate Invoice</Link>
          </button>
        </td>*/}
      </tr >
    )
  }
}

export default InvoiceItem

// function mapStateToProps (state, ownProps) {
//   // console.log(state.itemUpdateSuccess.id)

//   return {
//     success: state.order.itemUpdateSuccess,
//     hasErrored: state.order.itemsHasErrored,
//     isLoading: state.order.itemsIsLoading
//   }
// }

// export default connect(mapStateToProps, null)(OrderInvoiceDetailItem)



// import React, { Component } from 'react'
// import _ from 'lodash'
// import { Link } from 'react-router-dom'

// class InvoiceItem extends Component {
//   constructor (props) {
//     super(props)
//   }

//   componentDidMount () {

//   }

//   render () {
//     const link = `/invoice/${this.props.item.id}`
//     return (

//       <div>
//         <div className='orderDetailItem'>
//           <label className='label'>
//                           order code: {this.props.item.order_code}
//           </label> <br />

//           <label className='label'>
//                           order date: {this.props.item.date_added}
//           </label> <br />

//           {/* <button className='orderButton normalBtn' onClick={this.updateOrderStatus.bind(this)}>Update status</button>
//           <button className='orderButton normalBtn' onClick={this.updateOrderShippingId.bind(this)}>Update Shipping</button>*/}
//           <div>
//             <button style={{ width: '100%',  marginTop: '20px' }}>
//             <Link to={link} className='orderButton normalBtn'>Generate Invoice</Link>
//             </button>

//           </div>
//         </div>
//       </div>
//     )
//   }
// }

// export default InvoiceItem

// // function mapStateToProps (state, ownProps) {
// //   // console.log(state.itemUpdateSuccess.id)

// //   return {
// //     success: state.order.itemUpdateSuccess,
// //     hasErrored: state.order.itemsHasErrored,
// //     isLoading: state.order.itemsIsLoading
// //   }
// // }

// // export default connect(mapStateToProps, null)(OrderInvoiceDetailItem)
