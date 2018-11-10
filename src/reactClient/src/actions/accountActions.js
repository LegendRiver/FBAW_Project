import {
	ACCOUNT_ALL_IDS,
	ACCOUNT_DATAS
} from "../constants/stateKeys.js";
import fetch from 'isomorphic-fetch';

export const QUERY_ACCOUNTS = 'QUERY_ACCOUNTS';
export const QUERY_ACT_COUNTRY_PERFORMANCE = 'QUERY_ACT_COUNTRY_PERFORMANCE';


function queryAccounts(accounts) {
	return {
		type: QUERY_ACCOUNTS,
		data: accounts,
		updateTime: Date.now()
	};
}

function queryActCountryPerformance(performanceData) {
	return {
		type: QUERY_ACT_COUNTRY_PERFORMANCE,
		data: performanceData,
		updateTime: Date.now()
	};
}

function prehandleAccountData(queryData) {
	let accountDatas = queryData[ACCOUNT_DATAS];
	let accountIds = Object.keys(accountDatas);

	let accounts = {};
	Object.assign(accounts, queryData);
	accounts[ACCOUNT_ALL_IDS] = accountIds;
	return accounts;
}

function fetchAccounts(dispatch, productId) {
    let url = 'http://52.42.202.255:8050/performance/PerformanceService.php?SERVICE_NAME=QueryAccountBalanceService&CLASS_INSTANCE=AccountInfoManager&FUNCTION_NAME=queryActBasicInfo';
    url += '&PRODUCT_ID=';
    url += productId;
    return fetch(url).then(response => response.json())
		.then(accountData => {
        	const handledData = prehandleAccountData(accountData);
        	dispatch(queryAccounts(handledData));
    	});
}

function fetchActPerformanceById(dispatch, productId, startDate, endDate)
{
	if(!productId)
	{
		return null;
	}
	let url = 'http://52.42.202.255:8050/performance/PerformanceService.php?SERVICE_NAME=QueryAccountBalanceService&CLASS_INSTANCE=AccountInfoManager&FUNCTION_NAME=queryCountryPerformance';
	url += '&PRODUCT_ID=';
	url += productId;
	url += '&START_DATE=';
	url += startDate;
	url += '&END_DATE=';
	url += endDate;
	return fetch(url).then(response => response.json()).then(performanceData => dispatch(queryActCountryPerformance(performanceData)));
}


export function fetchAccountDatas(productId) {
	return dispatch => {
		fetchAccounts(dispatch, productId);
	};
}

export function queryActPerformanceById(productId, startDate, endDate) {
	return dispatch => {
		fetchActPerformanceById(dispatch, productId, startDate, endDate);
	};
}