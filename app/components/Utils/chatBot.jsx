"use client";
import { useState } from "react";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const handleButtonClick = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = () => {
    if (input.trim() !== "") {
      // Add the user's message to the chat
      setMessages([...messages, { sender: "user", text: input }]);
      setInput("");

      // Here you can implement the chatbot's response logic
      // For demonstration, we'll just echo the message
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "bot", text: `You said: ${input}` },
      ]);
    }
  };

  return (
    <div>
      <button
        onClick={handleButtonClick}
        className="fixed bottom-4 right-4 p-4 bg-blue-500 text-white rounded-full shadow-lg focus:outline-none"
      >
        {isOpen ? "Close Chat" : "Open Chat"}
      </button>
      {isOpen && (
        <div className="fixed bottom-16 right-4 w-80 max-h-96 bg-white border border-gray-300 rounded-lg flex flex-col shadow-lg">
          <div className="flex-1 overflow-y-auto p-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`my-2 flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`inline-block px-4 py-2 rounded-lg ${
                    message.sender === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-300 p-2 flex">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 p-2 border border-gray-300 rounded-l-lg focus:outline-none"
            />
            <button
              onClick={handleSendMessage}
              className="p-2 bg-blue-500 text-white rounded-r-lg"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
