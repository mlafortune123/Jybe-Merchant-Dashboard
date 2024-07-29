import React, { useState, useContext, useEffect } from 'react';
import { AccountContext } from './ProtectedRoute';
import { Link } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';
import { AgGridReact } from 'ag-grid-react'; // React Data Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the grid
import { Aside } from "./Aside.jsx"
import { Header } from './Header.jsx';

const Subscriptions = () => {
  const context = useContext(AccountContext);
  const { orders, merchant } = context
  const [rowData, setRowData] = useState()
  const [dateFilter, setDateFilter] = useState('All Time'); // Default filter is 'week'

  const filterOrdersByDate = (orders, filter) => {
      const now = new Date();
      let filteredOrders = [];

      switch (filter) {
          case 'All Time': 
            filteredOrders = orders
            break;
          case 'week':
              filteredOrders = orders.filter(order => {
                  const orderDate = new Date(order.order_created_at);
                  const diffTime = Math.abs(now - orderDate);
                  const diffDays = diffTime / (1000 * 60 * 60 * 24);
                  return diffDays <= 7;
              });
              break;
          case '30 days':
              filteredOrders = orders.filter(order => {
                  const orderDate = new Date(order.order_created_at);
                  const diffTime = Math.abs(now - orderDate);
                  const diffDays = diffTime / (1000 * 60 * 60 * 24);
                  return diffDays <= 30;
              });
              break;
          case '90 days':
              filteredOrders = orders.filter(order => {
                  const orderDate = new Date(order.order_created_at);
                  const diffTime = Math.abs(now - orderDate);
                  const diffDays = diffTime / (1000 * 60 * 60 * 24);
                  return diffDays <= 90;
              });
              break;
          case 'year':
              filteredOrders = orders.filter(order => {
                  const orderDate = new Date(order.order_created_at);
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


  const fieldMapping = {
    user_id: 'User ID',
    product_name: 'Product name',
    amount: 'Loan Amount',
    jybe_cost: 'Monthly Cost',
    order_id: 'Order ID',
    order_status: 'Status',
    order_payment_status: 'Payment Status'
  };

  useEffect(() => {
    if (orders) {
        const filteredOrders = filterOrdersByDate(orders, dateFilter);
        const transformedOrders = filteredOrders.map(order => {
            const transformedOrder = {};
            transformedOrder['Date'] = order.order_created_at.substring(0, 10);
            const monthsPassed = (new Date().getFullYear() - new Date(order.order_created_at).getFullYear()) * 12 + new Date().getMonth() - new Date(order.order_created_at).getMonth();
            transformedOrder['Progress'] = monthsPassed
            for (const [oldField, newField] of Object.entries(fieldMapping)) {
                transformedOrder[newField] = order[oldField];
            }
            return transformedOrder;
        });
        setRowData(transformedOrders);
    }
}, [orders, dateFilter]);

  const UserLinkRenderer = (props) => {
    return <Link to={`/user/${props.value}`}>{props.value}</Link>
  }

  const OrderLinkRenderer = (props) => {
    return <Link to={`/order/${props.value}`}>{props.value}</Link>
  }

  const colDefs = [
    {
      field: "Order ID",
      cellRenderer: OrderLinkRenderer
    },
    {
      field: "User ID",
      cellRenderer: UserLinkRenderer
    },
    { field: "Date" },
    { field: "Product name" },
    {
      field: "Loan Amount",
      cellRenderer: props => `$${props.value}`
    },
    {
      field: "Monthly Cost",
      cellRenderer: props => `$${props.value}`
    },
    { field: "Status" },
    { field: "Progress"}
  ]

  return (
    <div className='flex-fullscreen subs'>
      <Aside/>
      {rowData &&
        <div className='inside-wrapper' >
          <div className='space-between'>
          <h2 className='page-title' >Subscriptions</h2>
          <div className='dashboard-card' style={{flex:'none'}} >
                  <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}>
                      <option value="week">Week</option>
                      <option value="30 days">30 Days</option>
                      <option value="90 days">90 Days</option>
                      <option value="year">Year</option>
                      <option value="All Time">All Time</option>
                  </select>
              </div>
          </div>
          <div className='grid-wrapper' >
          {/* <h2>Subscriptions</h2>
          <p>Here is a bunch of words that Michael will write at some point. Which Michael? We don't know</p> */}
          <div
            className="ag-theme-quartz" // applying the grid theme
            style={{ height: '70vh', width: '100%'}} // the grid will fill the size of the parent container
          >

            <AgGridReact
              rowData={rowData}
              columnDefs={colDefs}
            />
          </div>
          </div>
        </div>
      }
    </div>
  )
}

export default Subscriptions