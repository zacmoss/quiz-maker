import React from 'react';
import ReactDOM from 'react-dom';
import './style.css';
//import App from './App';
import AppRouter from './routers/AppRouter';

// Previously rendered the <App /> from App.js



// Here is where I probably pull in data from mongodb? And pass to <AppRouter />???

// Consider using Axios get requests to the server to do database operations.....

ReactDOM.render(<AppRouter />, document.getElementById('root'));