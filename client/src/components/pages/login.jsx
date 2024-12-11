import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { Box, TextField, Button, styled, Typography } from "@mui/material";

// toasts
import { toast } from 'react-toastify';

// Contexts
import { UserContext } from "../../context/userContext";

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

const loginInitialValues = {
    email: "",
    password: ""
};

const Login = () => {

    //global variable
    const { setUser, setIsAuthenticated } = useContext(UserContext);

    const imageURL = 'https://www.reshot.com/preview-assets/icons/GBS74MN5VQ/blogging-GBS74MN5VQ.svg';

    const navigate = useNavigate();

    const [login, setLogin] = useState(loginInitialValues);

    const onValueChange = (e) => {
        setLogin({...login, [e.target.name]: e.target.value});
    }

    const getUserData = async () => {
        try {
            const res = await axios.get("https://blogifybackend-anmol-ramolas-projects.vercel.app/userData",{
                withCredentials: true,
            });
    
            if(!res){
                toast.error("Error fetching user data");
                return;
            }

            if(res.status === 200){
                return res.data;
            }
        } catch (error) {
            toast.error("Error fetching user data");
            console.log(error);
        }

        
    }

    const handleLogin = async () => {
        
        if(!login.email || !login.password){
            toast.warning("all fields are required");
            return;
        }
        
        try {

            const res = await axios.post("https://blogifybackend-anmol-ramolas-projects.vercel.app/login",login, {
                withCredentials: true,
            });

            if(res.status === 200) {
                const userData = await getUserData();

                if(!userData){
                    toast.error("Error fetching userdata");
                    return;
                }
                setUser(userData);
                setIsAuthenticated(true);
                toast.success(res.data.msg);
                navigate('/');
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
                <TextField required type="email" variant="standard" name="email" label="email" onChange={(e) => {onValueChange(e)}} />
                <TextField required type="password" variant="standard" name="password" label="Password" onChange={(e) => {onValueChange(e)}} />

                <LoginButton onClick={handleLogin} variant="contained">Login</LoginButton>
                <Text style={{ textAlign:'center '}}>OR</Text>
                <SignUpButton onClick={()=> {navigate("/signup")}} >Create an account</SignUpButton>
              </Wrapper>
            </Box>
        </Component>
        </div>
    )
}

export default Login;