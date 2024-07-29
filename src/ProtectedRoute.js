import React, { createContext, useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import Loading from './Loading';
import { useNavigate } from "react-router-dom";
export const AccountContext = createContext();

export const ProtectedRoute = ({ component: Component }) => {
    const testing = window.location.origin.includes("testing") || window.location.origin.includes("localhost")
    //const testing = false
    const API_URL = testing ? process.env.REACT_APP_TESTING_API_URL : process.env.REACT_APP_PRODUCTION_API_URL
    const [orders, setOrders] = useState();
    const [merchant, setMerchant] = useState()
    const [payments, setPayments] = useState()
    const [admins, setAdmins] = useState()
    const [reserves, setReserves] = useState()
    const [frozen, setFrozen] = useState()
    // const [activeOrders, setActiveOrders] = useState()
    // const [inactiveOrders, setInactiveOrders] = useState()
    const { isAuthenticated, isLoading, loginWithRedirect, getAccessTokenSilently, getIdTokenClaims, user, logout } = useAuth0();
    const [accessToken, setAccessToken] = useState()
    const [refreshToken, setRefreshToken] = useState()
    const [isDone, setIsDone] = useState(false)
    const navigate = useNavigate();

    useEffect(() => {
        if (window.location.search.includes('?error=access_denied&error_description=Please%20verify%20your%20email%20before%20continuing.')) {
            navigate("/IntermediateScreen")
        }
    })

    useEffect(() => {
        async function backOnMyBullshit() {
            const token = await getAccessTokenSilently();
            const { __raw: idToken } = await getIdTokenClaims();
            setAccessToken(token)
            accessToken && fetch(`${API_URL}/adminget`, {
                method: "GET",
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'X-ID-Token': idToken
                }
            })
                .then(response => {
                    if (response.status == 401) logout({
                        logoutParams: {
                            returnTo: window.location.origin
                        }
                    })
                    if (response.status == 403) logout({
                        logoutParams: {
                            returnTo: window.location.origin
                        }
                    })
                    if (response.status === 500 || response.status === 502) window.alert("The requested service is currently unavailable at the moment.")
                    return response.json()
                })
                .then(async res => {
                    if (res.error) {
                        window.alert(res.error)
                    }
                    else {
                        //const updatedInfo = await Promise.all(res.orders.map(calculateMonthsDifference));
                        setOrders(res.orders);
                        setMerchant(res.merchant)
                        setPayments(res.payments)
                        setAdmins(res.admins)
                        setIsDone(true)
                    }
                })

            accessToken && fetch(`${API_URL}/checkReserves`, {
                method: "GET",
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            })
                .then(response => {
                    if (response.status == 401) window.location.reload()
                    if (response.status == 403) navigate("/")
                    if (response.status === 500 || response.status === 502) window.alert("The requested service is currently unavailable at the moment.")
                    return response.json()
                })
                .then(res => {
                    if (res.error) {
                        window.alert(res.error)
                    }
                    else {
                        setReserves(res.res.reserves)
                        setFrozen(res.res.frozen)
                    }
                })
        }
        backOnMyBullshit()
    }, [accessToken, refreshToken])

    const calculateMonthsDifference = async (item) => {
        const itemDate = new Date(item.order_created_at);
        const oneYearLater = new Date(itemDate);
        oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);
        const currentDate = new Date();
        const monthsDifference = (oneYearLater.getFullYear() - currentDate.getFullYear()) * 12 + (oneYearLater.getMonth() - currentDate.getMonth());
        itemDate.setMonth(currentDate.getMonth());
        itemDate.setFullYear(currentDate.getFullYear());
        return { ...item, monthsDifference, itemDate: itemDate.toISOString().slice(0, 10) };
    };

    const refreshTheClock = () => {
        setRefreshToken(token => !token)
    }

    if (window.location.search.includes('?error=access_denied&error_description=Please%20verify%20your%20email%20before%20continuing.')) {
        navigate("/IntermediateScreen?noerror")
    }
    else if (isAuthenticated) {
        if (isLoading || !isDone) {
            return <Loading />; // Render a loading indicator while authentication state is being determined
        }
        else return (
            <AccountContext.Provider value={{ orders, merchant, user, accessToken, navigate, payments, admins, frozen, refreshTheClock, API_URL }}>
                <Component />
            </AccountContext.Provider>
        ); // User is authenticated, render the component
    }
    else loginWithRedirect({
        authorizationParams: {
            prompt: 'select_account'
        }
    })
}