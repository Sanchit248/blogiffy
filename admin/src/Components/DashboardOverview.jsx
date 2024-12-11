import { useState, useEffect, useContext } from 'react';
import { Users, FileText, Bell } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { NotificationContext } from './Context/notificationContext';

export default function DashboardOverview() {

  const [users, setUsers] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const { unread, setUnread } = useContext(NotificationContext);

  const getTodayDate = () => {
    const today = new Date();
    return new Date(today.setHours(0, 0, 0, 0)); // Reset time to start of the day
  };

  // Get the date exactly one month ago (21 August 2024)
  const getOneMonthAgoDate = () => {
    const today = new Date();
    today.setMonth(today.getMonth() - 1); // Subtract 1 month
    return new Date(today.setHours(0, 0, 0, 0)); // Reset time to start of the day
  };

  // Filter users with createdAt between startDate and endDate
  const filterUsersByDate = (users, startDate, endDate) => {
    return users.filter(user => {
      const createdAt = new Date(user.createdAt); // Convert createdAt to Date object
      return createdAt >= startDate && createdAt <= endDate;
    });
  };

  // Filter Blogs with createdAt between startDate and endDate
  const filterBlogsByDate = (blogs, startDate, endDate) => {
    return blogs.filter(blog => {
      const createdAt = new Date(blog.createdAt); // Convert createdAt to Date object
      return createdAt >= startDate && createdAt <= endDate;
    });
  };

  // Filter Unread Notifications
  const filterUnreadNotifications = (notifications) => {
    return notifications.filter(notification => {
      const unread = notification.status === 'unread';
      return unread;
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://blogifybackend-anmol-ramolas-projects.vercel.app/admin/getAllValues', { withCredentials: true });

        if (response.data.users && response.data.blogs && response.data.notifications) {
          setUsers(response.data.users);
          setBlogs(response.data.blogs);
          setNotifications(response.data.notifications);
        }

        const unreadNotifications = filterUnreadNotifications(notifications);
        setUnread(unreadNotifications);

      } catch (error) {
        console.log(error);
        toast.error(error.response?.data?.message || 'An error occurred');
      }
    };
    fetchData();
  }, [setUnread]);

  // Filter users who joined between these dates
  const usersJoinedInLastMonth = filterUsersByDate(users, getOneMonthAgoDate(), getTodayDate());

  // Filter blogs who joined between these dates
  const blogsCreatedInLastMonth = filterBlogsByDate(blogs, getOneMonthAgoDate(), getTodayDate());

  return (
    <div className="dashboard-overview">
      <div className="card blue">
        <h2><Users className="icon" /> Total Users</h2>
        <div className="card-content">
          <span className="number">{users.length}</span>
          <p>+{usersJoinedInLastMonth.length} from last month</p>
        </div>
      </div>
      <div className="card green">
        <h2><FileText className="icon" /> Total Blogs</h2>
        <div className="card-content">
          <span className="number">{blogs.length}</span>
          <p>+{blogsCreatedInLastMonth.length} from last month</p>
        </div>
      </div>
      <div className="card purple">
        <h2><Bell className="icon" />Notifications</h2>
        <div className="card-content">
          <span className="number">{notifications.length}</span>
          <p>{unread.length} unread notifications</p>
        </div>
      </div>
    </div>
  );
}