import React, { useState } from "react";
import joinAudio from "/roomJoin.wav";

function JoinChat({socket, setData, setChatWindowHandler}) {
  
  const roomJoinAudio = new Audio(joinAudio);

  const handFormSubmit = (e) => {
    e.preventDefault();

    // get values from form inputs
    const formData = new FormData(e.target);
    const enteredName = formData.get("name");
    const enteredRoomID = formData.get("roomID");

    setData(enteredName, enteredRoomID);

    // Sending response to the server
    socket.emit("joinRoom", { username: enteredName, room: enteredRoomID });
    setChatWindowHandler(enteredName, enteredRoomID);
    roomJoinAudio.play();
  };

  return (
    <div className="h-screen w-full bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
      {/* Form Container */}
      <div className="w-80 bg-gray-900 border border-gray-700 shadow-xl rounded-2xl p-6">
        <h1 className="text-3xl text-center text-white font-extrabold mb-8 tracking-wide">
          🚀 Join Chat
        </h1>

        <form onSubmit={handFormSubmit} className="flex flex-col gap-5">
          {/* Name Field */}
          <div className="flex flex-col">
            <label className="text-sm text-gray-300 mb-1 font-medium">
              Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              className="h-11 w-full border rounded-lg border-gray-600 bg-gray-800 text-gray-200 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>

          {/* Room Field */}
          <div className="flex flex-col">
            <label className="text-sm text-gray-300 mb-1 font-medium">
              Room ID
            </label>
            <input
              type="text"
              name="roomID"
              placeholder="Enter room ID"
              className="h-11 w-full border rounded-lg border-gray-600 bg-gray-800 text-gray-200 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="mt-4 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 hover:from-blue-600 hover:via-indigo-600 hover:to-purple-700 active:scale-95 transition-transform duration-150 text-white font-semibold h-11 rounded-lg shadow-md"
          >
            Join Room
          </button>
        </form>
      </div>
    </div>
  );
}

export default JoinChat;
