import React from "react";
import './BookingsControls.css';

const bookingsControl = props => {
    return (
        <div className="bookings-control">
            <button
                className={props.activeOutputType === 'list' ? 'active' : ''}
                onClick={props.onchange.bind(this, 'list')}>List
            </button>
            <button
                className={props.activeOutputType === 'chart' ? 'active' : ''}
                onClick={props.onchange.bind(this, 'chart')}>Chart
            </button>
        </div>
    );
}

export default bookingsControl;