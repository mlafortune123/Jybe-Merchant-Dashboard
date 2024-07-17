import React from "react";
import logo from "./images/logo.svg";
import bars from "./images/bars.svg";
import { useAuth0 } from '@auth0/auth0-react';
import './phone.css'
export const Header = ({merchant_name}) => {
  const { logout, user } = useAuth0();
  return (
    <header className="header" >
      {/* <div class="header-leftside">
        <div class="logo"> */}
          <img src={logo} alt="logo" />
        {/* </div>
      </div> */}
      <div class="header-right-side">
        {/* <a href="/userinfo">Apply For More</a> */}
        <div style={{width:'100%'}} >
          {/* <div class="bell-img">
            <svg
              width="31"
              height="32"
              viewBox="0 0 31 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                id="Vector"
                d="M24.0993 14.5017C24.9861 22.5653 28.4737 25.0031 28.4737 25.0031H1C1 25.0031 5.57895 21.8032 5.57895 10.6012C5.57895 8.0554 6.54358 5.61309 8.26068 3.81286C9.97932 2.01263 12.31 1 14.7368 1C15.2512 1 15.7625 1.04501 16.2632 1.13502M17.3774 29.5036C17.1093 29.9587 16.7243 30.3365 16.2608 30.5991C15.7974 30.8618 15.2718 31 14.7368 31C14.2019 31 13.6763 30.8618 13.2129 30.5991C12.7494 30.3365 12.3643 29.9587 12.0963 29.5036M25.4211 10.0011C26.6355 10.0011 27.8001 9.52698 28.6589 8.68296C29.5176 7.83894 30 6.6942 30 5.50057C30 4.30695 29.5176 3.16221 28.6589 2.31819C27.8001 1.47417 26.6355 1 25.4211 1C24.2066 1 23.042 1.47417 22.1832 2.31819C21.3245 3.16221 20.8421 4.30695 20.8421 5.50057C20.8421 6.6942 21.3245 7.83894 22.1832 8.68296C23.042 9.52698 24.2066 10.0011 25.4211 10.0011Z"
                stroke="#1E265E"
                strokeOpacity="0.4"
                stroke-width="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div> */}
          <p>Merchant: {merchant_name}</p>
          <p>Admin: {user.email}</p>
        </div>
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
        >Log Out</a>
        {/* <img className="ma-img"
          src={bars}
          onClick={(e) => {
            document.querySelector(".pages-wrapper").classList.toggle("active");
          }}
          class="bars"
          alt=""
          style={{height:'3vh'}}
        /> */}
      </div>
    </header>
  );
};
