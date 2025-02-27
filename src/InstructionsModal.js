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

        <h3>Using the Error/Feedback Form</h3>
        <p>
        If you notice any errors or want to provide feedback on the <strong>most recent AI interaction</strong>, use the Error/Feedback form:
        </p>
        <ul>
          <li>Click the "Error/Feedback" button.</li>
          <li>Select the relevant issues from the provided choices.</li>
          <li>You DO NOT need to answer all questions—just those that apply.</li>
          <li>Click "Submit" and wait a few seconds for confirmation.</li>
          <li>The form will automatically close once successfully submitted.</li>
        </ul>
        <p><strong>Note:</strong> Each submission only applies to the most recent AI interaction.</p>

        <h3>Useful Troubleshooting Tips</h3>
        <p>
        If you encounter any unexpected issues, such as <strong>webpage layout getting messed up</strong> (e.g., pages embedded within pages), try the following:
        </p>
        <ul>
          <li>Ask the AI to "Revert the last change."</li>
          <li>Explicitly state something along the line like "The last change introduced an error, please try again."</li>
          <li>DO NOT refresh the page -- doing so reset all progress.</li>
          <li>If the system stop responding, click 'Go to Stage X' until it shows 'I am done'. Hit 'I am done' to stop early and note the issue/describe why the experiment has stopped early in the comment section of the post-experiment survey.</li>
        </ul>


        <h3>Progressing Through Stages</h3>
        <ul>
          <li>The reference video will be revealed in stages, adding more details as you go.</li>
          <li>Once you feel the current stage is complete, click <b>"Go to Stage X."</b></li>
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
