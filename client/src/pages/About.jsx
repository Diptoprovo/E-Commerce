import React from 'react'

import { useContext } from "react";
import { Button } from 'flowbite-react';
import AppContext from '../context/ContextApp';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const About = () => {
    const { userData, backendURL, setIsLoggedin, setUserData } = useContext(AppContext);
    const navigate = useNavigate();

    const verifyHandler = async () => {
        try {
            const { data } = await axios.post(`${backendURL}/api/auth/send-verify-otp`);
            if (data.success) {
                navigate('/email-verify');
                toast.success(data.message);
            } else {
                toast.error(data.message);
                console.log(data.message);
            }
        } catch (error) {
            toast.error(error.message);
            console.log(error.message);
        }
    }

    const logoutHandler = async () => {
        try {
            const { data } = await axios.post(`${backendURL}/api/auth/logout`);
            if (data.success) {
                setUserData({});
                setIsLoggedin(false);
                navigate('/');
                toast.success(data.message);
            } else {
                toast.error(data.message);
                console.log(data.message);
            }
        } catch (error) {
            toast.error(error.message);
            console.log(error.message);
        }
    }

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-3xl font-bold text-center mb-6">Profile</h2>

            {/* User Details */}
            <div className="space-y-4">
                <div>
                    <p className="text-gray-600">Name:</p>
                    <p className="text-lg font-semibold">{userData.name}</p>
                </div>
                <div>
                    <p className="text-gray-600">Email:</p>
                    <p className="text-lg font-semibold">{userData.email}</p>
                </div>
                <div>
                    <p className="text-gray-600">Address:</p>
                    <p className="text-lg font-semibold">{userData.address}</p>
                </div>
                <div>
                    <p className="text-gray-600">Phone:</p>
                    <p className="text-lg font-semibold">{userData.phone}</p>
                </div>
                <div>
                    <p className="text-gray-600">Account Type:</p>
                    <p className="text-lg font-semibold">
                        {userData.isSeller ? "Seller" : "Buyer"}
                    </p>
                </div>
            </div>

            {/* Verification Buttons */}
            <div className="mt-6 flex flex-col space-y-3">
                {!userData.isAccountVerified ? (
                    <Button color='success' onClick={verifyHandler}>
                        Verify Account
                    </Button>
                ) : (
                    <p className="text-green-600 text-center font-semibold">✔ Account Verified</p>
                )}

                <Button color='red' onClick={() => { navigate('/reset-password') }}>
                    Reset Password
                </Button>

                <Button color='green' onClick={logoutHandler}>Log out</Button>
            </div>
        </div>
    );
};

export default About;
