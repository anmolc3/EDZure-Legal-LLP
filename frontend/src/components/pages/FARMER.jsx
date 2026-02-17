import React from 'react';
import { Helmet } from 'react-helmet-async';
import Breadcrumb from '../common/Breadcrumb';

const FARMER = () => {
  return (
    <>
      <Helmet>
        <title>FARMER - EdZure Legal LLP</title>
        <meta name="description" content="Financial And Risk Management for Enhanced Returns" />
      </Helmet>
      <Breadcrumb />
      <div className="page-container">
        <div className="container">
          <h1>FARMER</h1>
          <h2>Financial And Risk Management for Enhanced Returns</h2>
          <p>
            Our FARMER service provides comprehensive financial and risk management solutions
            tailored to optimize your returns while minimizing potential risks.
          </p>
          <h3>Services Include:</h3>
          <ul>
            <li>Risk assessment and mitigation strategies</li>
            <li>Financial planning and analysis</li>
            <li>Compliance and regulatory guidance</li>
            <li>Investment portfolio management</li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default FARMER;