import React, {
	Component
} from 'react';
import NavItem from '../components/NavItem';
import '../css/navContainer.css';

export default class NavList extends Component {
	render() {
		const products = this.props.products;
		return (
			<div className="navList-container">
		    	{Object.values(products).map(product => 
                    (
                    	<NavItem key={product.id} {...product} imagePath={product.imagePath} 
                    	click={this.props.onClick}>
                    	</NavItem>
                    	)
		    		)}
		    </div>
		);
	}
}