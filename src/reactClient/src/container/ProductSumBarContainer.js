import {connect} from 'react-redux';

import {getProductSumBarTitle} from '../business/stateHelper';
import SumBar from '../components/SumBar';

const mapStateToProps = (state) => {
    const barTitleList = getProductSumBarTitle(state);
    if (!barTitleList)
    {
        return {};
    }
    return {
        titles: barTitleList,
    };
};

const ProductSumBarContainer = connect(mapStateToProps)(SumBar);

export default ProductSumBarContainer;
