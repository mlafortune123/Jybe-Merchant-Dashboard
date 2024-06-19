import React from "react";
import { Link } from "react-router-dom";
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
//import saved from "../images/yearly-saved.svg";
export const Aside = () => {
  const { logout } = useAuth0();
  return (
    <div class="pages-wrapper">
      <div className="logo">
        <img src={logo} alt="logo" />
        <p style={{textAlign:'center', marginTop: '10px' }} >Merchant Dashboard</p>
      </div>
      <div>
        <div className={`page-link ${window.location.pathname === '/' ? 'active' : ''}`}>
          {window.location.pathname === '/' && <div class="border" />}
          <Link to="/">
            <img className="ma-img" src={home} alt="svg" /> Dashboard
          </Link>
        </div>

        <div class={`page-link ${window.location.pathname === '/subscriptions' ? 'active' : ''}`}>
          {window.location.pathname === '/subscriptions' && <div class="border" />}
          <Link to="/subscriptions">
            <img className="ma-img" src={calender} alt="svg" />
            Subscriptions
          </Link>
        </div>

        <div class={`page-link ${window.location.pathname === '/settlements' ? 'active' : ''}`}>
          {window.location.pathname === '/settlements' && <div class="border" />}
          <Link to="/settlements">
            <img className="ma-img" src={settlement} alt="svg" />
            Settlements
          </Link>
        </div>

      </div>
      <div >
        <div class="page-link">
          <a onClick={() => window.open("mailto:michaeltiller@jybe.ca")}>
            <img className="ma-img" src={chat} alt="svg" />
            Get Help
          </a>
        </div>
        <div class={`page-link ${window.location.pathname === '/settings' ? 'active' : ''}`}>
          {window.location.pathname === '/settings' && <div class="border" />}
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
      {/* <div class="yousaved">
        <div>
          <img className="ma-img" src={saving} alt="svg" />
          <p>
            You've saved <span>${totalSavings.toFixed(2)}</span> to date
          </p>
        </div>
        <div>
          <img className="ma-img" src={saved} alt="svg" />
          <p>
            You've saved <span>$567</span> Yearly
          </p>
        </div>
      </div> */}
    </div>
  );
};
