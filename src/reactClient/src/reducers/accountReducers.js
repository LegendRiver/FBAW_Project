import {
	QUERY_ACCOUNTS,
	QUERY_ACT_COUNTRY_PERFORMANCE
} from '../actions/accountActions';

function queryAccounts(state = {}, action) {
	switch (action.type) {
		case QUERY_ACCOUNTS:
			return Object.assign({}, state, action.data, {
				updateTime: action.updateTime
			});
		default:
			return state;
	}
}

function queryActPerformance(state = {}, action) {
	switch (action.type) {
		case QUERY_ACT_COUNTRY_PERFORMANCE:
			return Object.assign({}, state, action.data, {
				updateTime: action.updateTime
			});
		default:
			return state;
	}
}

const accountReducer = () => ({
	accounts: queryAccounts,
    accountCountryPerform: queryActPerformance
});

export default accountReducer;