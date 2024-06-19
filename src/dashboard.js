import React, { useState, useContext, useEffect } from 'react';
import { AccountContext } from './ProtectedRoute';
import toast, { Toaster } from 'react-hot-toast';
import wallet from "./images/Wallet.svg";
import { Aside } from "./Aside.jsx"
import { Header } from './Header.jsx';
import calender from "./images/Calendar.svg";
import payments from "./images/payments.svg"
import piggy from "./images/piggy.svg"
import traffic from "./images/traffic.svg"
import markups from "./images/markups.svg"
import approval from "./images/approval.svg"
// import { AgGridReact } from 'ag-grid-react'; // React Data Grid Component
// import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
// import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the grid

const Dashboard = () => {
    const context = useContext(AccountContext);
    const { orders, merchant, user, accessToken } = context
    const [totalTabBalance, setTotalTabBalance] = useState()
    const [approvalRate, setApprovalRate] = useState()

    function getGradientColor(percentage) {
        // Ensure percentage is within the range of 0 to 100
        percentage = Math.max(0, Math.min(percentage, 100));
    
        // Adjust the range for a darker gradient
        const red = Math.round((200 * (100 - percentage)) / 100);
        const green = Math.round((100 * percentage) / 100);
        const blue = 0; // No blue component in the gradient
    
        return `rgb(${red}, ${green}, ${blue})`;
    }

    // Function to set the color of an element based on the percentage
    function setGradientColor(elementId, percentage) {
        const color = getGradientColor(percentage);
        document.getElementById(elementId).style.color = color;
    }

    useEffect(() => {
        if (orders) {
            console.log(orders)
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

    return (
        <div className='rainbow' >
            <Aside/>
            {merchant && merchant.daily_tab && orders &&
                <div className='inside-wrapper'>
                    <div style={{ background: 'rgba(255, 255, 255, 0.5)', padding: '24px', border: '1px solid lightgrey', borderRadius: '16px' }} >
                        Welcome to your dashboard! Here you can see all the essential info of your Jybe integration
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} >
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px' }} >
                            <div className='dashboard-card'>
                                <div class="img-wrapper">
                                    <img className="ma-img" src={calender} alt="" />
                                </div>
                                <div class="rt-content">
                                    <p className='title'># of Subscriptions</p>
                                    <p className='big-value' >{orders.length}</p>
                                </div>
                            </div>
                            <div className='dashboard-card'>
                                <div class="img-wrapper">
                                    <img className="ma-img" src={piggy} alt="" />
                                </div>
                                <div class="rt-content">
                                    <p className='title'>Total Tab Balance</p>
                                    <p className='big-value'>${parseFloat(merchant.total_tab).toFixed(2)}</p>
                                </div>
                            </div>
                            <div className='dashboard-card'>
                                <div class="img-wrapper">
                                    <img className="ma-img" src={traffic} alt="" />
                                </div>
                                <div class="rt-content">
                                    <p className='title'>Status</p>
                                    <p className='big-value' style={{ color: merchant.merchant_status == 'Active' ? 'green' : 'red' }}  >{merchant.merchant_status}</p>
                                </div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px' }} >
                            <div className='dashboard-card'>
                                <div class="img-wrapper">
                                    <img className="ma-img" src={approval} alt="" />
                                </div>
                                <div class="rt-content">
                                    <p className='title'>Approval Rate</p>
                                    <p className='big-value' id='approval' >{approvalRate}%</p>
                                </div>
                            </div>
                            <div className='dashboard-card'>
                                <div class="img-wrapper">
                                    <img className="ma-img" src={payments} alt="" />
                                </div>
                                <div class="rt-content">
                                    <p className='title'>Pending Balance</p>
                                    <p className='big-value'>${parseFloat(merchant.daily_tab).toFixed(2)}</p>
                                </div>
                            </div>
                            <div className='dashboard-card'>
                                <div class="img-wrapper">
                                    <img className="ma-img" src={markups} alt="" />
                                </div>
                                <div class="rt-content">
                                    <p className='title'>Markups</p>
                                    <p className='big-value' style={{ fontSize: '16px' }} >User: {merchant.user_markup}% <br /> Merchant: {merchant.merchant_markup}%</p>
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