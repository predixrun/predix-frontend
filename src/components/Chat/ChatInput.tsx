import React from "react";
import { ChatInputProps } from "./chatTypes";



const ChatInput: React.FC<ChatInputProps> = ({
  sendMessage,
  inputText,
  setInputText,
  loading,
}) => {
  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(event.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="p-4  bg-custom-dark mx-auto w-[700px] rounded-lg border-2 border-[#2C2C2C] mt-10 mb-5">
      <div className="flex flex-col h-full">
        <textarea
          className="p-3 rounded-lg resize-none"
          value={inputText}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Send a message"
          rows={1}
          disabled={loading}
        />
        {!loading ? (
          <div className="flex justify-between mt-2">
            <div></div>
            <button
              className="px-3 py-3 bg-[#2C2C2C] rounded-lg cursor-pointer"
              onClick={sendMessage}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="size-4"
              >
                <path
                  fillRule="evenodd"
                  d="M8 14a.75.75 0 0 1-.75-.75V4.56L4.03 7.78a.75.75 0 0 1-1.06-1.06l4.5-4.5a.75.75 0 0 1 1.06 0l4.5 4.5a.75.75 0 0 1-1.06 1.06L8.75 4.56v8.69A.75.75 0 0 1 8 14Z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        ) : (
          <div className="bg-opacity-50 w-full h-full fixed top-0 left-0 backdrop-blur-[1px]">
            <div className="rounded-lg shadow-[0_0_10px_#ffffff] fixed top-4/5 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90px] h-[90px] bg-black p-5 text-white items-center flex justify-center">
              <div className="loading-spinner loading-spinner--js"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInput;
