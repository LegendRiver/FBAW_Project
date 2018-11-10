import {
	PRODUCT_DATAS,
	ACCOUNT_DATAS,
	ACCOUNT_TITLE,
	PRODUCT_ALL_IDS,
	PRODUCT_NAME,
	PRODUCT_ADV_NAME,
	PRODUCT_ACTLIST,
	ACT_COUNTRY_PERFORMANCE_VALUE,
	ACT_COUNTRY_PERFORMANCE_TITLE
} from '../constants/stateKeys';

export function getActCountryPerformance(state, accountId)
{
    const performanceTitle = getAccountCountryPerformTitle(state);
	const countryPerformanceData = getAccountCountryPerformData(state, accountId);
	if(!countryPerformanceData)
    {
        return null;
    }

	return {
		title: performanceTitle,
		data: countryPerformanceData
	};
}

export function getAccountSumBarInfo(state, accountId)
{
    const accountTitle = getAccountInfoTitle(state);
    const accountInfo = getAccountInfoValue(state, accountId);

    if(!accountInfo)
	{
		return null;
	}
    const accountName = accountInfo[1];
    const mediaAccountId = accountInfo[0];

    let barTitleList = [];
    let barHeader = {
    	name: accountName,
		value: mediaAccountId,
	};
	barTitleList.push(barHeader);

    for(let i=2; i<accountInfo.length; ++i)
	{
		let barTitle = {
			name: accountTitle[i],
			value: accountInfo[i]
		};
		barTitleList.push(barTitle);
	}

	return barTitleList;
}

function getAccountInfoTitle(state)
{
    const {accounts} = state;
    return accounts[ACCOUNT_TITLE];
}

function getAccountInfoValue(state, accountId)
{
    const {accounts} = state;
    const accountDatas = accounts[ACCOUNT_DATAS];
    if (!accountDatas)
    {
        return null;
    }
    return accountDatas[accountId];
}

export function getCurrentAccountIds(state) {
	const currentProduct = getCurrentProduct(state);
	if (!currentProduct) {
		return null;
	}
	const accountIds = currentProduct[PRODUCT_ACTLIST];
	if (!accountIds) {
		return null;
	}

	return accountIds;
}

export function getCurrentProduct(state) {
	const {
		selectedProduct,
		products
	} = state;

	const productDatas = products[PRODUCT_DATAS];
	if (!productDatas) {
		return null;
	}
	let currentProuct = null;
	if (!selectedProduct) {
		const productIds = products[PRODUCT_ALL_IDS];
		if (!productIds || products.length === 0) {
			return null;
		}
		const firstId = productIds[0];
		currentProuct = productDatas[firstId];
	} else {
		currentProuct = productDatas[selectedProduct];
	}

	return currentProuct;
}

export function getProductSumBarTitle(state)
{
	const currentProduct = getCurrentProduct(state);
	const productName = currentProduct[PRODUCT_NAME];
	const advertiserName = currentProduct[PRODUCT_ADV_NAME];

	const accountList = currentProduct[PRODUCT_ACTLIST];
	const productSumInfo = getSumInfoByAccountList(state, accountList);
	if(!productSumInfo)
	{
		return null;
	}

	const productFirstInfo = {
		name: productName,
		value: advertiserName
	};

	productSumInfo.unshift(productFirstInfo);

	return productSumInfo;
}

function getSumInfoByAccountList(state,accountList)
{
	if(!accountList || accountList.length === 0)
	{
		return null;
	}

	let sumCap = 0;
	let sumSpend = 0;
	const accountInfoTitle = getAccountInfoTitle(state);
	if(!accountInfoTitle || accountInfoTitle.length === 0)
    {
        return null;
    }
	const capIndex = 3;
	const spendIndex = 4;
	for(let i=0; i < accountList.length; ++i)
	{
		const accountId = accountList[i];
		const accountInfoValue= getAccountInfoValue(state, accountId);
		if(!accountInfoValue)
        {
            continue;
        }
		sumCap += accountInfoValue[capIndex];
		sumSpend += accountInfoValue[spendIndex];
	}

	let productSumInfo = [];
	const capInfo = {
		name: accountInfoTitle[capIndex],
		value: sumCap.toFixed(2)
	};
	productSumInfo.push(capInfo);

	const spendInfo = {
		name: accountInfoTitle[spendIndex],
		value: sumSpend.toFixed(2)
	};
	productSumInfo.push(spendInfo);

	return productSumInfo;
}

export function getProductCountryPerformData(state)
{
    const currentProduct = getCurrentProduct(state);
    const accountList = currentProduct[PRODUCT_ACTLIST];

}

function getAccountCountryPerformTitle(state)
{
    const {accountCountryPerform} = state;
    return accountCountryPerform[ACT_COUNTRY_PERFORMANCE_TITLE];
}

function getAccountCountryPerformData(state, accountId)
{
    const {accountCountryPerform} = state;
    const performanceDatas = accountCountryPerform[ACT_COUNTRY_PERFORMANCE_VALUE];
    if (!performanceDatas)
    {
        return null;
    }
    return performanceDatas[accountId];
}

function getProductCountryDataSum(state, accountList)
{
    if(!accountList || accountList.length === 0)
    {
        return null;
    }

    const accountPerformTitle = getAccountCountryPerformTitle(state);
    if(!accountPerformTitle || accountPerformTitle.length === 0)
    {
        return null;
    }
    let countryDataMap = new Map();
    for(let i=0; i<accountList.length; ++i)
    {
        const accountId = accountList[i];

    }
}