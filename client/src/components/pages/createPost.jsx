import axios from "axios";
import { useState, useContext } from "react";
import { UserContext } from "../../context/userContext";

import { Box, styled, FormControl, InputBase, Button, TextareaAutosize } from "@mui/material";
import { AddCircle as Add } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
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
    margin: 0 30px;
    font-size: 25px;
    border: 5px solid lightgray;
    border-radius: 10px;

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
`;

const initialBlog = {
    title: "",
    body: "",
    coverImageURL: "",
    createdBy: "",
    category: "",
    avatar: "",
}

const CreatePost = () => {

    const [blog, setBlog] = useState(initialBlog);
    const [pic, setPic] = useState("");

    const { user, isAuthenticated} = useContext(UserContext);
    const navigate = useNavigate();

    

    const url = blog.coverImageURL? blog.coverImageURL : "https://images.unsplash.com/photo-1543128639-4cb7e6eeef1b?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8bGFwdG9wJTIwc2V0dXB8ZW58MHx8MHx8&ixlib=rb-1.2.1&w=1000&q=80";



    const handleChange = (e) => {
        setBlog({...blog, [e.target.name]: e.target.value });
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];

        const reader = new FileReader();
        reader.onloadend = function () {
            setPic(reader.result);
            setBlog((prevBlog) => ({
                ...prevBlog,
                coverImageURL: reader.result,
            }));
        }
        reader.readAsDataURL(file); 
    }

    const handlePublish = async () => {
        if(!isAuthenticated){
            toast.warning("Please Login first");
            return;
        }

        try {
            if(!pic){
                toast.warning("please upload the cover Image");
                return;
            }
            const final_url = await axios.post("https://blogifybackend-anmol-ramolas-projects.vercel.app/upload", {
                image_url: pic,
            }, {withCredentials:true});
    
            const updatedBlog = {
                ...blog,
                coverImageURL: final_url.data.url,
                createdBy: user.email,
                avatar: user.profileImageUrl,
            };

            await axios.post("https://blogifybackend-anmol-ramolas-projects.vercel.app/create", updatedBlog, { withCredentials:true });
            toast.success("Blog created Successfully");
            setBlog(initialBlog);
            setPic("");
            navigate("/");

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
                <label htmlFor="fileInput">
                    <Add fontSize="large" color="action" />
                </label>
                <input type="file" id="fileInput" style={{ display: "none" }} onChange={handleFileUpload} />
                <InputTextField placeholder="Title" onChange={(e) => handleChange(e)} name="title" />
                <Button variant="contained" onClick={handlePublish}>Publish</Button>
            </StyledFormControl>

            <InputTextField2 placeholder="Category" onChange={(e) => handleChange(e)} name="category" />

            <TextArea minRows={5} placeholder="Tell your Story..." onChange={(e) => handleChange(e)} name="body" />
        </Container>
    )
}

export default CreatePost;