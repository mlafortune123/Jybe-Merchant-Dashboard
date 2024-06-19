import React from 'react';

const NotFoundPage = () => {
  return (
    <div style={{ textAlign: 'center', paddingTop: '100px' }}>
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      {/* You can add a link to your homepage or any other relevant page here */}
      <a href="/">Go to Home</a>
    </div>
  );
};

export default NotFoundPage;