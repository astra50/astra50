import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as Sentry from '@sentry/browser';

Sentry.init({
    dsn: "https://90a208b4e6584767a6bac866c6419493@sentry.automagistre.ru/9",
    environment: process.env.NODE_ENV,
});

ReactDOM.render(
    <React.StrictMode>
        <App/>
    </React.StrictMode>,
    document.getElementById('root'),
);
