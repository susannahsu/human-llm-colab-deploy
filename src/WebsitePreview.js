import React, { useState, useRef } from 'react';
import './WebsitePreview.css';

const WebsitePreview = ({htmlString}) => {
    return (
        <div
        className="website-preview"
        dangerouslySetInnerHTML={{ __html: htmlString }}
        />
    );
    };
  
export default WebsitePreview;
