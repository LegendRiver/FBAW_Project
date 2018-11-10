import React, {Component} from 'react';
import CommonTable from './CommonTable';
import '../css/performanceTable.css';


export default class PerformanceTable extends Component
{
	render() {
		return (
			<div className="performance-table-div">
				<CommonTable header={this.props.header} rows={this.props.rows}>
				</CommonTable>
			</div>
		);
	}
}