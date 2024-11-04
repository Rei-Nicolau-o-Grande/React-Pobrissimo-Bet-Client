import {createBrowserRouter} from "react-router-dom";
import Home from "../pages/home/Home.jsx";
import User from "../pages/user/User.jsx";
import ProtectedRoutes from "../helper/protected-routes.jsx";
import Admin from "../pages/admin/Admin.jsx";
import {RoletaPicanha} from "../pages/game/roleta_da_picanha/RoletaPicanha.jsx";
import {Burrinho} from "../pages/game/burrinho/Burrinho.jsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Home/>
    },
    {
        element: <ProtectedRoutes allowedRoles={["Player"]}/>,
        children: [
            {
                path: "/user",
                element: <User/>
            },
            {
                path: "/game/roleta-da-picanha",
                element: <RoletaPicanha/>,
            },
            {
                path: "/game/burrinho",
                element: <Burrinho/>,
            }
        ]
    },
    {
        element: <ProtectedRoutes allowedRoles={["Admin"]}/>,
        children: [
            {
                path: "/admin",
                element: <Admin/>
            }
        ]
    }
])

export default router;