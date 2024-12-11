import { useState, useContext, useEffect } from 'react';
import { Box, TextareaAutosize, Button, styled, Typography } from '@mui/material';
import { Delete } from '@mui/icons-material';
import { UserContext } from '../context/userContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Container = styled(Box)`
    margin-top: 100px;
    display: flex;
`;

const Image = styled('img')`
    width: 70px;
    height: 70px;
    bodrder-radius: 50%;
`;

const StyledTextArea = styled(TextareaAutosize)`
    height: 100px;
    width: 100%;
    margin: 0 20px;
`;

const Container2 = styled(Box)`
    display: flex;
    margin-top: 30px;
`;

const Image2 = styled('img')`
    width: 60px;
    height: 60px;
    bodrder-radius: 50%;
`;

const Component = styled(Box)`
    background-color: #f5f5f5;
    margin-left: 20px;
    width: 100%;
    padding: 10px;
`;

const InnerContainer = styled(Box)`
    display: flex;
    margin-bottom: 5px;
`;

const Name = styled(Typography)`
    font-weight: 600;
    font-size: 18px;
    margin-right: 20px;
`;

const StyledDate = styled(Typography)`
    color: #878787;
    font-size: 14px;
`;

const DeleteIcon = styled(Delete)`
    margin-left: auto;
    cursor: pointer;
`;

const initialValues = {
    createdBy: "",
    blogId: "",
    comment: "",
    avatar: "",
    createdAt: "",
};


const Comments = ({ blog }) => {

    const { user, isAuthenticated } = useContext(UserContext);

    const [comment, setComment] = useState(initialValues);
    const [comments, setComments] = useState([]);
    const [toggle, setToggle] = useState(false);
    useEffect(() => {
        const getComments = async () => {
            try {
                const res = await axios.get(`https://blogifybackend-anmol-ramolas-projects.vercel.app/comments/${blog._id}`);
                if(res.status === 200) {
                    setComments(res.data);
                }
            } catch (error) {
                console.log(error);
                toast.warning("Failed to fetch comments");
            }
        }
        getComments();
    }, [blog, toggle]);

    const handleChange = (e) => {
        setComment({ ...comment, createdBy: user.email, blogId: blog._id, avatar: user.profileImageUrl, comment: e.target.value});
    };

    const AddComment = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("https://blogifybackend-anmol-ramolas-projects.vercel.app/comment", comment, { withCredentials: true });
            
            if (res.status === 200) {
                toast.success("Comment added successfully");
                setComment(initialValues);
                setToggle(prevState => !prevState);
            }
        } catch (error) {
            console.log(error);
            toast.error("Failed to add comment");
        }
    };

    const handleDeleteComment = async (id) => {
        try {
            const res = await axios.delete(`https://blogifybackend-anmol-ramolas-projects.vercel.app/comment/${id}`, { withCredentials: true });

            if(res.status === 200){
                toast.success("comment deleted successfully");
                setToggle(prevState => !prevState);
            }

        } catch (error) {
            console.log(error);
            toast.error("Failed to delete Comment");
        }
    };

    return (
        <Box>
            
            {isAuthenticated ? 
                <Container>
                    <Image src={user.profileImageUrl} alt="DP" />
                    <StyledTextArea minRows={3} placeholder="What's on your mind?" value={comment.comment} onChange={(e) => handleChange(e)} />
                    <Button onClick={(e) => AddComment(e)} variant='contained' color='primary' size='medium' style={{ height: "40px" }}>POST</Button>
                </Container>
            :
                <Box></Box>
            }
            <Box>
                {comments.map((comment) => (
                    <Container2 key={comment._id}>
                        <Box>
                            <Image2 src={comment.avatar} alt="DP" />
                        </Box>
                        <Component>
                            <InnerContainer>
                                <Name>{comment.createdBy}</Name>
                                <StyledDate>{new Date(comment.createdAt).toDateString()}</StyledDate>
                                {isAuthenticated && comment.createdBy === user.email ? <DeleteIcon color='error' onClick={(e)=> handleDeleteComment(comment._id)} /> : <></>}
                            </InnerContainer>
                            <Box>
                                <Typography dangerouslySetInnerHTML={{ __html: comment.comment ? comment.comment.replace(/\n/g, '<br />') : '' }} />    
                            </Box>
                        </Component>
                    </Container2>
                ))}
            </Box>
        </Box>
    );
}

export default Comments;