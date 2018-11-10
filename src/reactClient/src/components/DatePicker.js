import React, {Component} from 'react';
import {Button, Glyphicon} from 'react-bootstrap';
import moment from 'moment';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import {DEFAULT_DATE_FORMAT} from '../constants/commonConstants';
import '../css/datepickerOrigin.css'
import '../css/datePicker.css'



export default class DatePicker extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            ranges: {
                'Today': [moment(), moment()],
                'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                'Last 7 Days': [moment().subtract(7, 'days'), moment().subtract(1, 'days')],
                'Last 30 Days': [moment().subtract(30, 'days'), moment().subtract(1, 'days')],
                'This Month': [moment().startOf('month'), moment().endOf('month')],
                'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
            },
            startDate: this.props.defaultStartDate,
            endDate: this.props.defaultEndDate
        };

        this.handleEvent = this.handleEvent.bind(this);
    }

    handleEvent(event, picker)
    {
        this.setState(
            {
                startDate: picker.startDate,
                endDate: picker.endDate,
            }
        );

        this.props.handleEvent(this.state.startDate, this.state.endDate);
    };

    render()
    {
        let start = this.state.startDate.format(DEFAULT_DATE_FORMAT);
        let end = this.state.endDate.format(DEFAULT_DATE_FORMAT);
        let label = start + ' - ' + end;
        if (start === end) {
            label = start;
        }
        return (
            <div className="date-picker-div">
                <DateRangePicker startDate={this.state.startDate} endDate={this.state.endDate} ranges={this.state.ranges} onEvent={this.handleEvent}>
                    <Button className="selected-date-range-btn" style={{width:'35%'}}>
                        <div className="pull-left"><Glyphicon glyph="calendar" /></div>
                        <div className="pull-right">
                            <span>
                                {label}
                            </span>
                        </div>
                    </Button>
                </DateRangePicker>
            </div>
        );
    }
}