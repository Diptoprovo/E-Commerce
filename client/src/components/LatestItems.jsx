import React, { useContext, useState, useEffect } from 'react'
import axios from 'axios'

import { HR } from 'flowbite-react'
import Title from './Title'

import AppContext from '../context/ContextApp'
import Item from './Item'

const LatestItems = ({ latest }) => {

    const { backendURL, isLoggedin, userData } = useContext(AppContext)
    const [latestItems, setLatestItems] = useState([]);

    const getLatest = async () => {
        try {
            const { data } = await axios.get(`${backendURL}/api/item/latest`); // Update with your actual API URL
            if (data.success) {
                console.log("Got data")
                setLatestItems(data.latest);
            } else {
                console.log('failed latest' + data.message);
            }
        } catch (error) {
            console.error("Error fetching latest items:", error);
        }
    };


    useEffect(() => {
        getLatest();
    }, []);

    return (
        <div className=''>
            <Title text1="Latest" text2="Collections" />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-5/6 mx-auto mt-10">
                {latestItems.map((item) => (
                    <div className=''>
                        <Item key={item._id} item={item} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LatestItems
