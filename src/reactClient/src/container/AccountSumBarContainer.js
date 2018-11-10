import {connect} from 'react-redux';

import {getAccountSumBarInfo} from '../business/stateHelper';
import SumBar from '../components/SumBar';

const mapStateToProps = (state, ownProps) => {
    const barTitleList = getAccountSumBarInfo(state, ownProps.accountId);
    if (!barTitleList) {
        return {};
    }
    return {
        titles: barTitleList,
    };
};

const AccountSumBarContainer = connect(mapStateToProps)(SumBar);

export default AccountSumBarContainer;
