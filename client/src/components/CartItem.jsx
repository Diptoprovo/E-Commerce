import React, { useContext, useEffect, useState } from 'react'
import { Card, Button } from 'flowbite-react'
import axios from 'axios';
import AppContext from '../context/ContextApp';


const CartItem = ({ item, onDelete }) => {

    const { backendURL } = useContext(AppContext);
    const [quantity, setQuantity] = useState();

    const removeFromCart = async (req, res) => {
        try {
            const { data } = await axios.post(`${backendURL}/api/cart/remove`, {
                cartItemId: item._id,
                quantity: item.quantity
            });

            console.log(data);
            if (data.success) {
                onDelete(item._id);
            }

        } catch (error) {
            console.log(error.message);
        }
    }



    return (
        <div className="max-w-5xl mx-auto p-6 w-full rounded-xl border-2 border-gray-200">
            {/* Product Details */}
            <div className="grid md:grid-cols-[2fr_3fr] gap-6 w-full">
                {/* Product Image */}
                <img src={item.imageUrl} alt={item.name} className="w-full rounded-xl shadow-lg" />

                {/* Product Info */}
                <div className="flex flex-col space-y-4 w-full flex-1">
                    <h1 className="text-3xl font-semibold">{item.name}</h1>
                    <p className="text-xl font-bold text-green-600">₹{item.price?.toFixed(2)}</p>

                    {/* Quantity Selector */}
                    <div className="flex items-center space-x-4">
                        <label className="text-gray-700">{`Quantity: ${item.quantity}`}</label>
                    </div>

                    <div className="flex items-center space-x-4">
                        <label className="text-xl text-green-600 font-bold">{`Total: ₹ ${item.totalPrice}`}</label>
                    </div>

                    <div>
                        <Button color='red' onClick={removeFromCart}>
                            <lord-icon
                                src="https://cdn.lordicon.com/hwjcdycb.json"
                                trigger="hover"
                                style={{ width: '30px', height: "30px" }}>
                            </lord-icon>
                        </Button>
                    </div>

                    {/* Add to Cart Button */}
                </div>
            </div>
        </div>


    );

}

export default CartItem
