import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
// import { QueryClient, QueryClientProvider } from 'react-query';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';


const queryClient = new QueryClient();

// Create a client
// const queryClient = new QueryClient({
//   defaultOptions: {
//     // queries: {
//     //   refetchOnWindowFocus: true, // default: true ---> true | false,
//     //   // retryDelay: (attemptIndex) => Math.min(1000 * 2 * attemptIndex, 30000), // Global Retry
//     //   // gcTime: 1000 * 60 * 60 * 24, // will clear data after 24 hrs
//     // },
//   },
// })

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>,

  // <React.StrictMode>
  //   <App />
  // </React.StrictMode>
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
