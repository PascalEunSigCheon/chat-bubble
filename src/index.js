import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { motion, AnimatePresence } from "framer-motion";

function ChatBubble() {

  const [messages, setMessages] = React.useState({
    allMessages: [],
    currentMessage: "",
    messageCnt: 0
  });

  const currentMessageRef = React.createRef(null);

  function handleInput(){
    setMessages((prevState) => ({
      ...prevState,
      currentMessage: currentMessageRef.current.textContent
    }))
    document.getElementById("current-message").className = "current-message-typing";
  }

  React.useEffect(() => {
    function handleKeyDown(event){
      if (event.key === "Enter" && currentMessageRef.current.innerText.trim() === ""){
        event.preventDefault();
      }
    }

    const divRef = currentMessageRef.current;

    if (divRef){
      divRef.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      if (divRef){
        divRef.removeEventListener("keydown", handleKeyDown);
      }
    };

  }, [currentMessageRef])

  React.useEffect(() => {
    if (currentMessageRef.current.textContent === ""){
      document.getElementById("current-message").className = "current-message-not-typing";
    }
  }, [currentMessageRef]) 

  React.useEffect(() => {
    function handleSubmit (event){
      if (event.key === "Enter" && messages.currentMessage.trim() !== ""){
        event.preventDefault();

        const id = Date.now();
        // const newMessage = {id, kk}


        setMessages((prevState) => ({
          currentMessage: "",
          allMessages: [...prevState.allMessages, {id, existing: false, text: prevState.currentMessage}],
          messageCnt: prevState.messageCnt + 1
        }));
        currentMessageRef.current.textContent = "";
        document.getElementById("current-message").className = " current-message-not-typing";

        setTimeout(() => {
          setMessages((prevState) => ({
            ...prevState,
            // allMessages: prevState.allMessages.map(msg => 
            //   msg.id === id ? { ...msg, existing: true } : msg
            // )
            allMessages: prevState.allMessages.filter(msg => msg.id !== id)
          }));
        }, 10000);
      }
    }
    window.addEventListener("keydown", handleSubmit);
    return () => {
      window.removeEventListener("keydown", handleSubmit);
    }
  }, [messages.currentMessage, currentMessageRef]);

  React.useEffect(() => {
    const currentMessageEl = document.getElementById("current-message");
    currentMessageEl.focus();
    currentMessageEl.onblur = function (event){
      var blurEl = this;
      setTimeout(function() {
        blurEl.focus()
      }, 10);
    }
  }, []);
  
  return (
  <div id="chat-container">
    <div id="all-messages">
      <div id="past-messages">
        {messages.allMessages.length > 0 && ( 
        <AnimatePresence>
        {
        messages.allMessages.map((message, index) => (
          <motion.div
            layout
            key={message.id}
            initial={{ y: 40 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 15, duration: 0.2 }}
            className='chat-bubble-container'
          >
            <div className='chat-bubble-white'>{message.text}</div>
          </motion.div>
        ))
        }
        </AnimatePresence>
        )}
      </div>
      <div 
        id="current-message" 
        className="current-message-not-typing" 
        ref={currentMessageRef} 
        contentEditable="true"
        onInput={handleInput}
      ></div>
    </div>
  </div>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ChatBubble />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
