import React, { useState, useContext, useEffect } from 'react';
import { AccountContext } from './ProtectedRoute';
import { Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { AgGridReact } from 'ag-grid-react'; // React Data Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the grid
import { Aside } from "./Aside.jsx"
import { Header } from './Header.jsx';

const Subscriptions = () => {
  const context = useContext(AccountContext);
  const { payments, merchant, orders } = context
  const [rowData, setRowData] = useState()

  const fieldMapping = {
    payment_id: 'Payment ID',
    payment_amount: 'Amount',
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
    { field: "Amount", cellRenderer: props => `$${props.value}` },
    { field: "User Markup" },
    { field: "Merchant Markup" },
    { field: "Subs Settled" }
  ]

  useEffect(() => {
    if (payments) {
      console.log(payments)
      const transformedOrders = payments.map(payment => {
        const transformedOrder = {};

        // Combine first_name and last_name into Name
        transformedOrder['Date'] = payment.payment_date.substring(0, 10)
        transformedOrder['User Markup'] = parseFloat(payment.user_markup)
        transformedOrder['Merchant Markup'] = parseFloat(payment.merchant_markup)
        transformedOrder['Subs Settled'] = (orders.filter(order => order.created_at.substring(0, 10) == payment.payment_date.substring(0, 10))).length
        // Map the other fields
        for (const [oldField, newField] of Object.entries(fieldMapping)) {
          transformedOrder[newField] = payment[oldField];
        }

        return transformedOrder;
      });
      setRowData(transformedOrders)
    }
  }, [payments])

  return (
    <div className='ptob' >
      <Aside/>
      {rowData &&
        <div className='inside-wrapper' >
          <div className='grid-wrapper' >
            <h2>Settlements</h2>
            <p>Here is a bunch of words that Michael will write at some point. Which Michael? We don't know</p>
            <div
              className="ag-theme-quartz" // applying the grid theme
              style={{ height: '80vh', width: '100%', paddingTop: '10vh' }} // the grid will fill the size of the parent container
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