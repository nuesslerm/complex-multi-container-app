import React from 'react';
import { Link } from 'react-router-dom';

const OtherPage = () => {
  return (
    <div>
      <div>I'm some other page!</div>
      <Link to="/">Go back home</Link>
    </div>
  );
};

export default OtherPage;
