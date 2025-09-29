import React, { useState, useEffect, useRef } from "react";
import chatAudio from "/chat2.mp3";
import { ToastContainer, toast } from "react-toastify";

function ChatWindow({ socket, name, roomID, msgList, setMsgList }) {
  const [currentMsg, setCurrentMsg] = useState("");
  const chatEndRef = useRef(null);

  const [typing, setTyping] = useState(false);
  const [typingText, setTypingText] = useState("");

  const notification = new Audio(chatAudio);

  // auto scroll to bottom when messages update
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgList]);

  useEffect(() => {
    socket.on("receiveMessage", (msgData) => {
      setMsgList((prev) => [...prev, msgData]);
      setTyping(false);
      notification.play();
    });

    socket.on("typing", (data) => {
      setTyping(true);
      setTypingText(data);
      const timer = setTimeout(() => {
        setTyping(false);
        setTypingText("");
      }, 2000);
      return () => clearTimeout(timer);
    });

    socket.on("systemMessage", (msg) => {
      toast(msg.text);
      setMsgList((prev) => [
        ...prev,
        {
          isJoinLeft: true,
          text: msg.text,
        },
      ]);
    });

    return () => {
      socket.off("receiveMessage");
      socket.off("typing");
      socket.off("systemMessage");
    };
  }, [socket]);

  // send typing event
  function handleTyping(e) {
    setCurrentMsg(e.target.value);
    socket.emit("typing", `${name} is typing...`);
  }

  // send message
  async function handleSendMsg() {
    if (!currentMsg.trim()) return;

    const msgData = {
      author: name,
      room: roomID,
      id: Date.now(),
      time:
        (new Date(Date.now()).getHours() % 12) +
        ":" +
        new Date(Date.now()).getMinutes(),
      message: currentMsg,
    };

    await socket.emit("chatMessage", msgData);

    notification.play();
    setCurrentMsg("");
  }

  return (
    <div className="h-screen w-full bg-gradient-to-br from-gray-900 via-gray-800 to-black flex flex-col items-center justify-center">
      {/* Container */}
      <div className="w-[90%] sm:w-[500px] h-[80%] bg-gray-900 border border-gray-700 shadow-2xl rounded-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="h-14 bg-gray-800 border-b border-gray-700 flex items-center justify-center text-white font-bold">
          Welcome, <span className="text-indigo-400 ml-1">{name}</span> &nbsp;👋
        </div>

        {/* Chats Container */}
        <div className="chatsContainer flex-1 p-4 overflow-y-auto space-y-3">
          <div key={12554568} className={`flex justify-start`}>
            <div
              className={`max-w-[70%] min-w-[20%] px-4 py-2 rounded-lg shadow-md text-sm 
                  bg-gray-700 text-gray-200 rounded-bl-none
                `}
            >
              <p className="font-semibold text-xs ">
                <i>System </i>
              </p>
              <p>Dear {name} be friendly & respectful with other !!</p>
              <div className="text-[10px] text-gray-300  flex w-full items-center justify-end">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-3 w-3 mr-1"
                >
                  <path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM13 12H17V14H11V7H13V12Z"></path>
                </svg>

                {(new Date(Date.now()).getHours() % 12) +
                  ":" +
                  new Date(Date.now()).getMinutes()}
              </div>
            </div>
          </div>

          {msgList.map((item) =>
            item.isJoinLeft ? (
              <h3 className="text-center text-xs text-zinc-300">{item.text}</h3>
            ) : (
              <div
                key={item.id}
                className={`flex ${
                  item.author === name ? "justify-end" : "justify-start"
                } fade-up`}
              >
                <div
                  className={`max-w-[70%] min-w-[20%] px-4 py-2 rounded-lg shadow-md text-sm ${
                    item.author === name
                      ? "bg-indigo-600 text-white rounded-br-none message-pop"
                      : "bg-gray-700 text-gray-200 rounded-bl-none message-pop"
                  }`}
                >
                  <p className="font-semibold text-xs">
                    <i>{item.author} </i>
                  </p>
                  <p className="w-full break-words">{item.message}</p>
                  <div className="text-[10px] text-gray-300 flex w-full items-center justify-end">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-3 w-3 mr-1"
                    >
                      <path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM13 12H17V14H11V7H13V12Z"></path>
                    </svg>
                    {item.time}
                  </div>
                </div>
              </div>
            )
          )}

          {typing && (
            <div className="text-gray-400 text-xs italic">{typingText}</div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input Section */}
        <div className="h-14 bg-gray-800 border-t border-gray-700 flex items-center px-3">
          <input
            type="text"
            placeholder="Type a message..."
            onChange={handleTyping}
            value={currentMsg}
            onKeyDown={(e) => e.key === "Enter" && handleSendMsg()}
            className="flex-1 h-10 rounded-lg px-3 bg-gray-700 text-gray-200 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          />
          <button
            onClick={handleSendMsg}
            className="ml-3 flex items-center justify-center bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 hover:from-blue-600 hover:via-indigo-600 hover:to-purple-700 w-10 h-10 rounded-full shadow-md text-white transition-transform active:scale-95"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path d="M1.94607 9.31543C1.42353 9.14125 1.4194 8.86022 1.95682 8.68108L21.043 2.31901C21.5715 2.14285 21.8746 2.43866 21.7265 2.95694L16.2733 22.0432C16.1223 22.5716 15.8177 22.59 15.5944 22.0876L11.9999 14L17.9999 6.00005L9.99992 12L1.94607 9.31543Z"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatWindow;
