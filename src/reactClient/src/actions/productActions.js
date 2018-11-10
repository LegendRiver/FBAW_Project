import {PRODUCT_ALL_IDS, PRODUCT_DATAS} from '../constants/stateKeys';

export const SELECT_PRODUCT = 'SELECT_PRODUCT';
export const QUERY_PRODUCTS = 'QUERY_PRODUCTS';


export function selectOneProduct(productId)
{
	return {
		type: SELECT_PRODUCT,
		id: productId
	};
}

function queryProductData(products)
{
	return {
		type: QUERY_PRODUCTS,
		data: products,
		updateTime: Date.now()
	};
}

function preHandleProductData(queryData)
{
	let productIds = Object.keys(queryData);

	let products = {};
	products[PRODUCT_DATAS] = queryData;
	products[PRODUCT_ALL_IDS] = productIds;

	return products;
}

function fetchProducts(dispatch)
{

	let url = 'http://52.42.202.255:8050/performance/PerformanceService.php?SERVICE_NAME=QueryProductService&CLASS_INSTANCE=ProductInfoManager&FUNCTION_NAME=queryProductInfo';
	return fetch(url).then(response => response.json())
		.then(productData => {
			const handledData = preHandleProductData(productData);
			dispatch(queryProductData(handledData));
		});
}

export function fetchProductDatas()
{
	return dispatch => {
		fetchProducts(dispatch);
	};
}