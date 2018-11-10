import {
	createStore,
	applyMiddleware
} from 'redux';
import thunkMiddleware from 'redux-thunk';
import {
	createLogger
} from 'redux-logger';
import allReducers from '../reducers/allReducers';

const loggerMiddleware = createLogger();

export default function configureStore(preloadedState) {
	return createStore(
		allReducers,
		preloadedState,
		applyMiddleware(thunkMiddleware, loggerMiddleware)
	);
}