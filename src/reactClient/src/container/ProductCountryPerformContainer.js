import {connect} from 'react-redux';

import {getActCountryPerformance} from '../business/stateHelper';
import PerformanceTable from '../components/PerformanceTable';

const mapStateToProps = (state, ownProps) => {
    const performanceData = getActCountryPerformance(state, ownProps.accountId);
    if (!performanceData)
    {
        return {};
    }

    const dataArray = performanceData.data;
    if(!dataArray || dataArray.length === 0)
    {
        return {};
    }

    return {
        header: performanceData.title,
        rows: performanceData.data
    };
};

const ActCountryPerformanceContainer = connect(mapStateToProps)(PerformanceTable);

export default ActCountryPerformanceContainer;