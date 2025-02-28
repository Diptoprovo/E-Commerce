import React, { useContext, useEffect, useRef } from 'react'
import { toast } from 'react-toastify';

import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AppContext from '../context/ContextApp';

const EmailVerify = () => {

    const navigate = useNavigate();
    const { backendURL, userData, getUserData, isLoggedin } = useContext(AppContext);
    const inputRefs = useRef([])

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

    const onSubmitHandler = async (e) => {
        try {
            e.preventDefault();

            const otpArr = inputRefs.current.map(e => e.value);
            const otp = otpArr.join('');

            const { data } = await axios.post(backendURL + '/api/auth/verify-account', { otp })

            if (data.success) {
                toast.success(data.message);
                getUserData();
                navigate('/about')
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(() => {
        isLoggedin && userData && userData.isAccountVerified && navigate('/about')
    }, [isLoggedin, userData])

    return (
        <>
            <div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
                <div class="sm:mx-auto sm:w-full sm:max-w-sm">
                    <img class="mx-auto h-10 w-auto" src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600" alt="Your Company" />
                    <h2 class="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">Enter the OTP</h2>
                    <p className='pb-4 text-center text-gray-500 border-b-2 border-b-slate-300 '>OTP sent to your registered Email ID</p>
                </div>

                <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form class="space-y-6" onSubmit={onSubmitHandler}>
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
                            <button type="submit" class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Submit OTP</button>
                        </div>
                    </form>


                </div>
            </div>

        </>
    )
}

export default EmailVerify
