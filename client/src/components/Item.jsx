import React, { useContext } from 'react'
import { Button, Card, Toast } from "flowbite-react";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import AppContext from '../context/ContextApp';


const Item = ({ item, onDelete }) => {
    // console.log(item)

    const { backendURL, userData } = useContext(AppContext);
    const navigate = useNavigate();

    const itemclickHandler = () => {
        console.log(item)
        userData.isSeller ? navigate(`/product-seller/${item._id}`) :
            navigate(`/product/${item._id}`);
    }

    const stopSell = async (req, res) => {
        try {
            const { data } = await axios.post(`${backendURL}/api/item/remove`, {
                itemId: item._id
            })
            console.log(data);
            onDelete(item._id);
        } catch (error) {
            console.log(error.message);
        }
    }


    return (
        <div>
            <Card
                className="max-w-sm"
            >
                <div className="h-40 w-full flex justify-center">
                    <img src={item.imageUrl} alt="Product" className="h-full w-auto object-cover rounded-lg" />
                </div>
                <a >
                    <h5 className="cursor-pointer text-xl font-semibold tracking-tight text-gray-900 dark:text-white" onClick={() => itemclickHandler()}>
                        {item.name}
                    </h5>
                </a>
                <div className='text-gray-400 text-wrap'>{item.description}</div>
                <div className="mb-5 mt-2.5 flex items-center">

                </div>
                <div className="flex items-center justify-between">
                    <span className="text-2xl md:text-lg font-bold text-gray-900 dark:text-white">{`₹ ${item.price}`}</span>
                    {userData.isSeller && (
                        <Button color='failure' onClick={stopSell}>Stop selling</Button>
                    )}

                </div>
            </Card>
        </div>
    )
}

export default Item
