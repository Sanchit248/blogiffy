import { useEffect, useState, useContext } from 'react';
import { Box, Typography, styled } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Edit, Delete } from '@mui/icons-material';
import { toast } from 'react-toastify';
import Loader from '../Loader';
import { UserContext } from '../../context/userContext';
import Like from '../utils/Like';

import Comments from '../comments';

const Container = styled(Box)`
    margin: 100px 100px;

    @media (max-width: 800px) {
        margin: 100px 20px; /* Remove horizontal margin on small devices */
    }
`;

const Image = styled('img')`
    width: 100%;
    height: 50vh;
    object-fit: cover;
`;

const Heading = styled(Typography)`
    font-size: 38px;
    font-weight: 600;
    text-align: center;
    margin: 50px 0;
    word-break: break-word;
`;

const EditIcon = styled(Edit)`
    margin: 5px;
    padding: 5px;
    border: 1px solid #878787;
    border-radius: 10px;
    font-size: 40px;
`;

const DeleteIcon = styled(Delete)`
    margin: 5px;
    padding: 5px;
    border: 1px solid #878787;
    border-radius: 10px;
    font-size: 40px;
`;

const Author = styled(Typography)`
    color: #878787;
    margin: 20px 0;
    display: flex;
`;

const Body = styled(Typography)`
    word-break: break-word;
`;

const Blog = () => {

    const [loading, setLoading] = useState(true);

    const [blog, setBlog] = useState({});

    const { id } = useParams();

    const { user, isAuthenticated } = useContext(UserContext);

    const navigate = useNavigate();

    const url = blog.coverImageURL? blog.coverImageURL : "https://images.unsplash.com/photo-1543128639-4cb7e6eeef1b?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8bGFwdG9wJTIwc2V0dXB8ZW58MHx8MHx8&ixlib=rb-1.2.1&w=1000&q=80"

    useEffect(() => {
        const getBlog = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`https://blogifybackend-anmol-ramolas-projects.vercel.app/blog/${id}`);
                setBlog(res.data);
                setLoading(false);


            } catch (error) {
                if (error.response.status === 404) {
                    setLoading(false);
                    toast.error(error.response.data.msg);
                    return;
                }
                else{
                console.log(error);
                setLoading(false);
                toast.error("Failed to fetch blog");
                }
                
            }
        }
        getBlog();
    },[id]);

    const deleteBlog = async () => {
        try {
            setLoading(true);
            const res = await axios.delete(`https://blogifybackend-anmol-ramolas-projects.vercel.app/delete/${id}`, { withCredentials: true });

            if(res.status === 200){
                setLoading(false);
                toast.success("Blog Deleted Successfully");
                navigate('/');
            }
        } catch (error) {
            console.log(error);
            setLoading(false);
            toast.error("Error deleting Blog");
        }
    }


    return (
        <>
        {loading? <Loader /> : 
        <Container>
            <Image src={url} alt="/blog" />

            <Box style={{float: "right"}}>
                {
                    blog.createdBy === user?.email? 
                    <>
                        <EditIcon color='primary' style={{cursor: "pointer"}} onClick={()=>{navigate(`/update/${blog._id}`)}} />
                        <DeleteIcon color='error' style={{cursor: "pointer"}} onClick={deleteBlog} />
                    </>
                    :
                    <>{isAuthenticated?
                        <><Like blogId={blog._id} initialLikes={blog.likedBy} /></>
                        :
                        <></>
                    }</>
                }
                
            </Box>

            <Heading>{blog.title}</Heading>

            <Author>
                <Typography>Author: <Box component="span" style={{fontWeight: "600"}}>{blog.createdBy}</Box></Typography>
                <Typography style={{marginLeft: "auto"}}>{new Date(blog.createdAt).toDateString()}</Typography>
            </Author>

            <Body dangerouslySetInnerHTML={{ __html: blog.body ? blog.body.replace(/\n/g, '<br />') : '' }} />

            <Comments blog={blog} />
        </Container>
}
        </>
    )
}

export default Blog;