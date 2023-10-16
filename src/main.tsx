import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { createBrowserRouter, LoaderFunctionArgs, redirect, RouterProvider } from "react-router-dom";
import "./index.css";
import Root from "./routes/root.js";
import ErrorPage from "./error-page.js";
import Auth from "./components/Auth.js";
import Register from "./routes/register.js";
import Index from "./routes/index.js";
import { supabase } from "./helpers/supabase.js";

const router = createBrowserRouter([
  {
    path: "/",
    loader: protectedLoader,
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        errorElement: <ErrorPage />,
        children: [
          { index: true, element: <Index /> },
          {
            path: "app",
            element: <App />,
          },
        ],
      },
    ],
  },
  {
    path: "login",
    element: <Auth />,
  },
  {
    path: "register",
    element: <Register />,
  },
  {
    path: "/logout",
    async action() {
      // We signout in a "resource route" that we can hit from a fetcher.Form
      await supabase.auth.signOut();
      return redirect("/");
    },
  },
]);


async function protectedLoader({ request }: LoaderFunctionArgs) {
  // If the user is not logged in and tries to access a protected route, we redirect
  // them to `/login` with a `from` parameter that allows login to redirect back
  // to this page upon successful authentication
  if (!(await supabase.auth.getUser()).data.user) {
    const params = new URLSearchParams();
    params.set("from", new URL(request.url).pathname);
    return redirect("/login?" + params.toString());
  }
  return null;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
