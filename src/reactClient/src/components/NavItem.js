import React, {
	Component
} from 'react';
import PropTypes from 'prop-types';
import '../css/navItem.css';


export default class NavItem extends Component {
	constructor(props) {
		super(props);
		this.onClick = this.onClick.bind(this);
	}

	onClick() {
		this.props.click(this.props.id, this.props.accountList);
	}

	render() {
		return (
			<div className='navitem-container' onClick={this.onClick}>
		      <img className='navitem-image' src={this.props.imagePath} alt="Product Image"/>
		      <a className='navitem-text'>{this.props.name}</a>
		   </div>
		);
	}
}

NavItem.propTypes = {
	click: PropTypes.func.isRequired,
	imagePath: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired
};