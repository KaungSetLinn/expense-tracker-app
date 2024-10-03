import React, { useEffect, useState } from "react";
import BarChart from "./BarChart";
import PieChart from "./PieChart";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartPie, faCirclePlus, faTableList } from "@fortawesome/free-solid-svg-icons";
import { Link } from 'react-router-dom';
import axios from "axios";
import ApexChart from "./ApexChart";
import { useUser } from "./UserContext";

const Dashboard = () => {
    const [weekExpense, setWeekExpense] = useState(0);
    const [monthExpense, setMonthExpense] = useState(0);
    const [totalExpense, setTotalExpense] = useState(0);
    const [chartData, setChartData] = useState([]);

    const { userId } = useUser();

    const fetchChartData = () => {
        axios.get(`http://localhost:3001/get_overall_expenses?userId=${userId}`)
            .then(response => {
                console.log(userId)
                // console.log(response.data);
                setChartData(response.data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    };

    const fetchThisWeekTotalExpense = () => {
        axios.get(`http://localhost:3001/expenses/this-week-total?userId=${userId}`)
            .then(res => {
                const weekExpense = res.data[0].week_expense; // Assuming res.data is an array with a single object
                setWeekExpense(weekExpense);
                // console.log(weekExpense)
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    };

    const fetchThisMonthTotalExpense = () => {
        axios.get(`http://localhost:3001/expenses/this-month-total?userId=${userId}`)
            .then(res => {
                const monthExpense = res.data[0].month_expense; // Assuming res.data is an array with a single object
                setMonthExpense(monthExpense);
                // console.log(monthExpense)
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    };

    const fetchTotalExpense = () => {
        axios.get(`http://localhost:3001/expenses/total?userId=${userId}`)
            .then(res => {
                const totalExpense = res.data[0].total_expense; // Assuming res.data is an array with a single object
                setTotalExpense(totalExpense);
                // console.log(totalExpense)
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    };
    

    useEffect(() => {
        fetchChartData();
        fetchThisWeekTotalExpense();
        fetchThisMonthTotalExpense();
        fetchTotalExpense();
    }, []);

    return (
        <div className="container mt-2">
            <div className="row">

                {/* Section to show about this week, this month and total expenses */}
                <div className="col-md-4 mb-3">
                    <div className="card text-bg-light">
                        <div className="card-body">
                            <div style={{ fontWeight: 'bold', fontSize : 'larger' }} className="mb-1">今週の支出</div>
                            <div>￥{weekExpense ? weekExpense.toLocaleString() : 0}</div>
                        </div>
                    </div>
                </div>
                <div className="col-md-4 mb-3">
                    <div className="card text-bg-light">
                        <div className="card-body">
                            <div style={{ fontWeight: 'bold', fontSize : 'larger' }} className="mb-1">今月の支出</div>
                            <div>￥{monthExpense ? monthExpense.toLocaleString() : 0}</div>
                        </div>
                    </div>
                </div>
                <div className="col-md-4 mb-3">
                    <div className="card text-bg-light">
                        <div className="card-body">
                            <div style={{ fontWeight: 'bold', fontSize : 'larger' }} className="mb-1">総支出</div>
                            <div>￥{totalExpense ? totalExpense.toLocaleString() : 0}</div>
                        </div>
                    </div>
                </div>
                {/* Section to show about this week, this month and total expenses */}

                <div className="col-md-4 mb-3">
                    <div className="card text-bg-light">
                        <div className="card-body">
                            <Link to="/expense" style={{ textDecoration: 'none' }}>
                                <FontAwesomeIcon icon={faCirclePlus} size="3x" className="text-success" />
                                <p className="card-text mt-2 text-dark">支出を追加する</p>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="col-md-4 mb-3">
                    <div className="card text-bg-light">
                        <div className="card-body">
                        <Link to="/transaction" style={{ textDecoration: 'none' }}>
                            <FontAwesomeIcon icon={faTableList} size="3x" className="text-primary" />
                            <p className="card-text mt-2 text-dark">支出一覧</p>
                        </Link>
                        </div>
                    </div>
                </div>
                <div className="col-md-4 mb-3">
                    <div className="card text-bg-light">
                        <div className="card-body">
                        <Link to="/report" style={{ textDecoration: 'none' }}>
                            <FontAwesomeIcon icon={faChartPie} size="3x" className="text-info" />
                            <p className="card-text mt-2 text-dark">支出の分布</p>
                        </Link>
                        </div>
                    </div>
                </div>

                <div className="col-md-7">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title fw-bolder">全体の支出</h5>
                            {chartData.length > 0 ? <BarChart chartData={chartData} /> : <div>データなし</div>}
                            
                        </div>
                    </div>
                </div>

                <div className="col-md-5">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title fw-bolder">全体の支出</h5>
                            {chartData.length > 0 ? <PieChart chartData={chartData} /> : <div>データなし</div>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
