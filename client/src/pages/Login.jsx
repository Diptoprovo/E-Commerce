import React, { useContext, useState } from 'react'

import { Button, Checkbox, Label, TextInput } from "flowbite-react";
import { useNavigate, useSearchParams } from 'react-router-dom';

import axios from 'axios';
import { toast } from 'react-toastify';
import AppContext from '../context/ContextApp';

const Login = () => {

    const { backendURL, setIsLoggedin, getUserData } = useContext(AppContext);

    const [state, setState] = useState('Log in');
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [addr, setAddr] = useState();
    const [phone, setPhone] = useState();
    // const [seller, isSeller] = useState(false);
    const navigate = useNavigate();


    const handleState = () => {
        if (state === 'Log in') setState('Sign up')
        else setState('Log in')
    }

    const submitHandler = () => {
        if (state === 'Log in') {
            loginfn();
        } else {
            signupfn();
        }
    }

    const signupfn = async (req, res) => {
        try {

            const { data } = await axios.post(`${backendURL}/api/auth/register`, {
                name, email, password, address: addr, phone, isSeller: document.getElementById('remember').checked
            });

            if (data.success) {
                console.log("Registered");
                setIsLoggedin(true);
                getUserData();
                navigate('/');
            } else {
                alert(data.message);
            }

        } catch (error) {
            alert(error.message);
            console.log(error.message);
        }
    }

    const loginfn = async (req, res) => {
        try {
            const { data } = await axios.post(`${backendURL}/api/auth/login`, {
                email,
                password,
            });
            console.log("here" + data);
            if (data.success) {
                console.log("here")
                toast.success(data.message);
                setIsLoggedin(true);
                getUserData();

                navigate('/');

            } else {
                alert(data.message)
                console.log(data);
            }
        } catch (error) {
            alert(error.message)
            console.error('Error logging in:', error);
        }
    }

    return (
        <div className='flex w-screen justify-center mt-10'>

            <form className="flex w-1/3 flex-col gap-4">
                <Button.Group className='justify-center '>
                    <Button className='w-1/2' color={(state === 'Log in') ? "success" : "gray"} onClick={handleState}>Log in</Button>
                    <Button className='w-1/2' color={(state === 'Log in') ? "gray" : "success"} onClick={handleState}>Sign up</Button>
                </Button.Group>
                {state === 'Sign up' && (<div>
                    <div className="mb-2 block">
                        <Label htmlFor="name1" value="Your name" />
                    </div>
                    <TextInput id="name1" required value={name} onChange={(e) => setName(e.target.value)} />
                </div>)}
                <div>
                    <div className="mb-2 block">
                        <Label htmlFor="email1" value="Your email" />
                    </div>
                    <TextInput id="email1" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div>
                    <div className="mb-2 flex flex-row justify-between">
                        <Label htmlFor="password1" value="Your password" />
                        {state === 'Log in' && (<a href="/reset-password" className='text-blue-700 cursor-pointer'>Forgot Password?</a>)}
                    </div>
                    <TextInput id="password1" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                {state === 'Sign up' && (<div>
                    <div className="mb-2 block">
                        <Label htmlFor="addr1" value="Your Address" />
                    </div>
                    <TextInput id="addr1" required value={addr} onChange={(e) => setAddr(e.target.value)} />
                </div>)}
                {state === 'Sign up' && (<div>
                    <div className="mb-2 block">
                        <Label htmlFor="phone1" value="Your Phone" />
                    </div>
                    <TextInput id="phone1" required value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>)}
                <div>

                </div>
                {state === 'Sign up' && (<div className="flex items-center gap-2">
                    <Checkbox id="remember" />
                    <Label htmlFor="remember">Are you a seller?</Label>
                </div>)}
                <Button onClick={submitHandler} color='success'>Submit</Button>
            </form>
        </div>
    )
}

export default Login
