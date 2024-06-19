import React, { useState, useContext, useEffect } from 'react';
import { AccountContext } from './ProtectedRoute.js';
import { Link } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { AgGridReact } from 'ag-grid-react'; // React Data Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the grid
import { Aside } from "./Aside.jsx"
import { Header } from './Header.jsx';

const Settlement = () => {
    const payment_id = window.location.pathname.substring(12, 48)
    console.log(payment_id)
    const context = useContext(AccountContext);
    const { orders, merchant, payments } = context
    const [rowData, setRowData] = useState()
    const [payment, setPayment] = useState()
    const [settledOrders, setSettledOrders] = useState()

    const fieldMapping = {
        product_name: 'Product name',
        order_id: 'Order ID',
        order_status: 'Status'
    };

    useEffect(() => {
        if (orders && merchant && payments) {
            const payment = payments.filter(payment => payment.payment_id == payment_id)[0]
            const settledOrders = orders.filter(order => order.created_at.substring(0,10) == payment.payment_date.substring(0,10))

            setPayment(payment)
            setSettledOrders(settledOrders)

            const transformedOrders = settledOrders.map(order => {
                const transformedOrder = {};
                transformedOrder['Date'] = order.created_at.substring(0, 10)
                transformedOrder['Monthly Payment'] = `$${order.jybe_cost/100}`
                transformedOrder['User Markup'] = `${order.order_user_markup}% / $${(order.order_user_markup/100) * order.amount}`
                transformedOrder['Merchant Markup'] = `${order.order_merchant_markup}% / $${(order.order_merchant_markup/100) * order.amount}`
                transformedOrder['Loan Amount'] = `$${order.amount}`
                for (const [oldField, newField] of Object.entries(fieldMapping)) {
                    transformedOrder[newField] = order[oldField];
                }
                return transformedOrder;
            });
            setRowData(transformedOrders)
        }
    }, [orders])

    const OrderLinkRenderer = (props) => {
        return <Link to={`/order/${props.value}`}>{props.value}</Link>
    }

    const IndexHeader = () => (
        <div style={{ textAlign: 'center' }}>#</div>
      );

    const colDefs = [
        {
            headerComponentFramework: IndexHeader,
            valueGetter: 'node.rowIndex + 1',
            width: 50,
            pinned: 'left',
          },
        { field: "Date" },
        { field: "Product name" },
        { field: "Loan Amount", cellRenderer: props => `$${props.value}` },
        {
            field: "Order ID",
            cellRenderer: OrderLinkRenderer
        },
        { field: "Status" },
        { field: "Monthly Payment"},
        { field: "User Markup"},
        { field: "Merchant Markup"}
    ]

    return (
        <div className='ptob'>
                <Aside/>
                {rowData && merchant &&
                    <div className='inside-wrapper' >
                        <div style={{ background: 'white', padding: '24px', border: '1px solid lightgrey', borderRadius: '16px' }} >
                            <h2>SETTLEMENT PROFILE</h2>
                            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', marginTop: '16px' }} >
                                <div>
                                    <u>Merchant's Info</u>
                                    <div className='userdata-pair' >
                                        <p className='userdata-key'>
                                            Name:&nbsp;
                                        </p>
                                        <p className='userdata-value' >
                                            {merchant.merchant_name}
                                        </p>
                                    </div>
                                    <div className='userdata-pair' >
                                        <p className='userdata-key'>
                                            ID:&nbsp;
                                        </p>
                                        <Link to={`/merchant/${merchant.merchant_id}`} className='userdata-value' >
                                            {merchant.merchant_id}
                                        </Link>
                                    </div>
                                    <div className='userdata-pair' >
                                        <p className='userdata-key'>
                                            Status:&nbsp;
                                        </p>
                                        <p className='userdata-value' >
                                            {merchant.merchant_status}
                                        </p>
                                    </div>
                                    <div className='userdata-pair' >
                                        <p className='userdata-key'>
                                            Today's Tab:&nbsp;
                                        </p>
                                        <p className='userdata-value' >
                                            ${parseFloat(merchant.daily_tab)}
                                        </p>
                                    </div>
                                    <div className='userdata-pair' >
                                        <p className='userdata-key'>
                                            Total Tab:&nbsp;
                                        </p>
                                        <p className='userdata-value'>
                                            ${parseFloat(merchant.total_tab)}
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <u>Subscriptions Info</u>
                                    <div className='userdata-pair' >
                                        <p className='userdata-key'>
                                            Number of Subs:&nbsp;
                                        </p>
                                        <p className='userdata-value' >
                                            {rowData.length}
                                        </p>
                                    </div>
                                    <div className='userdata-pair' >
                                        <p className='userdata-key'>
                                            Active Subs:&nbsp;
                                        </p>
                                        <p className='userdata-value' >
                                            {(rowData.filter(order => order.Status == 'active')).length}
                                        </p>
                                    </div>
                                    <div className='userdata-pair' >
                                        <p className='userdata-key'>
                                            Monthly Subs intake:&nbsp;
                                        </p>
                                        <p className='userdata-value' >
                                            ${Math.round(settledOrders.reduce((a, b) => {
                                                return a + parseFloat(b.jybe_cost)
                                            }, 0))/100}
                                        </p>
                                    </div>
                                    <div className='userdata-pair' >
                                        <p className='userdata-key'>
                                            Total Value of Subs:&nbsp;
                                        </p>
                                        <p className='userdata-value' >
                                            ${settledOrders.reduce((a, b) => {
                                                return a + (b.amount)
                                            }, 0)}
                                        </p>
                                    </div>
                                    <div className='userdata-pair' >
                                        <p className='userdata-key'>
                                            After markups earnings:&nbsp;
                                        </p>
                                        <p className='userdata-value' >
                                            ${settledOrders.reduce((a, b) => {
                                                return a + (b.amount * (1- (b.merchant_markup/100)))
                                            }, 0)}
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <u>
                                        Math Breakdown
                                    </u>
                                    <div className='userdata-pair' >
                                        <p className='userdata-key'>
                                           Site URL:&nbsp;
                                        </p>
                                        <p className='userdata-value' >
                                            {merchant.site_url}
                                        </p>
                                    </div>
                                    <div className='userdata-pair' >
                                        <p className='userdata-key'>
                                            Webhook URL:&nbsp;
                                        </p>
                                        <p className='userdata-value' >
                                            {merchant.webhook_url}
                                        </p>
                                    </div>
                                    <div className='userdata-pair' >
                                        <p className='userdata-key'>
                                            Photo URL:&nbsp;
                                        </p>
                                        <p className='userdata-value' >
                                            {merchant.photo_url}
                                        </p>
                                    </div>
                                    <div className='userdata-pair' >
                                        <p className='userdata-key'>
                                            Total User Markups:&nbsp;
                                        </p>
                                        <p className='userdata-value' >
                                            ${settledOrders.reduce((a, b) => {
                                                return a + (b.order_user_markup/100) * b.amount
                                            }, 0)}
                                        </p>
                                    </div>
                                    <div className='userdata-pair' >
                                        <p className='userdata-key'>
                                            Total Merchant Markups:&nbsp;
                                        </p>
                                        <p className='userdata-value' >
                                            ${settledOrders.reduce((a, b) => {
                                                return a + (b.order_merchant_markup/100) * b.amount
                                            }, 0)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <u>Subscriptions Settled</u>
                        <div
                            className="ag-theme-quartz" // applying the grid theme
                            style={{ height: '50vh', width: '100%', paddingTop: '1vh' }} // the grid will fill the size of the parent container
                        >
                            <AgGridReact
                                rowData={rowData}
                                columnDefs={colDefs}
                                rowDragManaged={true}
                            />
                        </div>
                    </div>
                }
            </div>
    )
}

export default Settlement