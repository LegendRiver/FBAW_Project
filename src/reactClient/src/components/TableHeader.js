import React, {
	Component
} from 'react';


export default class TableHead extends Component {
	render() {
		const headTitle = this.props.header;
		if (!headTitle) {
			return null;
		}
		return (
			<tr>
			 {
			 	headTitle.map(
			 		(cell, i) => (<th className="table-th" key={i}>{cell}</th>)
			    )
			 }
			</tr>
		);
	}
}