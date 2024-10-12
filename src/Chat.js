import React, { useState, useEffect } from 'react';
import axios from 'axios';


const Chat = ({htmlString, setHtmlString}) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [userID, setUserID] = useState('');
  const [loading, setLoading] = useState(false);
  const [displayMessages, setDisplayMessages] = useState([]);

  useEffect(() => {
    if (userID === '') {
      const id = prompt('Enter your user ID:');
      setUserID(id);
    }
  }, [])

  const handleSend = async () => {
    const newMessage = { role: 'user', content: input };
    setMessages([...messages, newMessage]);
    //setDisplayMessages([...displayMessages, newMessage]);
    setDisplayMessages((prevDisplayMessages) => [...prevDisplayMessages, newMessage]);

    setLoading(true);

    try {
      const response = await axios.post(
        'https://13ah9euji8.execute-api.us-east-2.amazonaws.com/dev/OpenAIAPICallHandler', 
        {
          htmlString,
          userID,
          messages: [
            ...messages,
            { role: 'system', 
              content: `Suppose you are collaborating with the user to customize an existing website. You are talking to this user, who is your client. Here is the current script: ${htmlString}. If you're unclear on the user's goal, ask a clarifying question or state your assumptions. Always provide the response in this format:
              # Clarification: [If any]
              # Assumptions: [If any]
              # Updated Code:
              [Updated code here]
              For the updated code, please return the revised, COMPLETE htmlString, in strict text form. Do not use an 'absolute' position value ever. Start from how the original htmlString started.`
            },
            newMessage
          ]
        }
      );

      // Extract the bot's response from Lambda's output
      const botMessage = response.data.message;

      const clarificationMatch = botMessage.match(/# Clarification:(.*?)(#|$)/s);
      const assumptionMatch = botMessage.match(/# Assumptions:(.*?)(#|$)/s);

      let clarification = clarificationMatch && clarificationMatch[1] ? clarificationMatch[1].trim() : "None";
      let assumption = assumptionMatch && assumptionMatch[1] ? assumptionMatch[1].trim() : "None";

      const clarificationAssumptionDisplay = `Clarification: ${clarification}\nAssumptions: ${assumption}`;
      setDisplayMessages((prevDisplayMessages) => [
        ...prevDisplayMessages,
        { role: 'assistant', content: clarificationAssumptionDisplay },
      ]);
      
      const codeMatch = botMessage.match(/```html([\s\S]*?)```/);
      if (codeMatch && codeMatch[1]) {
        // Set the extracted code as the updated htmlString
        setHtmlString(codeMatch[1].trim());
      }

      setMessages([...messages, newMessage, { role: 'assistant', content: botMessage }]);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
    setInput('');
  };


  return (
    <div className="chat-container">
      <div className="chat-window">
        {/* {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.role}`}>
            <p className="message-content">{msg.content}</p>
          </div>
        ))} */}
        {/* Render displayMessages for UI */}
        {displayMessages.map((msg, index) => (
          <div key={index} className={`message ${msg.role}`}>
            <p className="message-content">{msg.content}</p>
          </div>
        ))}

        {/* Loading Indicator */}
        {loading && (
            <div className="message bot">
                <p className="message-content">
                </p>
            </div>
        )}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default Chat;
