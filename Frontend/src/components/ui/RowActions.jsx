import React from 'react';

// Reusable row action buttons: only renders buttons for handlers provided
export default function RowActions({ onView, onEdit, onDownload, onDelete, onUpload }) {
  return (
    <div style={{ display: 'flex', gap: 10, position: 'relative', zIndex: 1 }}>
      {onView && (
        <button className="ui-btn ui-btn--ghost ui-btn--sm has-tt" onClick={onView}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 12S5 5 12 5s11 7 11 7-4 7-11 7-11-7-11-7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
          </svg>
          <span className="ui-tt">View</span>
        </button>
      )}
      {onEdit && (
        <button className="ui-btn ui-btn--ghost ui-btn--sm has-tt" onClick={onEdit}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 20h9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="ui-tt">Edit</span>
        </button>
      )}
      {onDownload && (
        <button className="ui-btn ui-btn--ghost ui-btn--sm has-tt" onClick={onDownload}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 3v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M7 11l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M5 21h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span className="ui-tt">Download</span>
        </button>
      )}
      {onDelete && (
        <button className="ui-btn ui-btn--ghost ui-btn--sm has-tt" onClick={onDelete}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 6h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M19 6l-.868 13.142A2 2 0 0 1 16.018 21H7.982a2 2 0 0 1-2.114-1.858L5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="ui-tt">Delete</span>
        </button>
      )}
      {onUpload && (
        <button className="ui-btn ui-btn--ghost ui-btn--sm has-tt" onClick={onUpload}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 5l6 6M12 5L6 11M12 5v13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="ui-tt">Upload Image</span>
        </button>
      )}
    </div>
  );
}
