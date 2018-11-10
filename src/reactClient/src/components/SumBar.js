import React, {
    Component
} from 'react';
import SumBarItem from "./SumBarItem";
import "../css/sumBar.css"

export default class SumBar extends Component {
    render() {
        const titles = this.props.titles;
        if(!titles)
        {
            return null;
        }
        return (
            <div className="sum-bar">
                {Object.values(titles).map(title =>
                    (
                        <SumBarItem key={title.name} itemName={title.name} itemValue={title.value}>
                        </SumBarItem>
                    )
                )}
            </div>
        );
    }
}
