import './App.css';
import {BrowserRouter,Routes,Route} from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navigation from './components/Navigation';
import Signup from './pages/Signup';
import Chat from './pages/Chat';
import Home from './pages/Home';
import Logins from './pages/Logins';
import {AppContext, socket } from './context/AppContext'
import {  useState } from 'react';


function App() {
  const [rooms, setRooms]=useState([]);
  const [currentRoom, setCurrentRoom]=useState([]);
  const [messages, setMessages]=useState([]);
  const [members, setMembers]=useState([]);
  const [privateMemberMsg, setPrivateMemberMsg]=useState({});
  const [newMessages, setNewMessages]=useState({});
  
  const user = useSelector((state)=> state.user)
  return (
<AppContext.Provider value={{ socket, currentRoom, setCurrentRoom, members, setMembers, messages,setMessages,privateMemberMsg,setPrivateMemberMsg,rooms,setRooms, newMessages,setNewMessages}}>
      <BrowserRouter>
      <Navigation/>
<Routes>
  <Route path="/" element={<Home/>}/>
  {!user && (
          <> 
            <Route path="/login" element={<Logins/>}/>
            <Route path="/signup" element={<Signup/>}/>
          </>

  )}
    <Route path="/chat" element={<Chat/>}/>
    
 
</Routes>
</BrowserRouter>
    
       </AppContext.Provider>
  );
}

export default App;
