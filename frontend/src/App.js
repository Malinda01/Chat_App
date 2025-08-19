import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:5000");

function App() {
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState("");
  const [text, setText] = useState("");

  useEffect(() => {
    // Load old messages
    axios
      .get("http://localhost:5000/messages")
      .then((res) => setMessages(res.data));

    // Listen for new messages
    socket.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => socket.off("receiveMessage");
  }, []);

  const sendMessage = () => {
    if (user && text) {
      const msg = { user, text };
      socket.emit("sendMessage", msg);
      setText("");
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">💬 Chat App</h1>

      <input
        placeholder="Your name..."
        value={user}
        onChange={(e) => setUser(e.target.value)}
        className="border p-2 w-full mb-2"
      />

      <div className="border p-4 h-64 overflow-y-auto mb-2 bg-gray-50">
        {messages.map((msg, i) => (
          <div key={i} className="mb-1">
            <strong>{msg.user}: </strong>
            {msg.text}
          </div>
        ))}
      </div>

      <div className="flex">
        <input
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="border p-2 flex-1"
        />
        <button onClick={sendMessage} className="bg-blue-500 text-white px-4">
          Send
        </button>
      </div>
    </div>
  );
}

export default App;
