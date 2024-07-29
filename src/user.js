import React, { useState, useContext, useEffect } from 'react';
import { AccountContext } from './ProtectedRoute';
import { Link } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { AgGridReact } from 'ag-grid-react'; // React Data Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the grid
import { Aside } from "./Aside.jsx"
import { Header } from './Header.jsx';
import user from "./images/user.svg"

const User = () => {
    const user_id = window.location.pathname.substring(6, 42)
    console.log(user_id)
    const context = useContext(AccountContext);
    const { orders, merchant } = context
    const [rowData, setRowData] = useState()
    const [userOrders, setUserOrders] = useState()

    const fieldMapping = {
        //user_id: 'User ID',
        product_name: 'Product name',
        amount: 'Loan Amount',
        order_id: 'Order ID',
        order_status: 'Status',
    };

    useEffect(() => {
        if (orders) {
            const usersOrders = orders.filter(order => order.user_id == user_id)
            setUserOrders(usersOrders)
            const transformedOrders = usersOrders.map(order => {
                const transformedOrder = {};

                // Combine first_name and last_name into Name
                //transformedOrder['Name'] = `${order.first_name} ${order.last_name}`;
                transformedOrder['Date'] = order.order_created_at.substring(0, 10)
                // Map the other fields
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
        { field: "Status" }
    ]

    return (
        <div className='flex-fullscreen subs' >
            <Aside />
            {rowData &&
                <div className='inside-wrapper' >
                    <div className='order' >
                            <h2 style={{fontSize:'36px'}}><img className='ma-img' src={user} style={{marginRight:'8px'}} />{userOrders[0].first_name} {userOrders[0].last_name}'s Profile</h2>
                            <p>ID: {user_id}</p>
                        <div style={{ background: 'grey', height: '2px', width: '100%', margin: '10px 0px' }} />
                        <h2>Subscriptions & Contact Info</h2>
                        <div className='summary-wrapper'>
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
                                        Active Subs:&nbsp;
                                    </p>
                                    <span className='userdata-divider'></span>
                                        <p className='userdata-value'
 >
                                        {(rowData.filter(order => order.Status == 'active')).length}
                                    </p>
                                </div>
                                <div className='userdata-pair' >
                                    <p className='userdata-key'>
                                        Monthly Bill:&nbsp;
                                    </p>
                                    <span className='userdata-divider'></span>
                                        <p className='userdata-value'
 >
                                        ${Math.round(userOrders.reduce((a, b) => {
                                            return a + parseFloat(b.jybe_cost)
                                        }, 0))}
                                    </p>
                                </div>
                                <div className='userdata-pair' >
                                    <p className='userdata-key'>
                                        Total Value of Subs:&nbsp;
                                    </p>
                                    <span className='userdata-divider'></span>
                                        <p className='userdata-value'
 >
                                        ${userOrders.reduce((a, b) => {
                                            return a + parseFloat(b.amount)
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
                                        ${userOrders.reduce((a, b) => {
                                            return a + (b.amount * (1 - (b.merchant_markup / 100)))
                                        }, 0)}
                                    </p>
                                </div>
                            </div>
                            <div>
                                <div className='userdata-pair' >
                                    <p className='userdata-key'>
                                        Email:&nbsp;
                                    </p>
                                    <span className='userdata-divider'></span>
                                        <p className='userdata-value'
 >
                                        {userOrders[0].email}
                                    </p>
                                </div>
                                <div className='userdata-pair' >
                                    <p className='userdata-key'>
                                        Phone:&nbsp;
                                    </p>
                                    <span className='userdata-divider'></span>
                                        <p className='userdata-value'
 >
                                        {userOrders[0].phone}
                                    </p>
                                </div>
                                <div className='userdata-pair' >
                                    <p className='userdata-key'>
                                        Date of Birth:&nbsp;
                                    </p>
                                    <span className='userdata-divider'></span>
                                        <p className='userdata-value'
 >
                                        {userOrders[0].dob.substring(0, 10)}
                                    </p>
                                </div>
                                <div className='userdata-pair' >
                                    <p className='userdata-key'>
                                        Passed Credit Check:&nbsp;
                                    </p>
                                    <span className='userdata-divider'></span>
                                        <p className='userdata-value'
 style={{ color: userOrders[0].passed ? 'green' : 'red' }}  >
                                        {userOrders[0].passed.toString()}
                                    </p>
                                </div>
                                <div>
                                    <div className='userdata-pair' >
                                        <p className='userdata-key'>
                                            Address:&nbsp;
                                        </p>
                                        <span className='userdata-divider'></span>
                                        <p className='userdata-value'
 >
                                            {userOrders[0].address}, {userOrders[0].city}, {userOrders[0].province}, {userOrders[0].country}, {userOrders[0].zip}
                                        </p>
                                    </div>
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

export default User