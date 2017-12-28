import React, { Component } from 'react';

class ShippingDetail extends Component {

    constructor(props) {
        super(props);

        this.state = { checked : this.props.item.checked}
    }

    changeChecked (event) {
        this.props.handleClick(this.props.item.shipping_number);
        this.setState({ checked : !this.state.checked})
    }

    render() {
        const { item } = this.props;
        var difference = "";

        console.log("difference");
        console.log(item);

        console.log(item.difference);
        if(item.difference == 0) {
            difference = "0";
        }
        else if(item.difference ) {
            difference = item.difference.toString().substring(0, 5);
        }

        
        // difference = difference.substring(0, 5);
        return (
            <tr>
                <td>{item.shipping_customer}</td>
                <td>{item.shipping_number}</td>
                <td>{item.order_customer}</td>
                <td>{item.order_id}</td>
                <td>{difference}</td>
                <td><input
                    type="checkbox"
                    checked={this.state.checked}
                    onChange = { this.changeChecked.bind(this)}
                /></td>
            </tr>
        )
    }
}




export default ShippingDetail;