import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Admin from './pages/Admin';
import NoPage from './pages/SignUp';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, RouterProvider} from 'react-router-dom';

const router = createBrowserRouter([
    {
        path: "/",
        element: <Admin />,
        errorElement: <NoPage />
    },
    {
        path: "/signup",
        element: <SignUp />,
        errorElement: <NoPage />
    },
    {
        path: "/signin",
        element: <SignIn />,
        errorElement: <NoPage />
    }
])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
       <RouterProvider router={router} />
  </React.StrictMode>
);

reportWebVitals();
