import React, { useContext, useEffect, useState } from 'react'
import Title from './Title'
import AppContext from '../context/ContextApp'
import Item from './Item';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Button } from 'flowbite-react';
import { useNavigate } from 'react-router-dom';

const SellerItems = () => {
    const { backendURL, isLoggedin, userData } = useContext(AppContext);
    const [items, setItems] = useState([]);
    const navigate = useNavigate();

    const getItems = async (req, res) => {
        try {
            const { data } = await axios.get(`${backendURL}/api/item/`); // Update with your actual API URL
            if (data.success) {
                console.log("got all items")
                setItems(data.items);
            } else {
                console.log("Failed all");
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    const handleDelete = (id) => {
        setItems(items.filter(item => item._id !== id));
    }

    const addItems = () => {
        navigate('add-item');
    }

    useEffect(() => {
        getItems();
    }, []);

    return (
        <div>
            <Title text1="Your" text2="Products" />
            <div className='flex justify-end w-2/3 mx-auto my-10'>
                <Button color='light' onClick={addItems}>
                    <lord-icon
                        src="https://cdn.lordicon.com/sbnjyzil.json"
                        trigger="hover"
                        style={{ width: "50px", height: "50px" }}>
                    </lord-icon>
                </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-5/6 mx-auto mt-10">
                {items.map((item) => (
                    <div className=''>
                        <Item key={item._id} item={item} onDelete={handleDelete} />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default SellerItems
