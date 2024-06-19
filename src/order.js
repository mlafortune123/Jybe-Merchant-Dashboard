import React, { useState, useContext, useEffect } from 'react';
import { AccountContext } from './ProtectedRoute';
import { Link } from "react-router-dom";
import { Aside } from "./Aside.jsx"
import { Header } from './Header.jsx';

const Order = () => {
    const order_id = window.location.pathname.substring(7, 43)
    console.log(order_id)
    const context = useContext(AccountContext);
    const { orders, merchant, payments } = context
    const [order, setOrder] = useState()
    const [paymentId, setPaymentId] = useState()

    useEffect(() => {
        if (orders) {
            const order = orders.filter(order => order.order_id == order_id)[0]
            const settlement = payments.filter(payment => {
                console.log(payment.payment_date, order.created_at)
                return payment.payment_date.substring(0, 10) == order.created_at.substring(0, 10)
            })
            console.log(settlement)
            setOrder(order)
        }
    }, [orders, payments])

    return (
        <div className='ytop' >
                <Aside/>
                {order &&
                    <div className='inside-wrapper' >
                        <div style={{ background: 'white', padding: '24px', border: '1px solid lightgrey', borderRadius: '16px' }} >
                            <h2>Order PROFILE</h2>
                            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', marginTop: '16px' }} >
                                <div>
                                    <u>
                                        Billing Info
                                    </u>
                                    <div className='userdata-pair' >
                                        <p className='userdata-key'>
                                            Monthly Bill:&nbsp;
                                        </p>
                                        <p className='userdata-value' >
                                            ${order.jybe_cost / 100}
                                        </p>
                                    </div>
                                    <div className='userdata-pair' >
                                        <p className='userdata-key'>
                                            Amount Paid:&nbsp;
                                        </p>
                                        <p className='userdata-value' >
                                            ${order.amount_paid}
                                        </p>
                                    </div>
                                    <div className='userdata-pair' >
                                        <p className='userdata-key'>
                                            Status:&nbsp;
                                        </p>
                                        <p className='userdata-value' style={{ color: order.order_status == 'active' ? 'green' : 'red' }} >
                                            {order.order_status}
                                        </p>
                                    </div>
                                    <div className='userdata-pair' >
                                        <p className='userdata-key'>
                                            User Markup:&nbsp;
                                        </p>
                                        <p className='userdata-value' >
                                            {order.order_user_markup}% / ${order.amount * (order.order_user_markup/100)}
                                        </p>
                                    </div>
                                    <div className='userdata-pair' >
                                        <p className='userdata-key'>
                                            Merchant Markup:&nbsp;
                                        </p>
                                        <p className='userdata-value' >
                                            {order.order_merchant_markup}% / ${order.amount * (order.order_merchant_markup/100)}
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <u>User Info</u>
                                    <div className='userdata-pair' >
                                        <p className='userdata-key'>
                                            User ID:&nbsp;
                                        </p>
                                        <p className='userdata-value'>
                                            {order.user_id}
                                        </p>
                                    </div>
                                    <div className='userdata-pair' >
                                        <p className='userdata-key'>
                                            Zip Code:&nbsp;
                                        </p>
                                        <p className='userdata-value' >
                                            {order.zip}
                                        </p>
                                    </div>
                                    <div className='userdata-pair' >
                                        <p className='userdata-key'>
                                            Name:&nbsp;
                                        </p>
                                        <p className='userdata-value' >
                                            {order.first_name} {order.last_name}
                                        </p>
                                    </div>
                                    <div className='userdata-pair' >
                                        <p className='userdata-key'>
                                            Email:&nbsp;
                                        </p>
                                        <p className='userdata-value' >
                                            {order.email}
                                        </p>
                                    </div>
                                    <div className='userdata-pair' >
                                        <p className='userdata-key'>
                                            Phone:&nbsp;
                                        </p>
                                        <p className='userdata-value' >
                                            {order.phone}
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <u>Loan Info</u>
                                    <div className='userdata-pair' >
                                        <p className='userdata-key'>
                                            Original Annual Cost:&nbsp;
                                        </p>
                                        <p className='userdata-value' >
                                            ${order.og_amount}
                                        </p>
                                    </div>
                                    <div className='userdata-pair' >
                                        <p className='userdata-key'>
                                            Original Monthly Cost:&nbsp;
                                        </p>
                                        <p className='userdata-value' >
                                            ${order.og_monthly_cost}
                                        </p>
                                    </div>
                                    <div className='userdata-pair' >
                                        <p className='userdata-key'>
                                            After Markups:&nbsp;
                                        </p>
                                        <p className='userdata-value' >
                                            ${order.amount * (1-(order.order_merchant_markup/100))}
                                        </p>
                                    </div>
                                    <div className='userdata-pair' >
                                        <p className='userdata-key'>
                                            Settlement ID:&nbsp;
                                        </p>
                                        <p className='userdata-value' >
                                            {paymentId ? paymentId : 'Pending'}
                                        </p>
                                    </div>
                                    <div className='userdata-pair' >
                                        <p className='userdata-key'>
                                            Order ID:&nbsp;
                                        </p>
                                        <p className='userdata-value'>
                                            {order.order_id}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </div>
    )
}

export default Order