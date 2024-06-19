const ContinueButton = ({ active, onClick, text }) => {
    return (
        <button className="continue-button" active={active} onClick={active && onClick} type="button" style={{backgroundColor: active ? '#243B6C' : '#c9cacc' }} >
            {text ? text : "Continue"}
            <div className="centersvg" >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M7.09327 3.69344C7.35535 3.46881 7.74991 3.49916 7.97455 3.76124L12.9745 9.59457C13.1752 9.82863 13.1752 10.174 12.9745 10.4081L7.97455 16.2414C7.74991 16.5035 7.35535 16.5338 7.09327 16.3092C6.83119 16.0845 6.80084 15.69 7.02548 15.4279L11.6768 10.0013L7.02548 4.57472C6.80084 4.31265 6.83119 3.91808 7.09327 3.69344Z" fill="white" />
                </svg>
            </div>
        </button>
    )
}

export default ContinueButton