import React, { useState, useEffect } from 'react';
import { Trash2, Mail } from 'lucide-react';
import SendMail from './SendMail';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function UsersPanel() {
  const [users, setUsers] = useState([]);
  const [showSendMail, setShowSendMail] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("https://blogifybackend-anmol-ramolas-projects.vercel.app/admin/getAllUsers", {
          withCredentials: true
        });
        setUsers(response.data);

      } catch (error) {
        console.log(error);
      }
    }

    fetchUsers();
  }, []);

  const handleDelete = async (_id) => {
    try {
      const res = await axios.post("https://blogifybackend-anmol-ramolas-projects.vercel.app/admin/deleteUser", { _id }, { withCredentials: true });

      if (res.status === 200) {
        toast.success(res.data.msg);
        setUsers(users.filter(user => user._id !== _id));
    }
    } catch (error) {
      toast.error(error.response?.data?.msg || "Error deleting user");
    }
  };

  const handleSendMail = (user) => {
    setSelectedUser(user);
    setShowSendMail(true);
  };

  return (
    <div className="panel users-panel">
      <h2>Users Management</h2>
      <p>View and manage all users of the blog.</p>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Blogs Count</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>
                  <div className="user-info">
                    <img src={user.profileImageUrl} alt={user.name} />
                    <span>{user.fullName}</span>
                  </div>
                </td>
                <td>{user.blogCount}</td>
                <td>
                  <button style={{marginBottom: "5px"}} className="btn-outline" onClick={() => handleSendMail(user)}>
                    <Mail className="icon" /> Send Mail
                  </button>
                  <button style={{marginTop: "5px"}} className="btn-delete" onClick={() => handleDelete(user._id)}>
                    <Trash2 className="icon" /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showSendMail && (
        <SendMail
          user={selectedUser}
          onClose={() => setShowSendMail(false)}
        />
      )}
    </div>
  );
}