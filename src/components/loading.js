import React from 'react'
import ReactLoading from 'react-loading'

const Loading = ({ visible }) => (
  <div className="loading">
  <ReactLoading  color='black'  type='cylon' height='10%' width='100%' />
  </div>
)

export default Loading
