import React, { useState } from 'react';
import axios from 'axios';


const Chat = ({htmlString, setHtmlString}) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  // const handleSend = async () => {
  //   const newMessage = { role: 'user', content: input };
  //   setMessages([...messages, newMessage]);
  //   setLoading(true);

  //   try {
  //     const response = await axios.post(
  //       'https://api.openai.com/v1/chat/completions',
  //       {
  //         model: 'gpt-3.5-turbo', 
  //         messages: [
  //           ...messages, 
  //           { role: 'system', content: `Here is the script: ${htmlString}. Don't give me any instructions.Please return the revised, complete code ONLY, in strict text form.` },
  //           newMessage],
  //       },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`, // Add your OpenAI API key here
  //           'Content-Type': 'application/json',
  //         },
  //       }
  //     );

  //     const botMessage = response.data.choices[0].message;
  //     setHtmlString(botMessage.content);
  //     setMessages([...messages, newMessage, botMessage]);
  //   } catch (error) {
  //     console.error('Error:', error);
  //   }finally {
  //       setLoading(false);
  //   }
  //   setInput('');
  // };

  const handleSend = async () => {
    const newMessage = { role: 'user', content: input };
    setMessages([...messages, newMessage]);
    setLoading(true);

    try {
      // Update this to call your Lambda function via API Gateway
      const response = await axios.post(
        'https://13ah9euji8.execute-api.us-east-2.amazonaws.com/dev/OpenAIAPICallHandler', // Replace with your API Gateway URL
        {
          htmlString: htmlString,
          messages: [
            ...messages,
            { role: 'system', content: `Here is the script: ${htmlString}. DO NOT GIVE ME ANY INSTRUCTIONS OR COMMENTS. Please return the revised, complete code ONLY, in strict text form.` },
            newMessage
          ]
        }
      );

      // Extract the bot's response from Lambda's output
      const botMessage = response.data.message.choices[0].message.content;
      setHtmlString(botMessage);
      setMessages([...messages, newMessage, { role: 'bot', content: botMessage }]);
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
        {messages.map((msg, index) => (
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
