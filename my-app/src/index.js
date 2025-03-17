import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';

function HelloWorld() {

  const [messages, setMessages] = React.useState({
    currentMessage: "",
    previousMessage: "",
    messageCnt: 0
  });

  const currentMessageRef = React.createRef("");

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
        setMessages((prevState) => ({
          currentMessage: "",
          previousMessage: prevState.currentMessage,
          messageCnt: prevState.messageCnt + 1
        }));
        currentMessageRef.current.textContent = "";
        document.getElementById("current-message").className = " current-message-not-typing";
      }
    }
    window.addEventListener("keydown", handleSubmit);
    return () => {
      window.removeEventListener("keydown", handleSubmit);
    }
  }, [messages.currentMessage, currentMessageRef]);

  React.useEffect(() => {
    if (messages.messageCnt){
      const pastMessagesEl = document.getElementById("past-messages");
      pastMessagesEl.innerHTML += `<div class="chat-bubble-white">${messages.previousMessage}</div>`;
    }
  }, [messages.previousMessage, messages.messageCnt]);

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
      <div id="past-messages"></div>
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
    <HelloWorld />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
