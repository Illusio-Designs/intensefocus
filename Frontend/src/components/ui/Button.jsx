'use client';
import React from 'react';
import '../../styles/components/ui.css';

const VARIANT_CLASS = {
  primary: 'ui-btn ui-btn--primary',
  secondary: 'ui-btn ui-btn--secondary',
  ghost: 'ui-btn ui-btn--ghost',
  danger: 'ui-btn ui-btn--danger',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  leadingIcon = null,
  trailingIcon = null,
  className = '',
  ...props
}) {
  const classes = [VARIANT_CLASS[variant] || VARIANT_CLASS.primary, `ui-btn--${size}`, className]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={classes} {...props}>
      {leadingIcon && <span className="ui-btn__icon ui-btn__icon--leading">{leadingIcon}</span>}
      <span className="ui-btn__label">{children}</span>
      {trailingIcon && <span className="ui-btn__icon ui-btn__icon--trailing">{trailingIcon}</span>}
    </button>
  );
}


