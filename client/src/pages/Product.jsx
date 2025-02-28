import React, { useContext, useEffect } from 'react'
import { useParams } from 'react-router-dom'

import axios from 'axios';
import { useState } from "react";
import { Button, TextInput, Label } from 'flowbite-react';
import AppContext from '../context/ContextApp';
import { toast } from 'react-toastify';

const Product = () => {
    const { productId } = useParams(); // Get product ID from URL
    const { backendURL } = useContext(AppContext);
    const [quantity, setQuantity] = useState(1);
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [comments, setComments] = useState([]);
    const [rating, setRating] = useState(0);

    const getProduct = async (req, res) => {
        //setLoading(true);
        try {
            console.log(productId);
            const { data } = await axios.get(`${backendURL}/api/item/get`, {
                params: { productId }
            })
            if (data.success) {
                setProduct(data.productData);
            }

            console.log(data)
            setLoading(false);
        } catch (error) {
            alert(error.message);
            console.log(error.message);
        }
    }

    const getComments = async (req, res) => {

        try {
            const { data } = await axios.get(`${backendURL}/api/comment/get`, {
                params: { productId }
            })

            console.log("data ", data);

            if (data.success) {
                setComments(data.comments);
            }
        } catch (error) {
            alert(error.message);
            console.log(error.message);
        }
    }

    const addComment = async (req, res) => {
        try {
            const { data } = await axios.post(`${backendURL}/api/comment/add`, {
                productId,
                text: document.getElementById('email1').value,
                stars: document.getElementById('password1').value
            })

            console.log(data);
            toast.success(data.message);
            getComments();
        } catch (error) {
            alert(error.message);
            console.log(error.message);
        }
    }

    const addToCart = async (req, res) => {
        console.log("here");
        try {
            const { data } = await axios.post(`${backendURL}/api/cart/add`, {
                productId,
                qty: quantity
            })

            console.log(data);
            toast.success(data.message);

        } catch (error) {
            console.log(error.message);
            alert(error.message);
        }
    }

    // useEffect(() => {
    //     calcRating();
    // })


    useEffect(() => {
        getProduct();
        getComments(); // ✅ Runs initially even if productId is not set
    }, []); // Runs only once when the component mounts

    return (<>
        {(!loading) ? (

            <div className="max-w-5xl mx-auto p-6 mt-10">
                {/* Product Details */}
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Product Image */}
                    <img src={product.imageUrl} alt={product.name} className="w-full rounded-xl shadow-lg" />

                    {/* Product Info */}
                    <div className="flex flex-col space-y-4">
                        <h1 className="text-3xl font-semibold">{product.name}</h1>
                        <p className="text-gray-600">{product.description}</p>
                        <p className="text-xl font-bold text-green-600">₹{product.price?.toFixed(2)}</p>
                        <p className="text-gray-500">Sold by: <span className="font-semibold">{product.seller?.name || 'Unknown Seller'}</span></p>

                        {/* Quantity Selector */}
                        <div className="flex items-center space-x-4">
                            <label className="text-gray-700">Quantity:</label>
                            <input
                                type="number"
                                value={quantity}
                                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value)))}
                                className="w-16 border rounded px-2 py-1 text-center"
                                min="1"
                                max={product.stock || 1}
                            />
                        </div>

                        {/* Add to Cart Button */}
                        <Button className="flex items-center gap-2 w-full" onClick={addToCart}>
                            Add to Cart
                        </Button>
                    </div>
                </div>

                {/* Product Reviews */}

                <div className="mt-6 rounded-lg p-6 shadow-lg">
                    <h2 className="text-2xl font-semibold">Reviews</h2>
                    <div className='flex flex-col justify-start w-2/3 my-10 '>
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="email1" value="Your Comment" />
                            </div>
                            <TextInput id="email1" type="text" placeholder="Please leave a comment" required />
                        </div>
                        <div className='flex flex-row justify-between mt-4' >
                            <div className='flex flex-row justify-between w-1/4'>

                                <div className="mb-2 block">
                                    <Label htmlFor="password1" value="Stars:" />
                                </div>
                                <TextInput id="password1" type="number" max={5} min={1} required />
                            </div>
                            <Button color='success' className='' onClick={addComment}>Add comment</Button>
                        </div>
                    </div>
                    {comments.length > 0 ? (
                        comments.map((comment) => (
                            <div key={comment._id} className="p-4 bg-gray-100 rounded-lg mt-4">
                                <p>{"⭐".repeat(Number(comment.stars))}</p>
                                <p className="text-gray-600">{comment.text}</p>
                                <p className="text-gray-500 text-sm mt-2">- {comment.userId.name}</p>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 mt-4">No reviews yet.</p>
                    )}
                </div>

            </div>
        ) : (
            <p className="text-center text-gray-500">Loading product...</p>
        )
        }

    </>
    );
};

export default Product;
