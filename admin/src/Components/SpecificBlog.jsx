import React from 'react';
import './SpecificBlog.css';

export default function SpecificBlog({ blog, onClose }) {
  return (
    <div className="specific-blog-overlay">
      <div className="specific-blog-modal">
        <button className="close-button" onClick={onClose}>&times;</button>
        <div className="blog-content">
          <img src={blog.coverImageURL} alt={blog.title} className="blog-image" />
          <h2 className="blog-title">{blog.title}</h2>
          <div className="blog-meta">
            <span className="blog-author">Author: {blog.createdBy}</span>
            <span className="blog-date">{new Date(blog.createdAt).toDateString()}</span>
          </div>
          <div className="blog-body" dangerouslySetInnerHTML={{ __html: blog.body.replace(/\n/g, '<br />') }} />
        </div>
      </div>
    </div>
  );
}