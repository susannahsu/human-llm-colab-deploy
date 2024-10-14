import React, { useState, useRef } from 'react';
import './WebsitePreview.css';

const WebsitePreview = ({htmlString}) => {
    return (
        <iframe
        className="website-preview"
        // dangerouslySetInnerHTML={{ __html: htmlString }}
        srcDoc={htmlString}
        />
    );
    };
  
export default WebsitePreview;
