import React, { useEffect } from "react";
import moment from "moment";
import Markdown from 'react-markdown'
import Prism from 'prismjs'

// Message component displays a single chat message
const Message = ({ message }) => {

  // Highlight code blocks in markdown when message content changes
  useEffect(()=>{
    Prism.highlightAll()
  },[message.content])

  return (
    <div>
      {/* Render user message on the right */}
      {message.role == "user" ? (
        <div className="flex items-start justify-end my-4 gap-3 mr-10">
          <div
            className="flex flex-col gap-2 p-2 px-4 bg-slate-50
             dark:bg-gray-500/30
             border border-[#72609f]/30
             rounded-md max-w-2xl     
            "
          >
            {/* Display user message content */}
            <p className="text-sm
              dark:text-amber-50
            ">{message.content}</p>

            {/* Display relative timestamp */}
            <span className="text-xs text-gray-500
             dark:text-[#9daec4]
             ">{moment(message.timestamp).fromNow()}</span>
          </div>
        </div>
      ) : (
        // Render assistant message on the left
        <div
          className="inline-flex flex-col gap-2 p-2 px-4 bg-slate-50
           dark:bg-gray-500/30
           border border-[#72609f]/30
           rounded-md max-w-2xl     
          "
        >

          {/* If the message is an image, render the image */}
          {message.isImage ?(
            <img src={message.content}  alt="img" className="w-full max-w-md mt-2 rounded-md" />
          ) :
            // Otherwise, render markdown content
            <div className="text-sm
              dark:text-amber-50 reset-tw
            ">
              <Markdown>{message.content}</Markdown> 
            </div>
          }

          {/* Display relative timestamp */}
          <span className="text-xs text-gray-500
           dark:text-[#9daec4]
           ">{moment(message.timestamp).fromNow()}</span>
        </div>
      )}
    </div>
  );
};

export default Message;
