// IntermediateScreen.js
import React from 'react';
import { Button } from "./Button";
// import { Footer } from "./Footer.js"
// import { Navbar } from "./Navbar.js";
import { useAuth0 } from '@auth0/auth0-react';
import "./denied.css"
import ContinueButton from './ContinueButton';
const IntermediateScreen = () => {
    const { loginWithRedirect } = useAuth0();

    const handleContinue = () => {
        loginWithRedirect({
            openUrl: () => window.location.replace(`/`),
            authorizationParams: {
                prompt: 'select_account'
            }
        })
    };

    return (
        <div className="intermediate">
            <img
                className="no-internet"
                alt="No internet"
                src="https://s3.amazonaws.com/app.jybe.ca/sadelephant.png"
            />
            <p className="oh-no-sorry-you-do">
                <span className="text-wrapper">Please check your inbox for a verification email then click continue</span>
            </p>
            <div className="button-wrapper">
                <ContinueButton
                    active={true}
                    text="Continue"
                    onClick={handleContinue}
                />
            </div>
        </div>
    );
};

export default IntermediateScreen;