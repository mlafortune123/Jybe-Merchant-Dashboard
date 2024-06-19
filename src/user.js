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
                transformedOrder['Date'] = order.created_at.substring(0, 10)
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
        <div className='ytop' >
                <Aside/>
                {rowData &&
                    <div className='inside-wrapper' >
                        <div style={{ background: 'white', padding: '24px', border: '1px solid lightgrey', borderRadius: '16px' }} >
                            <h2>USER PROFILE</h2>
                            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', marginTop: '16px' }} >
                                <div>
                                    <u>Contact Info</u>
                                    <div className='userdata-pair' >
                                        <p className='userdata-key'>
                                            Name:&nbsp;
                                        </p>
                                        <p className='userdata-value' >
                                            {userOrders[0].first_name} {userOrders[0].last_name}
                                        </p>
                                    </div>
                                    <div className='userdata-pair' >
                                        <p className='userdata-key'>
                                            Email:&nbsp;
                                        </p>
                                        <p className='userdata-value' >
                                            {userOrders[0].email}
                                        </p>
                                    </div>
                                    <div className='userdata-pair' >
                                        <p className='userdata-key'>
                                            Phone:&nbsp;
                                        </p>
                                        <p className='userdata-value' >
                                            {userOrders[0].phone}
                                        </p>
                                    </div>
                                    <div className='userdata-pair' >
                                        <p className='userdata-key'>
                                            Date of Birth:&nbsp;
                                        </p>
                                        <p className='userdata-value' >
                                            {userOrders[0].dob.substring(0, 10)}
                                        </p>
                                    </div>
                                    <div className='userdata-pair' >
                                        <p className='userdata-key'>
                                            Passed Credit Check:&nbsp;
                                        </p>
                                        <p className='userdata-value' style={{ color: userOrders[0].passed ? 'green' : 'red' }}  >
                                            {userOrders[0].passed.toString()}
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <u>Billing Info</u>
                                    <div className='userdata-pair' >
                                        <p className='userdata-key'>
                                            Country:&nbsp;
                                        </p>
                                        <p className='userdata-value' >
                                            {userOrders[0].country}
                                        </p>
                                    </div>
                                    <div className='userdata-pair' >
                                        <p className='userdata-key'>
                                            Province:&nbsp;
                                        </p>
                                        <p className='userdata-value' >
                                            {userOrders[0].province}
                                        </p>
                                    </div>
                                    <div className='userdata-pair' >
                                        <p className='userdata-key'>
                                            City:&nbsp;
                                        </p>
                                        <p className='userdata-value' >
                                            {userOrders[0].city}
                                        </p>
                                    </div>
                                    <div className='userdata-pair' >
                                        <p className='userdata-key'>
                                            Address:&nbsp;
                                        </p>
                                        <p className='userdata-value' >
                                            {userOrders[0].address}
                                        </p>
                                    </div>
                                    <div className='userdata-pair' >
                                        <p className='userdata-key'>
                                            Zip Code:&nbsp;
                                        </p>
                                        <p className='userdata-value' >
                                            {userOrders[0].zip}
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <u>
                                        Subscriptions Info
                                    </u>
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
                                            Monthly Bill:&nbsp;
                                        </p>
                                        <p className='userdata-value' >
                                            ${Math.round(userOrders.reduce((a, b) => {
                                                return a + parseFloat(b.jybe_cost)
                                            }, 0))/100}
                                        </p>
                                    </div>
                                    <div className='userdata-pair' >
                                        <p className='userdata-key'>
                                            Total Value of Subs:&nbsp;
                                        </p>
                                        <p className='userdata-value' >
                                            ${userOrders.reduce((a, b) => {
                                                return a + (b.amount)
                                            }, 0)}
                                        </p>
                                    </div>
                                    <div className='userdata-pair' >
                                        <p className='userdata-key'>
                                            After markups earnings:&nbsp;
                                        </p>
                                        <p className='userdata-value' >
                                            ${userOrders.reduce((a, b) => {
                                                return a + (b.amount * (1- (b.merchant_markup/100)))
                                            }, 0)}
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
                }
            </div>
    )
}

export default User