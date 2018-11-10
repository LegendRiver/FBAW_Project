import React, {Component} from 'react';
import {connect} from 'react-redux';
import {selectOneProduct, fetchProductDatas} from '../actions/productActions';
import {PRODUCT_DATAS, PRODUCT_ID} from '../constants/stateKeys';

import NavList from '../components/NavList';

class NavContainer extends Component {

	constructor(props)
	{
		super(props);
		this.onClick = this.onClick.bind(this);
	}

	componentDidMount()
	{
		const {dispatch} = this.props;
		dispatch(fetchProductDatas());
	}

    componentWillReceiveProps(nextProps)
    {
    	const {products, selectedProductId} = nextProps;
    	if(!selectedProductId && products)
		{
			if(products.length > 0)
			{
				const firstProduct = products[0];
				const firstProductId = firstProduct[PRODUCT_ID];
                const {dispatch} = this.props;
                dispatch(selectOneProduct(firstProductId));
			}
		}
    }

	onClick(id)
	{
		const {dispatch} = this.props;
		dispatch(selectOneProduct(id));
	}

	render()
	{
		const {products} = this.props;

		if (!products)
		{
			return null;
		}

		return (
			<NavList products={products} onClick={this.onClick}/>
		);
	}
}

const mapStateToProps = state => {
	const {products, selectedProduct} = state;
	const productDatas = products[PRODUCT_DATAS];
	return {
		products: productDatas,
		selectedProductId: selectedProduct
	};
};

export default connect(mapStateToProps)(NavContainer);