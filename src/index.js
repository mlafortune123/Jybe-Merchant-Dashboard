import React from "react";
import ReactDOMClient from "react-dom/client";
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import ReactGA from 'react-ga4';
import { Auth0Provider } from '@auth0/auth0-react';

const app = document.getElementById("root");
const root = ReactDOMClient.createRoot(app);
const testing = window.location.origin.includes("testing") || window.location.origin.includes("localhost")
//const testing = false
if (!testing) ReactGA.initialize('G-8LD765N85S');
const domain = testing ? process.env.REACT_APP_TESTING_DOMAIN : process.env.REACT_APP_PRODUCTION_DOMAIN
const clientId = testing ? process.env.REACT_APP_TESTING_CLIENT_ID : process.env.REACT_APP_PRODUCTION_CLIENT_ID

root.render(
  <React.StrictMode>
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        audience: 'https://api.jybe.ca',
        redirect_uri: window.location.origin + window.location.pathname + window.location.search,
      }}
    >
      <Router>
        <App />
      </Router>
    </Auth0Provider>
  </React.StrictMode>
);
