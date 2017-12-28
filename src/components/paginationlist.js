import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

class PaginationList extends React.Component {

    renderPaginationItems() {

        var numberArray = [];

        for (var i = 1; i <= this.props.count; i++) {
            numberArray.push(i);
        }

        return _.map(numberArray, (itemindex) => {
            return <PaginationItem index={itemindex} isActive={this.props.activeIndex === itemindex} onClick={this.handleClick.bind(this)} />
        })

    }

    handleClick = (index) =>  this.props.onClick(index);

    handlePreviousClick = () => {
        if(this.props.activeIndex > 1 ) {
            this.props.onClick(this.props.activeIndex-1)
        }
    }

    handleNextClick = () => {
        if(this.props.activeIndex < this.props.count ) {
            this.props.onClick(this.props.activeIndex+1)
        }
    }

    render() {
        return (
            <ul className="pagination" >
                <li class="previous" ><a onClick={this.handlePreviousClick.bind(this)} tabindex="0" >previous</a></li>
                {this.renderPaginationItems()}
                <li class="next" ><a onClick={this.handleNextClick.bind(this)} tabindex="0" >next</a></li>
            </ul>
        )
    }


}

class PaginationItem extends Component {
    handleClick = () => this.props.onClick(this.props.index)

    render() {
        return <li
            className={
                this.props.isActive ? 'active' : ''
            }
            onClick={this.handleClick}
        >
            <a tabindex={this.props.index} aria-label="Page 1" aria-current="page" >{this.props.index}</a>
        </li>
    }
}


export default PaginationList;