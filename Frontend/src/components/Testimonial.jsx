import React from 'react';

const Testimonial = ({ name, role, content, image }) => {
  return (
    <div className="testimonial">
      <div className="testimonial-content">
        <p>"{content}"</p>
      </div>
      <div className="testimonial-author">
        <div className="author-image">
          <img src={image} alt={name} />
        </div>
        <div className="author-info">
          <h4>{name}</h4>
          <p>{role}</p>
        </div>
      </div>
    </div>
  );
};

export default Testimonial;
