import React, { useState, useEffect } from 'react';
import { ExternalLink, Trash2 } from 'lucide-react';
import axios from 'axios';
import SpecificBlog from './SpecificBlog';
import { toast } from 'react-toastify';

export default function BlogsPanel() {
  const [blogs, setBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get("https://blogifybackend-anmol-ramolas-projects.vercel.app/admin/getAllBlogs", {
          withCredentials: true});
        setBlogs(response.data);

      } catch (error) {
        console.log(error);
      }
    }

    fetchBlogs();
  }, []);

  const handleDelete = async (_id) => {
    try {
      const res = await axios.post("https://blogifybackend-anmol-ramolas-projects.vercel.app/admin/deleteBlog", { _id }, { withCredentials: true });

      if (res.status === 200) {
        toast.success(res.data.msg);
        setBlogs(blogs.filter((blog) => blog._id !== _id));
      }
    } catch (error) {
      toast.error(error.response?.data?.msg || "Error deleting blog");
    }
  };

  const handleView = (blog) => {
    setSelectedBlog(blog);
  };


  return (
    <div className="panel blogs-panel">
      <h2>Blogs Management</h2>
      <p>View and manage all blog posts.</p>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Date Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {blogs.map((blog) => (
              <tr key={blog._id}>
                <td>{blog.title}</td>
                <td>{blog.createdBy.substring(0,8)}..</td>
                <td>{new Date(blog.createdAt).toDateString()}</td>
                <td>
                  <button style={{marginBottom: "5px"}} className="btn-outline" onClick={() => handleView(blog)}>
                    <ExternalLink className="icon" />
                  </button>
                  <button style={{marginTop: "5px"}} className="btn-delete" onClick={() => handleDelete(blog._id)}>
                    <Trash2 className="icon" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedBlog && (
        <SpecificBlog
          blog={selectedBlog}
          onClose={() => setSelectedBlog(null)}
        />
      )}
    </div>
  );
}