import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { getAllParameters, setParameter } from '../actions/index';

class Parameter extends Component {

  constructor(props) {
    super(props);

    this.state = {
      presta_timer: null,
      shipping_timer: null,

    }
  }


  componentWillMount() {
    this.props.getAllParameters();
  }

  componentDidMount() {
    document.body.scrollTop = 0
    // document.querySelector('.menu').classList.remove('open')
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.parameters != null) {
      this.setState({
        presta_timer: nextProps.parameters.presta_timer,
        shipping_timer: nextProps.parameters.shipping_timer,
      });

    }
  }



  onChangePrestaTimer(e) {
    this.setState({ presta_timer: e.target.value });
  }

  onChangeShippingTimer(e) {
    this.setState({ shipping_timer: e.target.value });
  }

  render() {
    return (
      <div>
        <div className="panel panel-default">
          <div className="panel-body table-responsive">
            <b>Presta Timer</b> <input style={{marginLeft:'15px'}} type='text' value={this.state.presta_timer} onChange={this.onChangePrestaTimer.bind(this)} />

          </div>
        </div>
        <div className="panel panel-default">
          <div className="panel-body table-responsive">
            <b>Shipping Timer</b> <input type='text' value={this.state.shipping_timer} onChange={this.onChangeShippingTimer.bind(this)} />
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {

  // console.log(state.parameter);
  return {
    parameters: (state.parameter.parameters),
    error: (state.parameter.error),
    setParameterResult: (state.parameter.setParameterResult),
  }
}


export default connect(mapStateToProps, { getAllParameters, setParameter })(Parameter);
