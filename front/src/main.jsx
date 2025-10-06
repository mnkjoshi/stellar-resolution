import React from "react";
import ReactDOM from "react-dom/client";

import "./stylesheets/root.css";

import Root from "./routes/root.jsx";
import ErrorPage from "./routes/error.jsx";
import App from "./routes/app.jsx";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        errorElement: <ErrorPage />,
    },
    {
        path: "/app",
        element: <App />,
        errorElement: <ErrorPage />,
    },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);
