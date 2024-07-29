import React, { useState, useContext, useEffect } from 'react';
import { AccountContext } from './ProtectedRoute';
import { Link } from "react-router-dom";
import { Aside } from "./Aside.jsx"
import orderimg from './images/order.svg'

const Order = () => {
    const order_id = window.location.pathname.substring(7, 43)
    const context = useContext(AccountContext);
    const { orders, payments, accessToken, API_URL } = context
    const [order, setOrder] = useState()
    const [paymentId, setPaymentId] = useState()

    useEffect(() => {
        if (orders) {
            const order = orders.filter(order => order.order_id == order_id)[0]
            const settlements = payments.filter(payment => {
                return payment.payment_date.substring(0, 10) == order.order_created_at.substring(0, 10)
            })
            settlements.length > 0 && setPaymentId(settlements[0].payment_id)
            setOrder(order)
        }
    }, [orders, payments])

    const refund = () => {
        fetch(`${API_URL}/refund`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({ order_id })
        })
    }

    return (
        <div className='flex-fullscreen subs' >
            <Aside />
            {order &&
                <div className='inside-wrapper' >
                    <div className='order' >
                        <div style={{display: 'flex', fontSize: '36px', justifyContent: 'space-between' }} >
                            <div>
                            <div>
                            <img className='ma-img' src={orderimg} style={{marginRight:'8px', height:'36px', width:'auto' }} />
                            {order.product_name} for {order.first_name} {order.last_name} 
                            {paymentId && order.order_status != 'inactive' && <Link to={`/settlement/${paymentId}`} className='green-button' >
                                Settled
                            </Link>}</div>
                            </div>
                            {order.order_status == 'active' && <a onClick={refund} style={{background: '#B0194A', padding: '8px 16px', borderRadius: '16px'}} >
                                Refund
                            </a>}
                            </div>
                            {order.order_merchant_markup == 0 ? <p className='heavy'>${order.amount} Original Amount</p> : <p className='heavy'>${order.amount} Original Amount / ${(order.amount * (1 - (order.order_merchant_markup / 100))).toFixed(2)} After markups </p>}
                        <div style={{ background: 'grey', height: '2px', width: '100%', margin: '10px 0px' }} />
                        <h2 className='page-title' >Subscription Info</h2>
                        <div className='summary-wrapper' >
                            <div style={{ width: '40%' }} >
                                <div className='userdata-pair' >
                                    <p className='userdata-key'>
                                        Status:&nbsp;
                                    </p>
                                    <span className='userdata-divider'></span>
                                    <p className='userdata-value' style={{ color: order.order_status == 'active' ? 'green' : '#B0194A' }} >
                                        {order.order_status}
                                    </p>
                                </div>
                                <div className='userdata-pair' >
                                    <p className='userdata-key'>
                                        Customer Paid:&nbsp;
                                    </p>
                                    <span className='userdata-divider'></span>
                                    <p className='userdata-value' >
                                        ${order.amount_paid.toFixed(2)}
                                    </p>
                                </div>
                            </div>
                            <div style={{ width: '40%' }} >
                                <div className='userdata-pair'>
                                    <p className='userdata-key'>Date:</p>
                                    <span className='userdata-divider'></span>
                                    <p className='userdata-value'>{order.order_created_at.substring(0, 10)}</p>
                                </div>
                                <div className='userdata-pair'>
                                    <p className='userdata-key'>Order ID:</p>
                                    <span className='userdata-divider'></span>
                                    <p className='userdata-value'>{order.order_id}</p>
                                </div>
                            </div>
                        </div>
                        <div style={{ background: 'grey', height: '2px', width: '100%', margin: '10px 0px' }} />
                        <h2 >Financial Breakdown</h2>
                        <div className='summary-wrapper' >
                            <div style={{ width: '40%' }} >
                                <div className='userdata-pair' >
                                    <p className='userdata-key'>
                                        Original Monthly Cost:&nbsp;
                                    </p>
                                    <span className='userdata-divider'></span>
                                    <p className='userdata-value' >
                                        ${order.og_monthly_cost}
                                    </p>
                                </div>
                                <div className='userdata-pair' >
                                    <p className='userdata-key'>
                                        Jybe Monthly Bill:&nbsp;
                                    </p>
                                    <span className='userdata-divider'></span>
                                    <p className='userdata-value' >
                                        ${order.jybe_cost}
                                    </p>
                                </div>
                            </div>
                            <div style={{ width: '40%' }}>
                                {order.order_merchant_markup != 0 && <div className='userdata-pair' >
                                    <p className='userdata-key'>
                                        Merchant Markup:&nbsp;
                                    </p>
                                    <span className='userdata-divider'></span>
                                    <p className='userdata-value' >
                                        ${(order.amount * (order.order_merchant_markup / 100)).toFixed(2)} / {order.order_merchant_markup}%
                                    </p>
                                </div>}
                                {order.order_user_markup != 0 && <div className='userdata-pair' >
                                    <p className='userdata-key'>
                                        User Markup:&nbsp;
                                    </p>
                                    <span className='userdata-divider'></span>
                                    <p className='userdata-value' >
                                        ${(order.amount * (order.order_user_markup / 100)).toFixed(2) } / {order.order_user_markup}%
                                    </p>
                                </div>}
                            </div>
                        </div>
                        <div style={{ background: 'grey', height: '2px', width: '100%', margin: '10px 0px' }} />
                        <h2 >Customer Info</h2>
                        <div className='summary-wrapper' >
                            <div style={{ width: '40%' }} >
                                <div className='userdata-pair' >
                                    <p className='userdata-key'>
                                        User ID:&nbsp;
                                    </p>
                                    <Link to={`/user/${order.user_id}`} className='userdata-value'>
                                        {order.user_id}
                                    </Link>
                                </div>
                                <div className='userdata-pair' >
                                    <p className='userdata-key'>
                                        Name:&nbsp;
                                    </p>
                                    <span className='userdata-divider'></span>
                                    <p className='userdata-value' >
                                        {order.first_name} {order.last_name}
                                    </p>
                                </div>
                                <div className='userdata-pair' >
                                    <p className='userdata-key'>
                                        Email:&nbsp;
                                    </p>
                                    <span className='userdata-divider'></span>
                                    <p className='userdata-value' >
                                        {order.email}
                                    </p>
                                </div>
                                <div className='userdata-pair' >
                                    <p className='userdata-key'>
                                        Phone:&nbsp;
                                    </p>
                                    <span className='userdata-divider'></span>
                                    <p className='userdata-value' >
                                        {order.phone}
                                    </p>
                                </div>
                                <div className='userdata-pair' >
                                    <p className='userdata-key'>
                                        Date of Birth:&nbsp;
                                    </p>
                                    <span className='userdata-divider'></span>
                                    <p className='userdata-value' >
                                        {order.dob.substring(0, 10)}
                                    </p>
                                </div>
                            </div>
                            <div style={{ width: '40%' }} >
                                <div className='userdata-pair' >
                                    <p className='userdata-key'>
                                        Country:&nbsp;
                                    </p>
                                    <span className='userdata-divider'></span>
                                    <p className='userdata-value' >
                                        {order.country}
                                    </p>
                                </div>
                                <div className='userdata-pair' >
                                    <p className='userdata-key'>
                                        State:&nbsp;
                                    </p>
                                    <span className='userdata-divider'></span>
                                    <p className='userdata-value' >
                                        {order.province}
                                    </p>
                                </div>
                                <div className='userdata-pair' >
                                    <p className='userdata-key'>
                                        City:&nbsp;
                                    </p>
                                    <span className='userdata-divider'></span>
                                    <p className='userdata-value' >
                                        {order.city}
                                    </p>
                                </div>
                                <div className='userdata-pair' >
                                    <p className='userdata-key'>
                                        Address:&nbsp;
                                    </p>
                                    <span className='userdata-divider'></span>
                                    <p className='userdata-value' >
                                        {order.address}
                                    </p>
                                </div>
                                <div className='userdata-pair' >
                                    <p className='userdata-key'>
                                        Zip Code:&nbsp;
                                    </p>
                                    <span className='userdata-divider'></span>
                                    <p className='userdata-value' >
                                        {order.zip}
                                    </p>
                                </div>
                            </div>
                        </div>
                        {/* <div style={{ dd, flexWrap: 'wrap', marginTop: '16px' }} >
                            <div>
                                <u className='subs see-through' >Subscription Info</u>
                                <div className='userdata-pair' >
                                    <p className='userdata-key'>
                                        Original Annual Cost:&nbsp;
                                    </p>
                                    <span className='userdata-divider'></span>
                                    <p className='userdata-value' >
                                        ${order.og_amount}
                                    </p>
                                </div>
                                <div className='userdata-pair' >
                                    <p className='userdata-key'>
                                        Original Monthly Cost:&nbsp;
                                    </p>
                                    <span className='userdata-divider'></span>
                                    <p className='userdata-value' >
                                        ${order.og_monthly_cost}
                                    </p>
                                </div>
                                <div className='userdata-pair' >
                                    <p className='userdata-key'>
                                        After Markups:&nbsp;
                                    </p>
                                    <span className='userdata-divider'></span>
                                    <p className='userdata-value' >
                                        ${order.amount * (1 - (order.order_merchant_markup / 100))}
                                    </p>
                                </div>
                                <div className='userdata-pair' >
                                    <p className='userdata-key'>
                                        Settlement ID:&nbsp;
                                    </p>
                                    {paymentId ? <Link to={`/settlement/${paymentId}`} className='userdata-value' >
                                        {paymentId}
                                    </Link>
                                        :
                                        <span className='userdata-divider'></span>
                                    <p className='userdata-value' >
                                            Pending
                                        </p>
                                    }
                                </div>
                                {/* <div className='userdata-pair' >
                                        <p className='userdata-key'>
                                            Order ID:&nbsp;
                                        </p>
                                        <span className='userdata-divider'></span>
                                    <p className='userdata-value'>
                                            {order.order_id}
                                        </p>
                                    </div> 
                            </div>
                            <div>
                                <u className='billing see-through' >
                                    Billing Info
                                </u>
                                <div className='userdata-pair' >
                                    <p className='userdata-key'>
                                        Monthly Bill:&nbsp;
                                    </p>
                                    <span className='userdata-divider'></span>
                                    <p className='userdata-value' >
                                        ${order.jybe_cost / 100}
                                    </p>
                                </div>
                                <div className='userdata-pair' >
                                    <p className='userdata-key'>
                                        Amount Paid:&nbsp;
                                    </p>
                                    <span className='userdata-divider'></span>
                                    <p className='userdata-value' >
                                        ${order.amount_paid}
                                    </p>
                                </div>
                                <div className='userdata-pair' >
                                    <p className='userdata-key'>
                                        Status:&nbsp;
                                    </p>
                                    <span className='userdata-divider'></span>
                                    <p className='userdata-value' style={{ color: order.order_status == 'active' ? 'green' : '#B0194A' }} >
                                        {order.order_status}
                                    </p>
                                </div>
                                <div className='userdata-pair' >
                                    <p className='userdata-key'>
                                        User Markup:&nbsp;
                                    </p>
                                    <span className='userdata-divider'></span>
                                    <p className='userdata-value' >
                                        {order.order_user_markup}% / ${order.amount * (order.order_user_markup / 100)}
                                    </p>
                                </div>
                                <div className='userdata-pair' >
                                    <p className='userdata-key'>
                                        Merchant Markup:&nbsp;
                                    </p>
                                    <span className='userdata-divider'></span>
                                    <p className='userdata-value' >
                                        {order.order_merchant_markup}% / ${order.amount * (order.order_merchant_markup / 100)}
                                    </p>
                                </div>
                            </div>
                            <div>
                                <u className='users2 see-through' >User Info</u>
                                <div className='userdata-pair' >
                                    <p className='userdata-key'>
                                        User ID:&nbsp;
                                    </p>
                                    <Link to={`/user/${order.user_id}`} className='userdata-value'>
                                        {order.user_id}
                                    </Link>
                                </div>
                                <div className='userdata-pair' >
                                    <p className='userdata-key'>
                                        Zip Code:&nbsp;
                                    </p>
                                    <span className='userdata-divider'></span>
                                    <p className='userdata-value' >
                                        {order.zip}
                                    </p>
                                </div>
                                <div className='userdata-pair' >
                                    <p className='userdata-key'>
                                        Name:&nbsp;
                                    </p>
                                    <span className='userdata-divider'></span>
                                    <p className='userdata-value' >
                                        {order.first_name} {order.last_name}
                                    </p>
                                </div>
                                <div className='userdata-pair' >
                                    <p className='userdata-key'>
                                        Email:&nbsp;
                                    </p>
                                    <span className='userdata-divider'></span>
                                    <p className='userdata-value' >
                                        {order.email}
                                    </p>
                                </div>
                                <div className='userdata-pair' >
                                    <p className='userdata-key'>
                                        Phone:&nbsp;
                                    </p>
                                    <span className='userdata-divider'></span>
                                    <p className='userdata-value' >
                                        {order.phone}
                                    </p>
                                </div>
                            </div>
                        </div> */}
                    </div>
                </div>
            }
        </div>
    )
}

export default Order