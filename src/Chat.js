import React, { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import {v4 as uuidv4} from 'uuid';
import { BeatLoader } from 'react-spinners';
import { FaRobot, FaUser } from "react-icons/fa";
import { use } from 'react';
// array of video urls
const videoUrls = [
  'https://www.youtube.com/watch?v=SqcY0GlETPk',
  'https://www.youtube.com/watch?v=lWrftaN1nO0',
  'https://www.youtube.com/watch?v=Qg4ABPymZm8',
]

const Chat = ({htmlString, setHtmlString, userName}) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [userID, setUserID] = useState(uuidv4());
  const [loading, setLoading] = useState(false);
  const [displayMessages, setDisplayMessages] = useState([]);
  // const [surveyData, setSurveyData] = useState({
  //   name: '',
  //   feedback: '',
  //   rating: 5,
  // });
  const [showModal, setShowModal] = useState(false);
  // state of current stage
  const [stage, setStage] = useState(1);
  
  const [feedbackData, setFeedbackData] = useState({
    satisfaction: '',
    intention: '',
    conflict: '',
    adjustments: '',
    clarifications: '',
  });

  const handleFeedbackChange = useCallback( (e) => {
    const { name, value } = e.target;
    setFeedbackData(prev => ({ ...prev, [name]: value }));
  },[setFeedbackData])

  const randomFormQuestions = useMemo(() => [
    (<div key='satisfaction'>
        <label>Are you satisfied with the current state of this attribute?</label>
        <div>
          <label>
            <input
              type="radio"
              name="satisfaction"
              value="satisfied"
              onChange={handleFeedbackChange}
            />{' '}
            Satisfied
          </label>
          <label>
            <input
              type="radio"
              name="satisfaction"
              value="unsatisfied"
              onChange={handleFeedbackChange}
            />{' '}
            Unsatisfied
          </label>
        </div>
      </div>),
      (<div key='intention'>
        <label>Did the language model get your intention correctly?</label>
        <div>
          <label>
            <input
              type="radio"
              name="intention"
              value="yes"
              onChange={handleFeedbackChange}
            />{' '}
            Yes
          </label>
          <label>
            <input
              type="radio"
              name="intention"
              value="no"
              onChange={handleFeedbackChange}
            />{' '}
            No
          </label>
        </div>
      </div>),
      (<div key='conflict'>
        <label>Did this change conflict with other changes?</label>
        <div>
          <label>
            <input
              type="radio"
              name="conflict"
              value="yes"
              onChange={handleFeedbackChange}
            />{' '}
            Yes
          </label>
          <label>
            <input
              type="radio"
              name="conflict"
              value="no"
              onChange={handleFeedbackChange}
            />{' '}
            No
          </label>
        </div>
      </div>),
      (<div key='adjustments'>
        <label>Did ChatGPT adjust effectively to your instructions after initial mistakes?</label>
        <div>
          <label>
            <input
              type="radio"
              name="adjustments"
              value="yes"
              onChange={handleFeedbackChange}
            />{' '}
            Yes
          </label>
          <label>
            <input
              type="radio"
              name="adjustments"
              value="no"
              onChange={handleFeedbackChange}
            />{' '}
            No
          </label>
          <label>
            <input
              type="radio"
              name="adjustments"
              value="na"
              onChange={handleFeedbackChange}
            />{' '}
            N/A
          </label>
        </div>
      </div>),
      (<div key='clarifications'>
        <label>Did ChatGPT ask clarifying questions or make useful assumptions?</label>
        <div>
          <label>
            <input
              type="radio"
              name="clarifications"
              value="yes"
              onChange={handleFeedbackChange}
            />{' '}
            Yes
          </label>
          <label>
            <input
              type="radio"
              name="clarifications"
              value="no"
              onChange={handleFeedbackChange}
            />{' '}
            No
          </label>
        </div>
      </div>)
  ]
  // randomization part; if comment out 169-173, will be in order
  .map((question) => ({
    question, sort: Math.random(),
  })).sort((a, b) => a.sort - b.sort).map(({ question }) => (
    question
  )
),[handleFeedbackChange, showModal])

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    // Send feedbackData to your API or log it
    await axios.post('https://13ah9euji8.execute-api.us-east-2.amazonaws.com/dev/humanAISurveyResponse', {
      ...feedbackData,
      userID,
    })
    console.log('Feedbakc Submitted:', feedbackData);
    alert('Feedback submitted!');
    setShowModal(false);
  };

  const handleNextStage = () => {
    if (stage === 3) {
      const isDone = window.confirm('Are you sure you are done?');
      if (isDone) {
        window.location.href = 'https://www.google.com'
      }
      return;
    }
    setStage(stage + 1);
  };

  const handleSend = async () => {
    setInput('');
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
          userName,
          stage,
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
      const botMessage = response.data.message.choices[0].message.content;

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
    
  };

  // const handleSurveyChange = (e) => {
  //   const { name, value } = e.target;
  //   setSurveyData({ ...surveyData, [name]: value });
  // };

  // const handleSurveySubmit = async (e) => {
  //   e.preventDefault();
  //   await axios.post('https://13ah9euji8.execute-api.us-east-2.amazonaws.com/dev/humanAISurveyResponse', {
  //     ...surveyData,
  //     userID,
  //   })
  //   console.log('Survey Submitted:', surveyData);
  //   alert('Thank you for your feedback!');
  // };


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
            <div className='message-icon'>{msg.role === 'user' ? <FaUser /> : <FaRobot />}</div>
            <p className="message-content">{msg.content}</p>
          </div>
        ))}

        {/* Loading Indicator */}
        {loading && (
            <div className="message bot">
              <div className='message-icon'><FaRobot /></div>
                <p className="message-content">
                  <BeatLoader color="#36d7b7" size={8} />
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

      <div className="feedback-button">
          <div>
            <button onClick={() => setShowModal(true)}>Errors/Feedback</button>
            <button onClick={() => {
              window.open(videoUrls[stage - 1], '_blank');
            }}>Watch Video</button>
          </div>
          <button onClick={handleNextStage}>{stage === 3 ? 'I am done' : `Go to Stage ${stage + 1}`}</button>
      </div>

      {showModal && (
        <div className="feedback-modal">
          <div className="modal-content">
            <h2>Feedback</h2>
            <form onSubmit={handleFeedbackSubmit}>
              
              
              {randomFormQuestions}
              
              
              <div>
                <button type="submit">Submit</button>
                <button type="button" onClick={() => setShowModal(false)}>
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


    </div>
  );
};

export default Chat;
