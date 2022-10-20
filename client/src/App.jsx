import './App.css';
import Auth from './pages/Auth/Auth';
import Home from './pages/home/Home';
import Profile from './pages/profile/Profile';

import {Routes, Route, Navigate} from "react-router-dom"
import { useSelector } from 'react-redux';
import People from "./pages/people/People"



function App() {
  const user = useSelector((state)=>{
    return state.authReducer.authData;
  });
  return (
    <div className="App">
        <Routes>
          <Route path="/" element={user?<Navigate to = "home"/> : <Navigate to = "auth"/>}/>
          <Route path = "/home" element={user?<Home />:<Navigate to = "../auth"/>}/>
          <Route path="/auth" element={user?<Navigate to = "../home"/> : <Auth />} />
          <Route path="/profile/:id" element={user?<Profile /> : <Navigate to="../auth"/>} />
          <Route path="/people/:id" element={user?<People /> : <Navigate to="../auth"/>} />
        </Routes>  
    </div>
  );
}

export default App;
