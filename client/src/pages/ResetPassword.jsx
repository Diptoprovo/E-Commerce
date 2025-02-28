import React, { useContext, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom';

import axios from 'axios';
import { toast } from 'react-toastify';
import AppContext from '../context/ContextApp';
import { Button } from 'flowbite-react';
const ResetPassword = () => {


    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { backendURL, userData, getUserData, isLoggedin } = useContext(AppContext);
    const inputRefs = useRef([])
    const [emailSent, setEmailSent] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState('')

    axios.defaults.withCredentials = true;


    const inputHandler = (e, index) => {
        if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
            inputRefs.current[index + 1].focus();
        }
    }

    const keyDownHandler = (e, index) => {
        if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    }

    const pasteHandler = (e, index) => {
        const pasteData = e.clipboardData.getData('text');
        if (pasteData.length > 6) {
            toast.warn('OTP too big')
        }
        const chars = pasteData.split('');
        chars.forEach((char, index) => {
            if (inputRefs.current[index])
                inputRefs.current[index].value = char
        })
    }

    const onSubmitEmailHandler = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post(backendURL + '/api/auth/send-reset-otp', { email })
            if (data.success) {
                toast.success(data.message);
                setEmailSent(true);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const onSubmitOtpHandler = async (e) => {
        e.preventDefault();
        const otpArr = inputRefs.current.map(e => e.value);
        setOtp(otpArr.join(''));
        setOtpSent(true)
    }

    const onSubmitNewPasswordHandler = async (e) => {
        e.preventDefault();

        try {
            const { data } = await axios.post(backendURL + '/api/auth/reset-password', { email, otp, newPass: password });

            if (data.success) {
                toast.success(data.message)
                navigate('/login')
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message);
        }
    }

    return (
        <div className=''>
            {!emailSent && (
                <div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
                    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
                        {/* <img class="mx-auto h-10 w-auto" src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600" alt="Your Company" /> */}
                        <h2 class="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">Enter your registered email</h2>
                    </div>

                    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                        <form class="space-y-6" onSubmit={onSubmitEmailHandler}>

                            <label for="email" class="block text-sm/6 font-medium text-gray-900">Email address</label>
                            <div className='mb-2'>
                                <input type="email" name="email" id="email" onChange={e => setEmail(e.target.value)} value={email} autocomplete="email" required class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
                            </div>
                            <div>
                                <button type="submit" class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Get Reset OTP</button>
                            </div>
                        </form>


                    </div>
                </div>)}




            {emailSent && !otpSent && (
                <div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
                    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
                        <img class="mx-auto h-10 w-auto" src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600" alt="Your Company" />
                        <h2 class="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">Enter the OTP</h2>
                        <p className='pb-4 text-center text-gray-500 border-b-2 border-b-slate-300 '>OTP sent to your registered Email ID</p>
                    </div>

                    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                        <form class="space-y-6" onSubmit={onSubmitOtpHandler}>
                            <div className='flex justify-between mb-8'>
                                {Array(6).fill(0).map((_, index) => (
                                    <input type="text" key={index} maxLength='1' required
                                        className='w-12 h-12 text-center border-black rounded-md shadow hover:ease-in hover:bg-gray-200 hover:-translate-y-0.5 duration-75 '
                                        ref={e => inputRefs.current[index] = e}
                                        onInput={(e) => inputHandler(e, index)}
                                        onKeyDown={(e) => keyDownHandler(e, index)}
                                        onPaste={(e) => pasteHandler(e, index)}
                                    />
                                ))}
                            </div>
                            <div>
                                <Button color='green'>Submit OTP</Button>
                            </div>
                        </form>


                    </div>
                </div>
            )}




            {emailSent && otpSent && (
                <div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
                    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
                        <img class="mx-auto h-10 w-auto" src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600" alt="Your Company" />
                        <h2 class="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">Enter new password</h2>

                    </div>

                    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                        <form class="space-y-6" onSubmit={onSubmitNewPasswordHandler}>
                            <label for="password" class="block text-sm/6 font-medium text-gray-900">Password</label>
                            <div class="mt-2">
                                <input type="password" name="password" id="password" onChange={e => setPassword(e.target.value)} value={password} autocomplete="current-password" required class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
                            </div>
                            <div>
                                <button type="submit" class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Reset Password</button>
                            </div>
                        </form>


                    </div>
                </div>
            )}

        </div>
    )
}

export default ResetPassword
