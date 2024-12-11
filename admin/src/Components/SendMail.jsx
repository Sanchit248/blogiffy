import React, { useState } from 'react';
import './SendMail.css';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function SendMail({ user, onClose }) {
  const [message, setMessage] = useState({ subject: '', body: '', to: user.email });

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Here you would typically send the email
    try {
      const res = await axios.post("https://blogifybackend-anmol-ramolas-projects.vercel.app/admin/sendMail", { message }, { withCredentials: true });

      if (res.status === 200) {
        toast.success(res.data.msg);
      }
    } catch (error) {
      toast.error(error.response?.data?.msg || "Error sending email");
    }
    onClose();
  };

  return (
    <div className="send-mail-overlay">
      <div className="send-mail-modal">
        <h2>Send Email to {user.email}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="subject">Subject:</label>
            <input
              type="text"
              id="subject"
              name='subject'
              value={message.subject}
              onChange={(e) => setMessage({...message, [e.target.name]: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="body">Message:</label>
            <textarea
              id="body"
              value={message.body}
              name="body"
              onChange={(e) => setMessage({...message, [e.target.name]: e.target.value })}
              required
            ></textarea>
          </div>
          <div className="button-group">
            <button type="submit" className="btn-send">Send</button>
            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}