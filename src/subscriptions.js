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

  const fieldMapping = {
    user_id: 'User ID',
    product_name: 'Product name',
    amount: 'Loan Amount',
    jybe_cost: 'Monthly Cost',
    order_id: 'Order ID',
    order_status: 'Status',
  };

  useEffect(() => {
    if (orders) {
      const transformedOrders = orders.map(order => {
        const transformedOrder = {};
        transformedOrder['Date'] = order.created_at.substring(0, 10)
        for (const [oldField, newField] of Object.entries(fieldMapping)) {
          transformedOrder[newField] = order[oldField];
        }
        return transformedOrder;
      });
      setRowData(transformedOrders)
    }
  }, [orders])

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
      cellRenderer: props => `$${props.value / 100}`
    },
    { field: "Status" }
  ]

  return (
    <div className='ytop'>
      <Aside/>
      {rowData &&
        <div className='inside-wrapper' >
          <div className='grid-wrapper' >
          <h2>Subscriptions</h2>
          <p>Here is a bunch of words that Michael will write at some point. Which Michael? We don't know</p>
          <div
            className="ag-theme-quartz" // applying the grid theme
            style={{ height: '80vh', width: '100%'}} // the grid will fill the size of the parent container
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