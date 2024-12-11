import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { Box,TextField, Button, styled, Typography } from "@mui/material";
import { toast } from "react-toastify";




const Component = styled(Box)`
    width: 400px;
    margin: auto;
    box-shadow: 5px 2px 5px 2px rgb( 0 0 0/ 0.6);
`;

const Image = styled('img')({
    width: 100,
    margin: 'auto',
    display: 'flex',
    padding: '50px 0 0',
});

const Wrapper = styled(Box)`
    padding: 25px 35px;
    display: flex;
    flex: 1;
    flex-direction: column;
    & > div, & button, & > p {
        margin-top: 20px;
    }
`;

const LoginButton = styled(Button)`
    text-transform: none;
    background: #795548;
    color: #fff;
    height: 48px;
    border-radius: 2px;
`;

const SignUpButton = styled(Button)`
    text-transform: none;
    background: #fff;
    color: #2874f0;
    height: 48px;
    border-radius: 2px;
    box-shadow: 0 2px 4px 0 rgb(0 0 0/ 20%);
`;

const Text = styled(Typography)`
    color: #878787;
    font-size: 14px;
`;

const signupInitialValues = {
    fullName: "",
    email: "",
    password: "",
    profileImageUrl: "",

};

const SignUp = () => {

    const navigate = useNavigate();

    const imageURL = 'https://www.reshot.com/preview-assets/icons/GBS74MN5VQ/blogging-GBS74MN5VQ.svg';

    const [pic, setPic] = useState("");
    

    const [signup, setSignup] = useState(signupInitialValues);
    
    const onValueChange = (e) => {
        setSignup({...signup, [e.target.name]: e.target.value});
    }

    const handleFileUpload = (e) => {
        const file = e.target.files[0];

        const reader = new FileReader();
        reader.onloadend = function () {
            setPic(reader.result);
        }
        reader.readAsDataURL(file); 
    }

    const handleSignup = async () => {
        try {

            let imageURL = "";

            if(pic) {
                const final_url = await axios.post("https://blogifybackend-anmol-ramolas-projects.vercel.app/uploadAvatar", {
                    image_url: pic,
                });
                imageURL = final_url.data.url;

            }

            let updatedSignup = { ...signup };

            if(pic){
                updatedSignup = { ...signup, profileImageUrl: imageURL };
            }
            



            const res = await axios.post("https://blogifybackend-anmol-ramolas-projects.vercel.app/signup",updatedSignup);

            if(res.status === 200) {
                toast.success(res.data.msg);
                navigate('/login');
            }
            
        } catch (error) {
            if (error.response) {
                
                if(error.response.status === 400){
                    toast.warning(error.response.data.msg);
                }
                else{
                    toast.error(error.response.data.msg); 
                }

            } else {
                toast.error('An unexpected error occurred. Please try again later.');
            }
        }
    }


    return(
        <>
            <div style={{marginTop: "100px"}}>
            <Component>
                <Box>
                    <Image src={imageURL} alt="login" />
                    
                    <Wrapper>
                        <TextField required variant="standard" name="fullName" label="Full Name" onChange={(e) => onValueChange(e)} />
                        <TextField type="email" required variant="standard"  name="email" label="Email" onChange={(e) => onValueChange(e)} />
                        <TextField type="password" required variant="standard"  name="password" label="Password" onChange={(e) => onValueChange(e)} />
                        <input type="file" onChange={handleFileUpload} className="mt-8 mb-8 file-input file-input-bordered file-input-info w-full max-w-xs" />
                        
                        <SignUpButton onClick={handleSignup} >SignUp</SignUpButton>
                        <Text style={{ textAlign:'center '}}>OR</Text>
                        <LoginButton onClick={()=>{navigate('/login')}} variant="contained" >Already have an account?</LoginButton>
                    </Wrapper>
                </Box>
            </Component>
            </div>
        </>
    )
}

export default SignUp;