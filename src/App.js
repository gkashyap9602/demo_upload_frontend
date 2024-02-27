// import logo from './logo.svg';
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css"

import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css";

import { Images } from './Components/Images';
function App() {
  return (
    <div className="App">
    <ToastContainer  progressClassName="toastProgress" bodyClassName="toastBody"/>
      <Images/>
    </div>
  );
}

export default App;
