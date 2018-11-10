import React, {Component} from 'react';
import {connect} from 'react-redux';
import AccountSumBarContainer from '../container/AccountSumBarContainer';
import ActCountryPerformanceContainer from '../container/ActCountryPerformanceContainer';
import ProductSumBarContainer from '../container/ProductSumBarContainer';
import DatePicker from '../components/DatePicker';
import {getCurrentAccountIds, getCurrentProduct} from '../business/stateHelper';
import {queryActPerformanceById, fetchAccountDatas} from '../actions/accountActions';
import {PRODUCT_ID} from '../constants/stateKeys';
import {DEFAULT_DATE_FORMAT} from '../constants/commonConstants';
import moment from 'moment';
import '../css/performanceContainer.css';

class PerformanceContainer extends Component
{
	constructor(props)
	{
		super(props);
		this.handlePickerEvent = this.handlePickerEvent.bind(this);
		this.defaultStartDate = moment();
		this.defaultEndDate = moment();
	}

    componentWillReceiveProps(nextProps)
	{
        if(this.props.productId !== nextProps.productId)
		{
            const {dispatch} = this.props;
            dispatch(fetchAccountDatas(nextProps.productId));
            dispatch(queryActPerformanceById(nextProps.productId, this.defaultStartDate.format(DEFAULT_DATE_FORMAT),
			this.defaultEndDate.format(DEFAULT_DATE_FORMAT)));
		}
	}

	handlePickerEvent(pickerStartDate, pickerEndDate)
	{
        const {dispatch} = this.props;
        this.defaultStartDate = pickerStartDate;
        this.defaultEndDate = pickerEndDate;

        let start = pickerStartDate.format(DEFAULT_DATE_FORMAT);
        let end = pickerEndDate.format(DEFAULT_DATE_FORMAT);
        dispatch(queryActPerformanceById(this.props.productId, start, end));
	}

	render()
	{
		const accountIds = this.props.accountIdList;
		if(!accountIds)
		{
			return null;
		}
		return (
			<div className="performance-container">
				<DatePicker handleEvent={this.handlePickerEvent} defaultStartDate={this.defaultStartDate}
							defaultEndDate={this.defaultEndDate}/>
				<ProductSumBarContainer/>
                {
                    accountIds.map(
                        id => (
                        	<div className="account-performance-div" key ={id}>
								<AccountSumBarContainer accountId={id} />
								<ActCountryPerformanceContainer accountId={id} />
							</div>
                        )
                    )
                }
			</div>
		);
	}

}


const mapStateToProps = state => {
	const product = getCurrentProduct(state);
	const accountIds = getCurrentAccountIds(state);
	if (!product && !accountIds)
	{
		return {};
	}
	else
	{
        return {
            productId: product[PRODUCT_ID],
            accountIdList: accountIds,
        };
	}

};

export default connect(mapStateToProps)(PerformanceContainer);