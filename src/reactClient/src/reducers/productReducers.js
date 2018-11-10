import {
	SELECT_PRODUCT,
	QUERY_PRODUCTS
} from '../actions/productActions';

function selectedNavProduct(state = '', action) {
	switch (action.type) {
		case SELECT_PRODUCT:
			return action.id;
		default:
			return state;
	}
}

function queryProducts(state = {}, action) {
	switch (action.type) {
		case QUERY_PRODUCTS:
			return Object.assign({}, state, action.data, {
				updateTime: action.updateTime
			});
		default:
			return state;
	}
}

const productReducer = () => ({
	selectedProduct: selectedNavProduct,
	products: queryProducts
});

export default productReducer;