import React from 'react';
import { Helmet } from 'react-helmet-async';
import Breadcrumb from '../common/Breadcrumb';

const LKS = () => {
  return (
    <>
      <Helmet>
        <title>LKS - EdZure Legal LLP</title>
        <meta name="description" content="Legal Knowledge System" />
      </Helmet>
      <Breadcrumb />
      <div className="page-container">
        <div className="container">
          <h1>Legal Knowledge System (LKS)</h1>
          <p>
            Our Legal Knowledge System provides comprehensive legal information and resources
            to help you navigate complex legal matters.
          </p>
          <h2>Features</h2>
          <ul>
            <li>Extensive legal database</li>
            <li>Case law research tools</li>
            <li>Legal document templates</li>
            <li>Regular updates on legal changes</li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default LKS;