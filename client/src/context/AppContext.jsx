import axios from "axios"
import { createContext, useEffect, useState } from "react";
import AppContext from "./ContextApp";
import { toast } from "react-toastify";



export const AppContextProvider = (props) => {
    axios.defaults.withCredentials = true;

    const backendURL = import.meta.env.VITE_BACKENDURL;
    const [isLoggedin, setIsLoggedin] = useState(false);
    const [userData, setUserData] = useState(false);
    const [admin, setAdmin] = useState(false);

    const getAuthState = async () => {
        try {
            const { data } = await axios.get(backendURL + '/api/auth/is-auth')
            if (data.success) {
                setIsLoggedin(true);
                getUserData();
                console.log("Auth bro")
            } else {
                console.log("not auth bro")
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const getUserData = async () => {
        try {
            const { data } = await axios.get(backendURL + '/api/user/data')
            data.success ? setUserData(data.userData) : toast.error(data.message)
            setAdmin(data.userData.name === 'Admin');
        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(() => {
        getAuthState();
    }, [])

    const value = {
        backendURL,
        isLoggedin, setIsLoggedin,
        userData, setUserData,
        getUserData, admin
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}
