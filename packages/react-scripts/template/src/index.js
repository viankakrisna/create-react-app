import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import ServiceWorkerUtils from 'react-dev-utils/ServiceWorkerUtils';

ReactDOM.render(<App />, document.getElementById('root'));

ServiceWorkerUtils.register({
  swUrl: `${process.env.PUBLIC_URL}/service-worker.js`,
});
