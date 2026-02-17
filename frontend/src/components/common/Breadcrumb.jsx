import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Breadcrumb.css';

const Breadcrumb = ({ customPaths = [] }) => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(Boolean);

  const formatPathname = (name) =>
    name
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

  const breadcrumbPaths =
    customPaths.length > 0
      ? customPaths
      : pathnames.map((name, index) => ({
        name: formatPathname(name),
        path: `/${pathnames.slice(0, index + 1).join('/')}`,
      }));

  if (breadcrumbPaths.length === 0) return null;

  return (
    <div className="breadcrumb-wrapper">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <ol className="breadcrumb-list">

          {/* Home */}
          <li className="breadcrumb-item">
            <Link to="/">
              {/* Home icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              Home
            </Link>
          </li>

          {breadcrumbPaths.map((crumb, index) => {
            const isLast = index === breadcrumbPaths.length - 1;

            return (
              <React.Fragment key={crumb.path}>
                {/* Chevron separator */}
                <li className="breadcrumb-separator" aria-hidden="true">›</li>

                {/* Crumb */}
                <li
                  className={`breadcrumb-item ${isLast ? 'active' : ''}`}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {isLast ? (
                    <span>{crumb.name}</span>
                  ) : (
                    <Link to={crumb.path}>{crumb.name}</Link>
                  )}
                </li>
              </React.Fragment>
            );
          })}
        </ol>
      </nav>
    </div>
  );
};

export default Breadcrumb;