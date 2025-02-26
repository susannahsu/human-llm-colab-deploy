import React from 'react';
import './InstructionsModal.css'; // Add a CSS file for styling

const InstructionsModal = ({ onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Welcome to the Study</h2>
        <p>
          In this task, you will collaborate with an AI assistant to modify a website to match a reference design.
          The AI will update the website based on your instructions, and you will see changes reflected in real time.
        </p>

        <h3>How to Interact</h3>
        <ul>
          <li>Watch the reference video to see the target website.</li>
          <li>Describe the changes you want in the chat.</li>
          <li>The AI will modify the website accordingly.</li>
          <li>If needed, you can refine your instructions or report issues.</li>
        </ul>

        <h3>Progressing Through Stages</h3>
        <ul>
          <li>The reference video will be revealed in stages, adding more details as you go.</li>
          <li>Once you feel the current stage is complete, click <b>"Go to Next Stage."</b></li>
        </ul>

        <h3>Completing the Task</h3>
        <ul>
          <li>The study consists of multiple stages, increasing in complexity.</li>
          <li>At the end, you will complete a short survey about your experience.</li>
        </ul>

        <button onClick={onClose}>Start Experiment</button>
      </div>
    </div>
  );
};

export default InstructionsModal;
