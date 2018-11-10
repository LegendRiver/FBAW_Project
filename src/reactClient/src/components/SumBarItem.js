import React, {Component} from 'react';


export default class SumBarItem extends Component
{
    render()
    {
        return (
            <div className="sum-bar-item-div">
                <div>
                    <span className="sum-bar-item-title">{this.props.itemName}</span>
                </div>
                <div>
                    <span className="sum-bar-item-value">{this.props.itemValue}</span>
                </div>
            </div>
        );
    }
}
