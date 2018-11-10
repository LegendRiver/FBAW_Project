import React, {
	Component
} from 'react';
import {
	Provider
} from 'react-redux';
import configureStore from '../store/configureStore';
import EliApp from '../components/EliApp';

const store = configureStore();

export default class Root extends Component {
	render() {
		return (
			<Provider store={store}>
               <EliApp></EliApp>
			</Provider>
		);
	}
}