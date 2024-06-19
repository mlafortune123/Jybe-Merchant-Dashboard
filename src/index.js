import React from "react";
import ReactDOMClient from "react-dom/client";
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import ReactGA from 'react-ga4';
import { Auth0Provider } from '@auth0/auth0-react';

if (process.env.REACT_APP_API_URL == "https://api.jybe.ca") ReactGA.initialize('G-8LD765N85S');
const app = document.getElementById("root");
const root = ReactDOMClient.createRoot(app);
const domain = process.env.REACT_APP_DOMAIN;
const clientId = process.env.REACT_APP_CLIENT_ID;

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
