import React from "react";
import Voting from "./component/Voting";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
    return (
        <div>
            <ToastContainer />
            <Voting />
        </div>
    );
};

export default App;
