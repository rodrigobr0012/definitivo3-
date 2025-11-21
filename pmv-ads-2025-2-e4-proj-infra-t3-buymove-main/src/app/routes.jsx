import { createBrowserRouter } from "react-router-dom";
import App from "@/App";
import Home from "@/pages/Home";
import Catalog from "@/pages/Catalog";
/*import VehicleDetails from "@/pages/VehicleDetails";*/
import Favorites from "@/pages/Favorites";
import Profile from "@/pages/Profile";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";
import VehicleCreate from "@/pages/VehicleCreate";
import MyVehicles from "@/pages/MyVehicles";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "catalog", element: <Catalog /> },
      { path: "vehicle/new", element: <VehicleCreate /> },
      { path: "my-vehicles", element: <MyVehicles /> },
      /*{ path: "vehicle/:id", element: <VehicleDetails /> },*/
      { path: "favorites", element: <Favorites /> },
      { path: "profile", element: <Profile /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "forgot-password", element: <ForgotPassword /> },
      { path: "reset-password", element: <ResetPassword /> },
    ],
  },
]);
