import "./App.css";
import { io } from "socket.io-client";
import { useEffect, useMemo, useState } from "react";
import { Button, Container, Stack, TextField, Typography } from "@mui/material";

function App() {
  
  const socket = useMemo(
    () =>
      io("http://localhost:4848", {
        withCredentials: true,
      }),
    []
  );

  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [socketId, setSocketID] = useState("");
  const [messages, setMessages] = useState([]);
  const [roomName, setRoomName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("message", { message, room });
    setMessage("");
  };


  const handleJoinSubmit = (e) => {
    e.preventDefault();
    socket.emit("join-room", roomName);
  };

  useEffect(() => {
    socket.on("connect", (msg) => {
      console.log(msg);
      setSocketID(socket.id);
      console.log("connected", socket.id);
    });

    socket.on("receive-message", (msg) => {
      console.log(msg);
      setMessages((prevMsg) => [...prevMsg, msg]);
    });

    socket.on("welcome", (s) => {
      console.log(s);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <Container maxWidth="sm">
      <Typography variant="h6" component="div" gutterBottom>
        Welcome to Socket.io
      </Typography>
      <Typography variant="h5" component="div" gutterBottom>
        Welcome to {socketId}
      </Typography>
      <form onSubmit={handleJoinSubmit}>
        <h5>Join Room</h5>
        <TextField
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          id="outlined-basic"
          label=" Join Room Name"
          variant="outlined"
          color="primary"
          placeholder="Please enter your message..."
        />
        <Button variant="contained" color="secondary" type="submit">
          Send
        </Button>
      </form>
      <form onSubmit={handleSubmit}>
        <TextField
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          id="outlined-basic"
          label="Message"
          variant="outlined"
          color="primary"
          placeholder="Please enter your message..."
        />
        <TextField
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          id="outlined-basic"
          label="Room"
          variant="outlined"
          color="primary"
          placeholder="Please enter your message..."
        />
        <Button variant="contained" color="secondary" type="submit">
          Send
        </Button>
      </form>
      {messages?.map((message) => (
        <Stack>{message}</Stack>
      ))}
    </Container>
  );
}

export default App;
