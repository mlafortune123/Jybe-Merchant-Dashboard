import React, { useState, useContext, useEffect } from 'react';
import { AccountContext } from './ProtectedRoute';
import { Link } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast';
import wallet from "./images/Wallet.svg";
import { Aside } from "./Aside.jsx"
import { Tooltip as ReactTooltip } from 'react-tooltip'
import calender from "./images/Calendar.svg";
import payments from "./images/payments.svg"
import piggy from "./images/piggy.svg"
import traffic from "./images/traffic.svg"
import markups from "./images/markups.svg"
import approval from "./images/approval.svg"
import settlement from "./images/settlement.svg"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { add, format, differenceInCalendarDays, isFuture } from "date-fns";
import moment from 'moment';
// import { AgGridReact } from 'ag-grid-react'; // React Data Grid Component
// import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
// import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the grid

const Dashboard = () => {
    const context = useContext(AccountContext);
    const { orders, merchant, user, accessToken, frozen } = context
    const [totalTabBalance, setTotalTabBalance] = useState()
    const [approvalRate, setApprovalRate] = useState()
    const [chartData, setChartData] = useState()
    const [filledData, setFilledData] = useState()
    const [domain, setDomain] = useState()
    const [ticks, setTicks] = useState()
    const [dateFilter, setDateFilter] = useState('All Time');

    function getGradientColor(percentage) {
        percentage = Math.max(0, Math.min(percentage, 100));
        const red = Math.round((200 * (100 - percentage)) / 100);
        const green = Math.round((100 * percentage) / 100);
        const blue = 0; // No blue component in the gradient
        return `rgb(${red}, ${green}, ${blue})`;
    }

    function setGradientColor(elementId, percentage) {
        const color = getGradientColor(percentage);
        const doc = document.getElementById(elementId)
        if (doc) doc.style.color = color;
    }

    const filterOrdersByDate = (orders, filter) => {
        const now = new Date();
        let filteredOrders = [];

        switch (filter) {
            case 'All Time':
                filteredOrders = orders
                break;
            case 'week':
                filteredOrders = orders.filter(order => {
                    const orderDate = new Date(order.created_at);
                    const diffTime = Math.abs(now - orderDate);
                    const diffDays = diffTime / (1000 * 60 * 60 * 24);

                    return diffDays <= 7;
                });
                break;
            case '30 days':
                filteredOrders = orders.filter(order => {
                    const orderDate = new Date(order.created_at);
                    const diffTime = Math.abs(now - orderDate);
                    const diffDays = diffTime / (1000 * 60 * 60 * 24);

                    return diffDays <= 30;
                });
                break;
            case '90 days':
                filteredOrders = orders.filter(order => {
                    const orderDate = new Date(order.created_at);
                    const diffTime = Math.abs(now - orderDate);
                    const diffDays = diffTime / (1000 * 60 * 60 * 24);

                    return diffDays <= 90;
                });
                break;
            case 'year':
                filteredOrders = orders.filter(order => {
                    const orderDate = new Date(order.created_at);
                    const diffTime = Math.abs(now - orderDate);
                    const diffDays = diffTime / (1000 * 60 * 60 * 24);

                    return diffDays <= 365;
                });
                break;
            default:
                filteredOrders = orders;
        }
        return filteredOrders;
    };

    useEffect(() => {
        if (orders) {
            const activeOrders = orders.filter(order => order.order_status == 'active')
            const filteredOrders = filterOrdersByDate(activeOrders, dateFilter);
            setChartData(filteredOrders);
        }
    }, [orders, dateFilter])

    useEffect(() => {
        if (orders) {
            const totalTabBalance = orders.reduce((a, b) => {
                return a + b.amount
            }, 0)
            const passedCount = orders.reduce((count, order) => {
                return count + (order.passed ? 1 : 0);
            }, 0);
            const approvalRate = ((passedCount / orders.length) * 100).toFixed(2)
            setTotalTabBalance(totalTabBalance)
            setApprovalRate(approvalRate)
            setGradientColor('approval', approvalRate)
        }
    }, [orders])

    const getTicks = (startDate, endDate, num) => {
        const diffDays = differenceInCalendarDays(endDate, startDate);
        let current = startDate,
            velocity = Math.round(diffDays / (num - 1));
        const ticks = [startDate.getTime()];
        for (let i = 1; i < num - 1; i++) {
            ticks.push(add(current, { days: i * velocity }).getTime());
        }
        ticks.push(endDate.getTime());
        return ticks;
    };

    const fillTicksData = (_ticks, data, endDate) => {
        const ticks = [..._ticks];
        const filled = [];
        let activeSubscriptions = 0;
        let subsTotal = 0
        let lastTimestamp = 0;
        for (const item of data) {
            if (item.created_at < lastTimestamp) {
                continue;
            }
            else lastTimestamp = item.created_at;
            if (item.order_status == 'active') {
                activeSubscriptions++
                subsTotal += item.amount
                filled.push({ created_at: item.created_at, active_subscriptions: activeSubscriptions, subsTotal, subAmount: item.amount });
            }
            else filled.push({ created_at: item.created_at, active_subscriptions: activeSubscriptions, subsTotal });
        }
        if (ticks.length) {
            filled.push({ created_at: endDate, active_subscriptions: activeSubscriptions, subsTotal });
        }
        return filled;
    };

    useEffect(() => {
        if (chartData != undefined && chartData.length > 0) {
            const sortedOrders = chartData.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
            const startDate = new Date(sortedOrders[0].created_at)
            const endDate = new Date();
            const domain = [startDate, endDate];
            const ticks = getTicks(startDate, endDate, sortedOrders.length);
            const filledData = fillTicksData(ticks, sortedOrders, endDate);
            filledData.forEach(d => {
                d.created_at = moment(d.created_at).valueOf(); // date -> epoch
            })
            setTicks(ticks)
            setDomain(domain)
            setFilledData(filledData)
        }
        else {
            setTicks()
            setDomain()
            setFilledData() 
        }
        console.log(filledData)
    }, [chartData])

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload[0]) {
            console.log(payload)
            if (payload[0].payload.subAmount) {
                return (
                    <div style={{ background: 'white', color: 'black', padding: '10px', borderRadius: '10px' }} className="custom-tooltip">
                        <p className="label">{`${moment(label).format("MM-DD")}`}</p>
                        <p>New subscription worth ${payload[0].payload.subAmount} added!</p>
                        {/* <p className="intro">{`${payload[0].payload.active_subscriptions} subscriptions added`}</p> */}
                        {/* <p className="desc">Revenue: ${payload[1].value}</p> */}
                    </div>
                );
            }
        }
        return null;
    };

    return (
        <div className='flex-fullscreen rainbow' >
            <Aside />
            {merchant && merchant.pending_tab && orders &&
                <div style={{padding:'2vh 16px', width: 'calc(100vw - 200px)' }} >
                    <div className='space-between'>
                    <h2 className='page-title'>Key Performance Indicators</h2>
                    <div className='dashboard-card' style={{ flex: 'none' }}>
                        <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}>
                            <option value="week">Week</option>
                            <option value="30 days">30 Days</option>
                            <option value="90 days">90 Days</option>
                            <option value="year">Year</option>
                            <option value="All Time">All Time</option>
                        </select>
                    </div>
                </div><div className='inside-wrapper' style={{ gap: '3vh', padding:'0px', paddingTop:'2vh' }}>
                        <div className='cards-wrapper'>
                            <div className='space-between' style={{ gap: '16px', marginTop: '6px' }}>
                                <Link to="/subscriptions" className='dashboard-card'>
                                    <div class="rt-content">
                                        <div class="img-wrapper">
                                            <img className="ma-img" src={calender} alt="" />
                                            <h2 className='title'>Subscriptions</h2>
                                        </div>
                                        {(filledData && domain && ticks) ?
                                            <ResponsiveContainer height={window.screen.height * 0.35}>
                                                <LineChart style={{ marginLeft: '-20px' }} data={filledData}>
                                                    <XAxis
                                                        dataKey={"created_at"}
                                                        hasTick
                                                        scale="time"
                                                        tickFormatter={date => format(new Date(date), "dd/MMM")}
                                                        type="number"
                                                        domain={domain}
                                                        ticks={ticks}
                                                        stroke='grey' />
                                                    <YAxis />
                                                    <Tooltip content={<CustomTooltip />} />
                                                    <Line
                                                        type="monotone"
                                                        dataKey="active_subscriptions"
                                                        stroke="grey"
                                                        strokeWidth={2} />
                                                </LineChart>
                                            </ResponsiveContainer>
                                            :
                                            <div>
                                                No subscriptions to view
                                            </div>}
                                    </div>
                                </Link>
                                <Link to="/settlements" className='dashboard-card'>
                                    <div class="rt-content">
                                        <div class="img-wrapper">
                                            <img className="ma-img" src={settlement} alt="" />
                                            <h2 className='title'>Total Settlements</h2>
                                        </div>
                                        {(filledData && domain && ticks) ?
                                            <ResponsiveContainer height={window.screen.height * 0.35}>
                                                <LineChart
                                                    data={filledData}
                                                    margin={{
                                                        top: 5,
                                                        left: -10,
                                                        bottom: 5,
                                                    }}
                                                >
                                                    <XAxis
                                                        dataKey={"created_at"}
                                                        hasTick
                                                        scale="time"
                                                        tickFormatter={date => format(new Date(date), "dd/MMM")}
                                                        type="number"
                                                        domain={domain}
                                                        ticks={ticks}
                                                        stroke='grey' />
                                                    <YAxis tickFormatter={(value) => `$${value}`} />
                                                    <Tooltip content={<CustomTooltip />} />
                                                    <Line
                                                        type="monotone"
                                                        dataKey="subsTotal"
                                                        stroke="grey"
                                                        strokeWidth={2} />
                                                </LineChart>
                                            </ResponsiveContainer>
                                            :
                                            <div>
                                                No subscriptions to view
                                            </div>}
                                    </div>
                                </Link>
                            </div>
                            <div className='space-between' style={{ gap: '16px' }}>
                                <div className='dashboard-card'>
                                    <div class="img-wrapper">
                                        <img className="ma-img eighty" src={approval} alt="" />
                                    </div>
                                    <div class="rt-content">
                                        <p className='title'>Approval Rate</p>
                                        <p className='big-value' id='approval'>{approvalRate}%</p>
                                    </div>
                                </div>
                                <div className='dashboard-card'>
                                    <div class="img-wrapper">
                                        <img className="ma-img eighty" src={traffic} alt="" />
                                    </div>
                                    <div class="rt-content">
                                        <p className='title'>Your Status / Jybe's Status</p>
                                        <div style={{ display: 'flex', fontSize: '24px' }}>
                                            <p className='big-value' style={{ color: merchant.merchant_status == 'Active' ? 'green' : 'red' }}>{merchant.merchant_status}</p>&nbsp;/&nbsp;{frozen != undefined && <p className='big-value' style={{ color: !frozen ? 'green' : 'red' }}>{frozen ? "Down" : "Active"}</p>}
                                        </div>
                                    </div>
                                </div>
                                <div className='dashboard-card'>
                                    <div class="img-wrapper">
                                        <img className="ma-img eighty" src={payments} alt="" />
                                    </div>
                                    <div class="rt-content">
                                        <p className='title'>Your next payment will be</p>
                                        <p className='big-value'>${parseFloat(merchant.pending_tab).toFixed(2)}</p>
                                    </div>
                                </div>
                                <div className='dashboard-card'>
                                    <div class="img-wrapper">
                                        <img className="ma-img eighty" src={markups} alt="" />
                                    </div>
                                    <div data-tooltip-id="my-tooltip" class="rt-content">
                                        <p className='title'>Markups</p>
                                        <p className='big-value' style={{ fontSize: '16px' }}>User: {merchant.user_markup}% <br /> Merchant: {merchant.merchant_markup}%</p>
                                        <ReactTooltip id="my-tooltip" style={{ width: '50vh' }}>
                                            Let's explain markups. Say you have a $100 annual subscription. With a 10% merchant markup we would pay you 90% of that, and with a 5% user markup the user would pay us 105% of the original value over 12 months.
                                        </ReactTooltip>
                                    </div>
                                </div>
                            </div>
                            <div className='space-between' style={{ gap: '16px' }}>
                                <div className='dashboard-card'>
                                    <div class="img-wrapper">
                                        <img className="ma-img eighty" src={calender} alt="" />
                                    </div>
                                    <div class="rt-content">
                                        <p className='title'>Total # of Subscriptions</p>
                                        <p className='big-value'>{orders.length}</p>
                                    </div>
                                </div>
                                <div className='dashboard-card'>
                                    <div class="img-wrapper">
                                        <img className="ma-img eighty" src={calender} alt="" />
                                    </div>
                                    <div class="rt-content">
                                        <p className='title'> Active Subscriptions </p>
                                        <p className='big-value'>{chartData && chartData.length}</p>
                                    </div>
                                </div>
                                <div className='dashboard-card'>
                                    <div class="img-wrapper">
                                        <img className="ma-img eighty" src={calender} alt="" />
                                    </div>
                                    <div class="rt-content">
                                        <p className='title'>Total Value of Subscriptions</p>
                                        <p className='big-value'>${orders.reduce((a, b) => {
                                            return a + parseFloat(b.amount)
                                        }, 0)}</p>
                                    </div>
                                </div>
                                <div className='dashboard-card'>
                                    <div class="img-wrapper">
                                        <img className="ma-img eighty" src={calender} alt="" />
                                    </div>
                                    <div class="rt-content">
                                        <p className='title'>Value of Active Subscriptions </p>
                                        <p className='big-value'>${chartData && chartData.reduce((a, b) => {
                                            return a + parseFloat(b.amount)
                                        }, 0)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

export default Dashboard