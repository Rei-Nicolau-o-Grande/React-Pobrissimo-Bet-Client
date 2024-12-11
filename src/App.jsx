import './App.css'
import {RouterProvider} from "react-router-dom";
import router from "./routes/router.jsx";
import {WalletProvider} from "./helper/WalletContext.jsx";

function App() {

  return (
    <>
        <WalletProvider>
            <RouterProvider router={router}/>
        </WalletProvider>
    </>
  )
}

export default App
