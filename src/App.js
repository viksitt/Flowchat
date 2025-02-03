import socketio from 'socket.io-client';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Join from './component/join/Join.js'; // Ensure the component is correctly imported
import Chat from './component/chat/Chat.js';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Join />} />
          <Route path="/chat" element={<Chat />} />

        </Routes>
      </Router>
    </div>
  );
}

export default App;

