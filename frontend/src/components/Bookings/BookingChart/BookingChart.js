import React from "react";
import { Bar as BarChart } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import './BookingChart.css';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const BOOKINGS_CRITERIA = {
    Cheap: {
        min: 0,
        max: 100
    },
    Normal: {
        min: 101,
        max: 200
    },
    Expensive: {
        min: 201,
        max: 10000000
    }
};

const bookingsChart = props => {
    const chartData = { labels: [], datasets: [] };
    let values = [];
    for (const interval in BOOKINGS_CRITERIA) {
        const filteredBookingsCount = props.bookings.reduce((prev, current) => {
            if (
                current.event.price > BOOKINGS_CRITERIA[interval].min &&
                current.event.price < BOOKINGS_CRITERIA[interval].max
            ) {
                return prev + 1;
            } else {
                return prev;
            }
        }, 0);

        values.push(filteredBookingsCount);
        chartData.labels.push(interval);
        chartData.datasets.push({
            label: interval.toString(),
            backgroundColor: 'rgb(28, 203, 212)',
            data: values
        });
        values = [...values];
        values[values.length - 1] = 0;
    }

    return (
        <div className="bar-chart">
            <BarChart data={chartData} />
        </div>
    );
};

export default bookingsChart;