import React, { useState, useContext, useEffect } from 'react';
import { AccountContext } from './ProtectedRoute';
import { Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { AgGridReact } from 'ag-grid-react'; // React Data Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the grid
import { Aside } from "./Aside.jsx"
import { Header } from './Header.jsx';

const Settlements = () => {
  const context = useContext(AccountContext);
  const { payments, merchant, orders } = context
  const [rowData, setRowData] = useState()
  const [dateFilter, setDateFilter] = useState("All Time")
  const fieldMapping = {
    payment_id: 'Payment ID',
    payment_amount: 'Total Paid',
    refund_amount: 'Amount Refunded'
  };

  const SettlementLinkRenderer = (props) => {
    return <Link to={`/settlement/${props.value}`}>{props.value}</Link>
  }

  const colDefs = [
    { field: "Date" },
    {
      field: "Payment ID",
      cellRenderer: SettlementLinkRenderer
    },
    { field: "Total Settled", cellRenderer: props => `$${props.value}` },
    { field: "Subs Settled" },
    { field: "Total Fees", cellRenderer: props => `$${props.value}`},
    { field: "Total Paid", cellRenderer: props => `$${props.value}`},
    { field: "Amount Refunded", cellRenderer: props => `$${props.value}`},
    { field: "User Markup" },
    { field: "Merchant Markup" },

  ]

  const filterPaymentsByDate = (orders, filter) => {
    const now = new Date();
    let filteredOrders = [];

    switch (filter) {
        case 'All Time': 
            filteredOrders = orders
            break;
        case 'week':
            filteredOrders = orders.filter(order => {
                const orderDate = new Date(order.payment_date);
                const diffTime = Math.abs(now - orderDate);
                const diffDays = diffTime / (1000 * 60 * 60 * 24);
                return diffDays <= 7;
            });
            break;
        case '30 days':
            filteredOrders = orders.filter(order => {
                const orderDate = new Date(order.payment_date);
                const diffTime = Math.abs(now - orderDate);
                const diffDays = diffTime / (1000 * 60 * 60 * 24);
                return diffDays <= 30;
            });
            break;
        case '90 days':
            filteredOrders = orders.filter(order => {
                const orderDate = new Date(order.payment_date);
                const diffTime = Math.abs(now - orderDate);
                const diffDays = diffTime / (1000 * 60 * 60 * 24);
                return diffDays <= 90;
            });
            break;
        case 'year':
            filteredOrders = orders.filter(order => {
                const orderDate = new Date(order.payment_date);
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
    if (payments) {
      const filteredPayments = filterPaymentsByDate(payments, dateFilter);
      const transformedOrders = filteredPayments.map(payment => {
        const transformedOrder = {};
        const theOrders = orders.filter(order => order.order_created_at.substring(0, 10) == payment.payment_date.substring(0, 10) && order.order_status != 'inactive')
        const totalFees = theOrders.reduce((a, b) => {
          return a + (((b.order_user_markup + b.order_merchant_markup)/100) * b.amount)
        }, 0)
        const totalAmountSettled = theOrders.reduce((a, b) => {
          return a + b.amount
      }, 0)
    //   const totalPaid = theOrders.reduce((a, b) => {
    //     return a + b.amount
    // }, 0) - totalFees
        // Combine first_name and last_name into Name
        transformedOrder['Date'] = payment.payment_date.substring(0, 10)
        transformedOrder['User Markup'] = parseFloat(payment.user_markup)
        transformedOrder['Merchant Markup'] = parseFloat(payment.merchant_markup)
        transformedOrder['Subs Settled'] = theOrders.length
        transformedOrder['Total Settled'] = totalAmountSettled
        transformedOrder['Total Fees'] = totalFees
        //transformedOrder['Total Paid'] = totalPaid
        // Map the other fields
        for (const [oldField, newField] of Object.entries(fieldMapping)) {
          transformedOrder[newField] = payment[oldField];
        }

        return transformedOrder;
      });
      setRowData(transformedOrders)
    }
  }, [payments, dateFilter])

  return (
    <div className='flex-fullscreen settlements' >
      <Aside/>
      {rowData &&
        <div className='inside-wrapper' >
          <div className='space-between' >
          <h2 className='page-title' >Settlements</h2>
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
            <div
              className="ag-theme-quartz" // applying the grid theme
              style={{ height: '70vh', width: '100%' }} // the grid will fill the size of the parent container
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

export default Settlements