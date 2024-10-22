// App.js
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Admin from './components/Admin'
import Register from './components/Register';
import Login from './components/LogIn';
import UserApp from './components/UserApp';
import './App.css'


function App(){
return(
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin/*" element={<Admin />} />
        <Route path="/register" element={<Register />} />
        <Route path="/userapp" element={<UserApp />} />
      </Routes>
    </Router>
)
}

export default App;
