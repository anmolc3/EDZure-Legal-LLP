import React from 'react';
import { Helmet } from 'react-helmet-async';
import Breadcrumb from '../common/Breadcrumb';

const CMS = () => {
  return (
    <>
      <Helmet>
        <title>CMS - EdZure Legal LLP</title>
        <meta name="description" content="Case Management System" />
      </Helmet>
      <Breadcrumb />
      <div className="page-container">
        <div className="container">
          <h1>Case Management System (CMS)</h1>
          <p>
            Our advanced Case Management System streamlines the entire case lifecycle,
            from initial consultation to final resolution.
          </p>
          <h3>Key Features:</h3>
          <ul>
            <li>Centralized case tracking</li>
            <li>Document management</li>
            <li>Deadline and task management</li>
            <li>Client communication portal</li>
            <li>Reporting and analytics</li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default CMS;