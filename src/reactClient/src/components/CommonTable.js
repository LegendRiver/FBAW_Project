import React, {
	Component
} from 'react';

import TableHeader from './TableHeader';
import TableRow from './TableRow';
import '../css/commonTable.css';


export default class CommonTable extends Component {
	render() {
		const headerDatas = this.props.header;
		const rowdatas = this.props.rows;

		if (!headerDatas || !rowdatas) {
			return null;
		}

		return (
			<table className="common-table-class">
			    <thead>
				    <TableHeader header={headerDatas}/>
				</thead>

				<tbody>
				   {
					  rowdatas.map((row, i) => (
                      <TableRow key={i} rowData={row}/>
					  ))
			       }
			    </tbody>
			</table>
		);
	}
}