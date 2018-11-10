import React, {
	Component
} from 'react';


export default class TableRow extends Component {
	render() {
		return (
			<tr>
			 {
			 	this.props.rowData.map( (cell, i) => (
			     	  <td className="table-td" key={i}>{cell}</td>
			     	)
			     	)
			 }
			</tr>
		);
	}
}