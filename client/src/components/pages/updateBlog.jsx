import axios from "axios";
import { useState, useEffect } from "react";

import { Box, styled, FormControl, InputBase, Button, TextareaAutosize } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

import { toast } from "react-toastify";


const Container = styled(Box)`
    margin: 100px 100px;

    @media (max-width: 600px) {
        margin: 100px 20px; /* Remove horizontal margin on small devices */
    }
`

const Image = styled("img")({
    width: "100%",
    height: "50vh",
    objectFit: "cover"
});

const StyledFormControl = styled(FormControl)`
    margin-top: 10px;
    display: flex;
    flex-direction: row;
`;

const InputTextField = styled(InputBase)`
    flex: 1;
    margin-right: 30px;
    font-size: 25px;
    border: 5px solid lightgray;
    border-radius: 10px;
    word-break: break-word;

    @media (max-width: 600px) {
        margin: 0px 10px; /* Remove horizontal margin on small devices */
    }
`;

const InputTextField2 = styled(InputBase)`
    flex: 1;
    width: 100%;
    margin-top: 50px;
    font-size: 18px;
    border: 5px solid lightgray;
    border-radius: 10px;
    
`;
const TextArea = styled(TextareaAutosize)`
    width: 100%;
    margin-top: 50px;
    font-size: 18px;
    border: 5px solid lightgray;
    border-radius: 10px;
    word-break: break-word;
`;

const initialBlog = {
    title: "",
    body: "",
    coverImageURL: "",
    createdBy: "",
    category: "",
    avatar: "",
}

const UpdateBlog = () => {

    const [blog, setBlog] = useState(initialBlog);

    const navigate = useNavigate();
    const { id } = useParams();

    

    const url = blog.coverImageURL? blog.coverImageURL : "https://images.unsplash.com/photo-1543128639-4cb7e6eeef1b?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8bGFwdG9wJTIwc2V0dXB8ZW58MHx8MHx8&ixlib=rb-1.2.1&w=1000&q=80";


    useEffect(() => {
        const getBlog = async () => {
            try {
                const res = await axios.get(`https://blogifybackend-anmol-ramolas-projects.vercel.app/blog/${id}`);
                setBlog(res.data);
                


            } catch (error) {
                if (error.response.status === 404) {
                    toast.error(error.response.data.msg);
                    return;
                }
                else{
                console.log(error);
                toast.error("Failed to fetch blog");
                }
                
            }
        }
        getBlog();
    },[id]);

    const handleChange = (e) => {
        setBlog({...blog, [e.target.name]: e.target.value });
    };

    const handleUpdate = async () => {
        
        try {
            await axios.post(`https://blogifybackend-anmol-ramolas-projects.vercel.app/update/${id}`, blog, { withCredentials:true });
            toast.success("Blog updated Successfully");
            setBlog(initialBlog);
            navigate(`/blog/${id}`);

        } catch (error) {
            if(error.response.status === 401){
                toast.error(error.response.data.msg);
            }
            else{
                toast.error("something went wrong");
                console.log(error);
            }

            
        }
    }

    

    

    return(
        <Container>
            <Image src={url} alt="banner" />

            <StyledFormControl>
                
                <InputTextField placeholder="Title" value={blog.title} onChange={(e) => handleChange(e)} name="title" />
                <Button variant="contained" onClick={handleUpdate}>Update</Button>
            </StyledFormControl>

            <InputTextField2 placeholder="Category" value={blog.category} onChange={(e) => handleChange(e)} name="category" />

            <TextArea minRows={5} placeholder="Tell your Story..." value={blog.body} onChange={(e) => handleChange(e)} name="body" />
        </Container>
    )
}

export default UpdateBlog;