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
import settlement from './images/settlement.svg'

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
            const settledOrders = orders.filter(order => order.created_at.substring(0,10) == payment.payment_date.substring(0,10) && order.order_status != 'inactive')

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
        { field: "Loan Amount", cellRenderer: props => `${props.value}` },
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
        <div className='flex-fullscreen settlements'>
                <Aside/>
                {rowData && merchant &&
                    <div className='inside-wrapper' >
                        <div className='order' > 
                            <h2 style={{fontSize:'36px'}} ><img className='ma-img' src={settlement} style={{marginRight:'8px'}} />Settlement for ${payment.payment_amount} on {payment.payment_date.substring(0,10)} </h2>
                            <p>ID: {payment_id}</p>
                            <div style={{ background: 'grey', height: '2px', width: '100%', margin: '10px 0px' }} />
                            <h2>Subscriptions Info</h2>
                            <div className='space-between' style={{flexWrap: 'wrap', marginTop: '16px' }} >
                                <div style={{width:'40%'}} >
                                    <div className='userdata-pair' >
                                        <p className='userdata-key'>
                                            Number of Subs:&nbsp;
                                        </p>
                                        <span className='userdata-divider'></span>
                                        <p className='userdata-value'
 >
                                            {rowData.length}
                                        </p>
                                    </div>
                                    <div className='userdata-pair' >
                                        <p className='userdata-key'>
                                            Monthly Subs intake:&nbsp;
                                        </p>
                                        <span className='userdata-divider'></span>
                                        <p className='userdata-value'
 >
                                            ${Math.round(settledOrders.reduce((a, b) => {
                                                return a + parseFloat(b.jybe_cost)
                                            }, 0))/100}
                                        </p>
                                    </div>
                                    <div className='userdata-pair' >
                                        <p className='userdata-key'>
                                            Total Value of Subs:&nbsp;
                                        </p>
                                        <span className='userdata-divider'></span>
                                        <p className='userdata-value'
 >
                                            ${settledOrders.reduce((a, b) => {
                                                return a + (b.amount)
                                            }, 0)}
                                        </p>
                                    </div>
                                </div>
                                <div style={{width:'40%'}}>
                                    <div className='userdata-pair' >
                                        <p className='userdata-key'>
                                            Total User Markups:&nbsp;
                                        </p>
                                        <span className='userdata-divider'></span>
                                        <p className='userdata-value'
 >
                                            ${settledOrders.reduce((a, b) => {
                                                return a + (b.order_user_markup/100) * b.amount
                                            }, 0)}
                                        </p>
                                    </div>
                                    <div className='userdata-pair' >
                                        <p className='userdata-key'>
                                            Total Merchant Markups:&nbsp;
                                        </p>
                                        <span className='userdata-divider'></span>
                                        <p className='userdata-value'
 >
                                            ${settledOrders.reduce((a, b) => {
                                                return a + (b.order_merchant_markup/100) * b.amount
                                            }, 0)}
                                        </p>
                                    </div>
                                    <div className='userdata-pair' >
                                        <p className='userdata-key'>
                                            After markups earnings:&nbsp;
                                        </p>
                                        <span className='userdata-divider'></span>
                                        <p className='userdata-value'
 >
                                            ${settledOrders.reduce((a, b) => {
                                                return a + (b.amount * (1- (b.merchant_markup/100)))
                                            }, 0)}
                                        </p>
                                    </div>
                                </div>
                            </div>
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
                    </div>
                }
            </div>
    )
}

export default Settlement