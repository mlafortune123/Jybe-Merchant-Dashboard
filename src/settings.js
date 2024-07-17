import React, { useState, useContext, useEffect } from 'react';
import { AccountContext } from './ProtectedRoute';
import toast, { Toaster } from 'react-hot-toast';
import { AgGridReact } from 'ag-grid-react'; // React Data Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the grid
import { Aside } from "./Aside.jsx"
import { Header } from './Header.jsx';
import ContinueButton from './ContinueButton.js';

const Settings = () => {
    const context = useContext(AccountContext);
    const { admins, merchant, accessToken, refreshTheClock, API_URL } = context
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
            <ContinueButton twoStep={true} active={true} text={'Remove'} onClick={() => removeAdmin(props.data.Email)} />
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
        accessToken ? fetch(`${API_URL}/addAdmin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({ email })
        })
            .then(res => res.json())
            .then(res => {
                if (res.error) toast.error(res.error)
                    else {
                        refreshTheClock()
                        toast.success("Admin added successfully!")
                    }
            })
            :
            toast.error("Wait for access token please")
    }

    const removeAdmin = (email) => {
        accessToken ? fetch(`${API_URL}/removeAdmin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({ email })
        })
            .then(res => res.json())
            .then(res => {
                if (res.error) toast.error(res.error)
                    else {
                        refreshTheClock()
                        toast.success("Admin added successfully!")
                    }
            })
            :
            toast.error("Wait for access token please")
    }

    const resetKeys = () => {
        accessToken ? fetch(`${API_URL}/removeAdmin`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
            .then(res => res.json())
            .then(res => {
                if (res.error) toast.error(res.error)
                    else {
                        refreshTheClock()
                        toast.success("Keys Reset Successfully! You can now download the new ones")
                    }
            })
            :
            toast.error("Wait for access token please")
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

    const downloadPublicKey = () => {
        fetch(`${API_URL}/retrievePublicKey`, {
            method: 'GET',
            headers: {
                'Accept': 'application/x-pem-file',
                'Authorization': `Bearer ${accessToken}`
            }
        })
            .then(response => response.blob())
            .then(blob => {
                // Create a temporary link element
                const url = window.URL.createObjectURL(new Blob([blob]));
                const link = document.createElement('a');
                link.href = url;
                link.download = 'public_key'

                // Append the link to the body and click it programmatically
                document.body.appendChild(link);
                link.click();

                // Clean up: remove the link from the DOM
                link.parentNode.removeChild(link);
            })
            .catch(error => console.error('Error downloading file:', error));
    }

    const downloadPrivateKey = () => {
        fetch(`${API_URL}/retrievePrivateKey`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
            .then(response => response.blob())
            .then(blob => {
                // Create a temporary link element
                const url = window.URL.createObjectURL(new Blob([blob]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'private_key.pem'); // Set the default filename

                // Append the link to the body and click it programmatically
                document.body.appendChild(link);
                link.click();

                // Clean up: remove the link from the DOM
                link.parentNode.removeChild(link);
            })
            .catch(error => console.error('Error downloading file:', error));
    }

    return (
        <div className='flex-fullscreen rainbow' >
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
            <Aside />
            {rowData && rowData.length > 1 &&
                <div className='inside-wrapper'>
                    <h2 className='page-title' >ADMINS</h2>
                    <div style={{display:'flex', height:'88vh', justifyContent: 'space-between', flexDirection:'column' }} >
                        <div className='grid-wrapper' >
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
                        </div>
                        <div className='space-between'>
                        <div style={{ background: 'white', padding: '16px', borderRadius: '16px' }} >Add a New Admin
                            <div style={{ width: '100%', background: 'lightgrey', height: '1px', position: 'relative', marginTop: '12px' }} />
                            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-evenly', margin: '8px 0px' }} >
                                <input style={{ width: '40%' }} placeholder='email' className='input' value={email} onChange={e => setEmail(e.target.value)} />
                                <ContinueButton twoStep={true} active={true} text={'Add as Admin'} onClick={addAdmin} />
                            </div>
                        </div>
                        <div style={{ background: 'white', padding: '16px', borderRadius: '16px' }} >
                            Download Keys
                            <div style={{ width: '100%', background: 'lightgrey', height: '1px', position: 'relative', marginTop: '12px' }} />
                            <div className='space-between' style={{ margin: '16px' }} >
                                <ContinueButton twoStep={true} active={true} text={'Public'} onClick={downloadPublicKey} />
                                <ContinueButton twoStep={true} active={true} text={'Private'} onClick={downloadPrivateKey} />
                                {/* <a className='continue-button' onClick={downloadPublicKey}>Public</a>
                                <a className='continue-button' onClick={downloadPrivateKey}>Private</a> */}
                            </div>
                        </div>
                        <div style={{ background: 'white', padding: '16px', borderRadius: '16px' }} >
                            INVALIDATE KEYS
                            <div style={{ width: '100%', background: 'lightgrey', height: '1px', position: 'relative', marginTop: '12px' }} />
                            <div className='space-between' style={{ margin: '16px' }} >
                                <ContinueButton twoStep={true} active={true} text={'Reset Keys'} onClick={resetKeys} />
                            </div>
                        </div>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

export default Settings