import productReducer from './productReducers';
import accountReducer from './accountReducers';
import {
	combineReducers
} from 'redux';


const productReducerObject = productReducer();
const accountReducerObject = accountReducer();
const reducers = Object.assign({}, productReducerObject, accountReducerObject);

const allReducers = combineReducers(reducers);

export default allReducers;