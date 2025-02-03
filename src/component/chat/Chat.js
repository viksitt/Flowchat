import React, { useEffect, useState } from "react";
import { user } from "../join/Join";
import { io } from "socket.io-client";
import "./Chat.css";
import send from "../../images/send.png"; 
import upldicon from "../../images/upldicon.png"; // Add upload icon
import Message from "../Message/Message";
import ReactScrollToBottom from "react-scroll-to-bottom";
import axios from "axios";
import cicon from"../../images/cicon.png";

const ENDPOINT = "http://localhost:4500/";
let socket;

const Chat = () => {
    const [id, setId] = useState("");
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        socket = io(ENDPOINT, { transports: ["websocket"] });

        socket.on("connect", () => {
            setId(socket.id);
        });

        socket.emit("joined", { user });

        socket.on("welcome", (data) => {
            setMessages((prev) => [...prev, data]);
        });

        socket.on("userJoined", (data) => {
            setMessages((prev) => [...prev, data]);
        });

        socket.on("leave", (data) => {
            setMessages((prev) => [...prev, data]);
        });

        socket.on("sendMessage", (data) => {
            setMessages((prev) => [...prev, data]);
        });

        socket.on("receiveFile", (data) => {
            setMessages((prev) => [...prev, data]);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    const sendMessage = () => {
        const message = document.getElementById("chatinput").value;
        if (message.trim()) {
            socket.emit("message", { message });
            document.getElementById("chatinput").value = "";
        }
    };

    const sendFile = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await axios.post("http://localhost:4500/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            socket.emit("sendFile", { fileUrl: response.data.fileUrl, fileName: file.name });
        } catch (error) {
            console.error("File upload error:", error);
        }
    };

    return (
        <div className="chatpage">
            <div className="chatcont">
                <div className="chathead">
                    <h2>FlowChat</h2>
                    <a href="/"> <img src={cicon} alt="Close" /></a>
                </div>
                <ReactScrollToBottom className="chatbox">
                    {messages.map((item, i) =>
                        item.fileUrl ? (
                            <div key={i} className={item.id === id ? "right messageBox" : "left messageBox"}>
                                <strong>{item.user}:</strong>
                                <br />
                                <a href={item.fileUrl} target="_blank" rel="noopener noreferrer">
                                    📄 {item.fileName}
                                </a>
                            </div>
                        ) : (
                            <Message key={i} user={item.id === id ? "" : item.user} message={item.message} classs={item.id === id ? "right" : "left"} />
                        )
                    )}
                </ReactScrollToBottom>
                <div className="inputbox">
                    <input type="text" id="chatinput" placeholder="Type something..." onKeyPress={(event) => event.key === "Enter" ? sendMessage() : null} />
                    <button onClick={sendMessage} className="sendbtn">
                        <img src={send} alt="send" />
                    </button>
                    <input type="file" id="fileUpload" style={{ display: "none" }} onChange={sendFile} />
                    <button className="uploadbtn" onClick={() => document.getElementById("fileUpload").click()}>
                        <img src={upldicon} alt="Upload" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Chat;
