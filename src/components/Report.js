import React, { useEffect, useRef, useState } from 'react';
import LineChart from './LineChart';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretLeft, faCaretRight } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useUser } from './UserContext';

const Report = () => {
    const { userId } = useUser();

    const [chartData, setChartData] = useState([]);
    const [currentMonthIndex, setCurrentMonthIndex] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [viewType, setViewType] = useState('monthly');

    const selectRef = useRef(null); // Create a ref for the select element

    const monthNames = [
        '1月', '2月', '3月', '4月', '5月', '6月',
        '7月', '8月', '9月', '10月', '11月', '12月'
    ];

    const fetchChartData = async () => {
        const url = viewType === "monthly"
            ? `http://localhost:3001/get-report-by-month?userId=${userId}&month=${currentMonthIndex + 1}`
            : `http://localhost:3001/get-report-by-year?userId=${userId}&year=${currentYear}`;

        try {
            const response = await axios.get(url);
            setChartData(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchChartData();
    }, [currentMonthIndex, currentYear, viewType]);

    const handleMonthChange = (increment) => {
        setCurrentMonthIndex(prevIndex => (prevIndex + increment + 12) % 12);
    };

    const handleYearChange = (increment) => {
        setCurrentYear(prevYear => prevYear + increment);
    };

    const handleViewTypeChange = (e) => {
        setViewType(e.target.value);

        setCurrentMonthIndex(new Date().getMonth());    // Reset the current month index
        setCurrentYear(new Date().getFullYear());   // Reset the current year

        if (selectRef.current)
            selectRef.current.blur();
    };

    const currentMonth = monthNames[currentMonthIndex];

    return (
        <div className='container'>
            <div className='row mt-3'>
                <div className='col-9'>
                    <button 
                        type='button' 
                        className='btn btn-primary mx-2 mb-2' 
                        onClick={() => viewType === 'monthly' ? handleMonthChange(-1) : handleYearChange(-1)}
                        aria-label="Previous"
                    >
                        <FontAwesomeIcon icon={faCaretLeft} className='icon' />
                    </button>
                    
                    <h2 style={{ display : 'inline'}}>
                        {viewType === 'monthly' ? `${currentMonth}の支出` : `${currentYear}年の支出`}
                    </h2>
                    
                    <button 
                        type='button' 
                        className='btn btn-primary mx-2 mb-2' 
                        onClick={() => viewType === 'monthly' ? handleMonthChange(1) : handleYearChange(1)}
                        aria-label="Next"
                    >
                        <FontAwesomeIcon icon={faCaretRight} className='icon' />
                    </button>
                </div>
                <div className='col-3'>
                    <select 
                        className="form-select" 
                        aria-label="View type select"
                        onChange={handleViewTypeChange}
                        value={viewType}
                        ref={selectRef}
                    >
                        <option value="monthly">月ごとの支出</option>
                        <option value="yearly">年ごとの支出</option>
                    </select>
                </div>
            </div>
            <LineChart chartData={chartData} viewType={viewType} />
        </div>
    );
};

export default Report;
