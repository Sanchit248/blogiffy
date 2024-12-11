import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function NotificationDetails() {
  const { id } = useParams();
  const [notification, setNotification] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch notification details here
    // For now, we'll use mock data
    // const mockNotification = {
    //   id: parseInt(id),
    //   type: 'feedback',
    //   user: "John Doe",
    //   content: "Great blog platform! I love how easy it is to use.",
    //   date: "2023-06-25",
    //   status: "unread"
    // };

    const getNotification = async () => {
      try {

        const res = await axios.get(`https://blogifybackend-anmol-ramolas-projects.vercel.app/admin/getNotification/${id}`, { withCredentials: true });

        if(res.status === 200) {
          setNotification(res.data);
        }
      } catch (error) {
        console.log(error);
        toast.error(error.response?.data?.message || 'failed to fetch notification');
      }
    };

    getNotification();
  }, [id,navigate]);

  if (!notification) {
    return <div>Loading...</div>;
  }

  return (
    <div className="panel notification-details">
      <div className="panel-header">
        <h2>Notification Details</h2>
        <Link to="/notifications">
          <button className="btn-back">
            <ArrowLeft className="icon" /> Back to Notifications
          </button>
        </Link>
      </div>
      <div className="notification-info">
        <div>
          <h3>Type</h3>
          <p>{notification.type}</p>
        </div>
        <div>
          <h3>User</h3>
          <p>{notification.firstName + " " + notification.lastName} </p>
        </div>
        <div>
          <h3>Content</h3>
          <p>{notification.message}</p>
        </div>
        <div>
          <h3>Date</h3>
          <p>{new Date(notification.createdAt).toDateString()}</p>
        </div>
        <div>
          <h3>Status</h3>
          <span className={`status ${notification.status}`}>{notification.status}</span>
        </div>
      </div>
    </div>
  );
}