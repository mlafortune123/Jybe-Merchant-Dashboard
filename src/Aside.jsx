import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import home from "./images/Home.svg";
import wallet from "./images/Wallet.svg";
import calender from "./images/Calendar.svg";
import chat from "./images/Chat.svg";
import settings from "./images/settings.svg"
import saving from "./images/saving.svg";
import logoutimg from "./images/logout.svg"
import logo from "./images/logo.svg"
import settlement from "./images/settlement.svg"
import { useAuth0 } from '@auth0/auth0-react';
import { slide as Menu } from 'react-burger-menu'
export const Aside = () => {
  const { logout } = useAuth0();
  const [isOpen, setIsOpen] = useState(false)
  return (
    <div style={{paddingTop:'2vh', background:'rgba(255, 255, 255, 0.5)', width:'200px' }} >
        <div className="logo" style={{height:'52.5px', alignContent:'center' }} >
          <img src={logo} alt="logo" />
        </div>
        <div className="pages-wrapper">
        <div>
          <div className={`page-link ${window.location.pathname === '/' ? 'active' : ''}`}>
            {window.location.pathname === '/' && <div className="border" />}
            <Link to="/">
              <img className="ma-img" src={home} alt="svg" /> Dashboard
            </Link>
          </div>

          <div className={`page-link ${window.location.pathname === '/subscriptions' ? 'active' : ''}`}>
            {window.location.pathname === '/subscriptions' && <div className="border" />}
            <Link to="/subscriptions">
              <img className="ma-img" src={calender} alt="svg" />
              Subscriptions
            </Link>
          </div>

          <div className={`page-link ${window.location.pathname === '/settlements' ? 'active' : ''}`}>
            {window.location.pathname === '/settlements' && <div className="border" />}
            <Link to="/settlements">
              <img className="ma-img" src={settlement} alt="svg" />
              Settlements
            </Link>
          </div>

        </div>
        <div >
          <div className="page-link">
            <a onClick={() => window.open("mailto:michaeltiller@jybe.ca")}>
              <img className="ma-img" src={chat} alt="svg" />
              Email Support
            </a>
          </div>
          <div className={`page-link ${window.location.pathname === '/settings' ? 'active' : ''}`}>
            {window.location.pathname === '/settings' && <div className="border" />}
            <Link to="/settings">
              <img className="ma-img" src={settings} alt="svg" />
              Settings
            </Link>
          </div>
        </div>
        <div className="page-link" >
          <a
            className="design-component-instance-node"
            icon="false"
            size="lg"
            state="default"
            text="Log Out"
            type="primary"
            onClick={() => logout({
              logoutParams: {
                returnTo: window.location.origin
              }
            })}
          >
            <img className="ma-img" src={logoutimg} />
            Log Out
          </a>
        </div>
      </div>
      <div className="hamburger-please" >
      <Menu isOpen={isOpen} >
        <div className="logo">
          <img src={logo} alt="logo" />
          {/* <p style={{textAlign:'center', marginTop: '10px' }} >Merchant Dashboard</p> */}
        </div>
        <div style={{ marginTop: '-5vh' }} >
          <div className={`page-link ${window.location.pathname === '/' ? 'active' : ''}`}>
            {window.location.pathname === '/' && <div className="border" />}
            <Link to="/">
              <img className="ma-img" src={home} alt="svg" /> Dashboard
            </Link>
          </div>

          <div className={`page-link ${window.location.pathname === '/subscriptions' ? 'active' : ''}`}>
            {window.location.pathname === '/subscriptions' && <div className="border" />}
            <Link to="/subscriptions">
              <img className="ma-img" src={calender} alt="svg" />
              Subscriptions
            </Link>
          </div>

          <div className={`page-link ${window.location.pathname === '/settlements' ? 'active' : ''}`}>
            {window.location.pathname === '/settlements' && <div className="border" />}
            <Link to="/settlements">
              <img className="ma-img" src={settlement} alt="svg" />
              Settlements
            </Link>
          </div>

        </div>
        <div >
          <div className="page-link">
            <a onClick={() => window.open("mailto:michaeltiller@jybe.ca")}>
              <img className="ma-img" src={chat} alt="svg" />
              Email Support
            </a>
          </div>
          <div className={`page-link ${window.location.pathname === '/settings' ? 'active' : ''}`}>
            {window.location.pathname === '/settings' && <div className="border" />}
            <Link to="/settings">
              <img className="ma-img" src={settings} alt="svg" />
              Settings
            </Link>
          </div>
        </div>
        <div className="page-link" >
          <a
            className="design-component-instance-node"
            icon="false"
            size="lg"
            state="default"
            text="Log Out"
            type="primary"
            onClick={() => logout({
              logoutParams: {
                returnTo: window.location.origin
              }
            })}
          >
            <img className="ma-img" src={logoutimg} />
            Log Out
          </a>
        </div>
      </Menu>
      </div>
    </div>
  );
};
