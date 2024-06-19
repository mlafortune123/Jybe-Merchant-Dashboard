import React, { useState, useContext, useEffect } from 'react';
import { AccountContext } from './ProtectedRoute';
import toast, { Toaster } from 'react-hot-toast';
import { AgGridReact } from 'ag-grid-react'; // React Data Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the grid
import { Aside } from "./Aside.jsx"
import { Header } from './Header.jsx';
import ContinueButton from './ContinueButton.js';
const API_URL = process.env.REACT_APP_API_URL

const Settings = () => {
    const context = useContext(AccountContext);
    const { admins, merchant } = context
    const [rowData, setRowData] = useState()
    const [colDefs, setColDefs] = useState();
    const [email, setEmail] = useState()

    const fieldMapping = {
        email: 'Email',
    };

    useEffect(() => {
        if (admins) {
            const transformedOrders = admins.map(order => {
                const transformedOrder = {};
                for (const [oldField, newField] of Object.entries(fieldMapping)) {
                    transformedOrder[newField] = order[oldField];
                }
                return transformedOrder;
            });
            setRowData(transformedOrders)
        }
    }, [admins])

    const ButtonRenderer = (props) => {
        return (
            <ContinueButton active={true} text={'Remove'} onClick={() => removeAdmin(props.value)} />
        );
    };

    useEffect(() => {
        setColDefs([
            {
                field: "Email",
                // cellStyle: {
                //     textAlign: 'center',
                //     display: 'flex',
                //     alignItems: 'center',
                //     justifyContent: 'center',
                //     //width:'250px'
                // },
                //headerStyle: { width: '100%' }
            },
            {
                headerName: 'Actions',
                field: 'actions',
                cellRenderer: ButtonRenderer,
                // cellStyle: {
                //     textAlign: 'center',
                //     display: 'flex',
                //     alignItems: 'start',
                //     justifyContent: 'center',
                //     //width:'350px'
                // },
                // headerStyle: { width: '100%' }
            },
        ])
    }, [])

    const addAdmin = () => {
        fetch(`${API_URL}/addAdmin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        })
            .then(res => res.json())
            .then(res => {
                toast.success("Admin added successfully!")
            })
    }

    const removeAdmin = (email) => {
        fetch(`${API_URL}/removeAdmin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        })
            .then(res => res.json())
            .then(res => {
                toast.success("Admin removed successfully!")
            })
    }

    const gridOptions = {
        defaultColDef: {
            width: '500px',
            cellStyle: {
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                paddingLeft: '8px',
                paddingRight: '8px'
            }
        }
    };

    return (
        <div className='rainbow' >
            <Toaster
                toastOptions={{
                    className: '',
                    style: {
                        marginTop: '86px',
                        padding: '16px',
                        zIndex: 9
                    },
                }}
            />
            <Aside/>
            {rowData && rowData.length > 1 &&
                <div className='inside-wrapper'>
                    <h2 style={{ fontSize: '36px', textDecoration: 'underline' }} >ADMINS</h2>
                    <div
                        className="ag-theme-quartz" // applying the grid theme
                        style={{ height: `${48 + (rowData.length * 60)}px`, }} // the grid will fill the size of the parent container
                    >
                        <AgGridReact
                            //gridOptions={gridOptions}
                            rowHeight={60}
                            rowData={[...rowData]}
                            columnDefs={colDefs}
                        />
                        </div>
                        <div style={{ background: 'white', padding: '16px' }} >Add a New Admin
                            <div style={{ width: '100%', background: 'lightgrey', height: '1px', left: '-16px', position: 'relative', marginTop: '12px' }} />
                            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-evenly', margin: '8px 0px' }} >
                                <input style={{ width: '40%' }} placeholder='email' className='input' value={email} onChange={e => setEmail(e.target.value)} />
                                <ContinueButton active={true} text={'Add as Admin'} onClick={addAdmin} />
                            </div>
                        </div>
                </div>
            }
        </div>
    )
}

export default Settings