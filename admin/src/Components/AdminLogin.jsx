import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { Box,TextField, Button, styled } from "@mui/material";

// toasts
import { toast } from 'react-toastify';


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


const loginInitialValues = {
    email: "",
    password: ""
};

const Login = () => {


    const imageURL = 'https://www.reshot.com/preview-assets/icons/GBS74MN5VQ/blogging-GBS74MN5VQ.svg';

    const navigate = useNavigate();

    const [login, setLogin] = useState(loginInitialValues);

    const onValueChange = (e) => {
        setLogin({...login, [e.target.name]: e.target.value});
    }

    const handleLogin = async () => {
        
        if(!login.email || !login.password){
            toast.warning("all fields are required");
            return;
        }
        
        try {

            const res = await axios.post("https://blogifybackend-anmol-ramolas-projects.vercel.app/loginAdmin",login, {
                withCredentials: true,
            });

            if(res.status === 200) {
                toast.success(res.data.msg);
                navigate('/dashboard');
            }
            
        } catch (error) {
            if (error.response) {
                
                if(error.response.status === 400){
                    toast.error(error.response.data.msg);
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
        <div style={{marginTop: "100px"}}> 
        <Component>
            <Box>
              <Image src={imageURL} alt="login" />
              <Wrapper>
                <TextField required type="email" variant="standard" name="email" label="Admin email" onChange={(e) => {onValueChange(e)}} />
                <TextField style={{marginBottom: "30px"}} required type="password" variant="standard" name="password" label="Admin Password" onChange={(e) => {onValueChange(e)}} />

                <LoginButton onClick={handleLogin} variant="contained">Admin Login</LoginButton>
              </Wrapper>
            </Box>
        </Component>
        </div>
    )
}

export default Login;
