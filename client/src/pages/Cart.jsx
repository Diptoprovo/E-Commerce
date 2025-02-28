import React, { useContext, useEffect, useState } from 'react'
import AppContext from '../context/ContextApp'
import { toast } from 'react-toastify';
import axios from 'axios';
import CartItem from '../components/CartItem';
import { Button } from 'flowbite-react';

const Cart = () => {

    const { backendURL, userData } = useContext(AppContext);
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadCart = async (req, res) => {
        setLoading(true);
        try {
            const { data } = await axios.get(`${backendURL}/api/cart/`);
            console.log("here");

            if (data.success) {
                console.log(data);
                setCart(data.cart);
            } else {
                toast.error("data.message");
                console.log(data);
            }

            setLoading(false);

        } catch (error) {
            toast.error(error.message);
            console.log(error.message);
        }

    }

    const handleDelete = (id) => {
        setCart(cart.filter(item => item._id !== id));
    }

    const placeOrder = async (req, res) => {
        try {
            const { data } = await axios.post(`${backendURL}/api/order/place-order`);

            console.log(data);
        } catch (error) {
            console.log(error.message);
        }
    }

    useEffect(() => {
        loadCart();
    }, []);


    return (
        <div>
            {loading ? (
                <div>Loading your cart .... </div>
            ) : (
                <div className="max-w-6xl mx-auto p-6">
                    <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
                    {cart.length > 0 ? (
                        <div className="w-full space-y-4 self-center flex flex-col items-center">
                            {cart.map((item) => (
                                <CartItem key={item._id} item={item} onDelete={handleDelete} />
                            ))}
                        </div>
                    ) : (
                        <p>Your cart is empty.</p>
                    )}
                </div>
            )}
            <div>
                {cart.length > 0 ?

                    (<Button color='success' onClick={placeOrder} className='left-3/4'>Place Order</Button>)
                    :
                    (<Button disabled color='success' onClick={placeOrder} className='left-3/4'>Place Order</Button>)
                }
            </div>
        </div>
    );
}

export default Cart
