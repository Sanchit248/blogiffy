import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ExternalLink, Trash2 } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { NotificationContext } from './Context/notificationContext';


export default function NotificationsPanel() {
  const [notifications, setNotifications] = useState([]);
  const { setUnread } = useContext(NotificationContext);

  const navigate = useNavigate();

  const filterUnreadNotifications = (notifications) => {
    return notifications.filter(notification => notification.status === 'unread');
  };

  useEffect(() => {
    const getNotifications = async () => {
      try {
        const response = await axios.get('https://blogifybackend-anmol-ramolas-projects.vercel.app/admin/getAllNotifications', { withCredentials: true });

        if(response.status === 200) {
          setNotifications(response.data);
        }

        const unreadNotifications = filterUnreadNotifications(response.data);
        setUnread(unreadNotifications);
        
        
      } catch (error) {
        console.log(error);
        toast.error(error.response?.data?.message || 'failed to fetch notifications');

      }
    };

    getNotifications();
  }, [setUnread]);

  const handleDelete = async (id) => {
    try {
      const res = await axios.post('https://blogifybackend-anmol-ramolas-projects.vercel.app/admin/deleteNotification', { _id: id }, { withCredentials: true });

      if(res.status === 200) {
        toast.success('Notification deleted successfully');
        setNotifications(notifications.filter(notification => notification._id !== id));
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || 'failed to delete notification');
    }
  };

  const handleMarkAsRead = (_id) => {
    navigate(`/notifications/${_id}`); 
  };

  return (
    <div className="panel notifications-panel">
      <h2>Notifications</h2>
      <p>View all feedbacks and messages from users.</p>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th className="desktop-only">Date</th>
              <th className="desktop-only">Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {notifications.map((notification) => (
              <tr key={notification._id}>
                <td>{notification.firstName + " " + notification.lastName}</td>
                <td className="desktop-only">{new Date(notification.createdAt).toDateString()}</td>
                <td className="desktop-only">
                  <span className={`status ${notification.status}`}>{notification.status}</span>
                </td>
                <td>
                    <button style={{ marginBottom: "5px" }} className="btn-outline" onClick={() => handleMarkAsRead(notification._id)}>
                      <ExternalLink className="icon" /> View
                    </button>
                  <button style={{ marginTop: "5px" }} className="btn-delete" onClick={() => handleDelete(notification._id)}>
                    <Trash2 className="icon" /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}