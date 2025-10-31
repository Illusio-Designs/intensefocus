'use client';
import React, { useEffect } from 'react';
import '../../styles/components/ui.css';

export default function Modal({ open, title, children, onClose, footer = null, size = 'md' }) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  if (!open) return null;

  return (
    <div className="ui-modal__backdrop" onClick={onClose}>
      <div className={`ui-modal ui-modal--${size}`} onClick={(e) => e.stopPropagation()}>
        <div className="ui-modal__header">
          <h4 className="ui-modal__title">{title}</h4>
          <button className="ui-modal__close" onClick={onClose} aria-label="Close">×</button>
        </div>
        <div className="ui-modal__body">{children}</div>
        {footer && <div className="ui-modal__footer">{footer}</div>}
      </div>
    </div>
  );
}


