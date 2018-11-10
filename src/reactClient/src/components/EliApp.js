import React from 'react';
import NavContainer from '../container/NavContainer';

import PerformanceContainer from '../container/PerformanceContainer';
import '../css/eliApp.css';

const EliApp = () => {
	return (
		<div className="eliapp-container">
    		<NavContainer/>
			<PerformanceContainer/>
    	</div>
	);
};

export default EliApp;