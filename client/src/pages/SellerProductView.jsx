import React, { useContext, useEffect } from 'react'
import { useParams } from 'react-router-dom'

import axios from 'axios';
import { useState } from "react";
import { Button, TextInput } from 'flowbite-react';
import AppContext from '../context/ContextApp';
import { toast } from 'react-toastify';

const SellerProductView = () => {

    const { productId } = useParams(); // Get product ID from URL
    const { backendURL } = useContext(AppContext);
    const [quantity, setQuantity] = useState(1);
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [defaultQty, setDefaultQty] = useState(0);
    const [price, setPrice] = useState(0);
    const [desc, setDesc] = useState('');

    const getProduct = async (req, res) => {
        //setLoading(true);
        try {
            console.log(productId);
            const { data } = await axios.get(`${backendURL}/api/item/get`, {
                params: { productId }
            })
            if (data.success) {
                setProduct(data.productData);
                setDefaultQty(data.productData.stock)
                setQuantity(data.productData.stock);
                setPrice(data.productData.price);
                setDesc(data.productData.description);
            }

            console.log(data)
            setLoading(false);
        } catch (error) {
            toast.error(error.message);
            console.log(error.message);
        }
    }

    const addToStock = async (req, res) => {
        console.log("here");
        try {
            const { data } = await axios.put(`${backendURL}/api/item/add-to-stock`, {
                itemId: productId,
                qty: quantity
            })
            if (data.success) {
                setDefaultQty(data.item.stock)
            }
            console.log(data);
            toast.success(data.message);

        } catch (error) {
            console.log(error.message);
            toast.error(error.message);
        }
    }

    const modifyItem = async (req, res) => {
        console.log("here");
        try {
            const { data } = await axios.put(`${backendURL}/api/item/modify`, {
                itemId: productId,
                description: desc
            })

            console.log(data);
            toast.success(data.message);

        } catch (error) {
            console.log(error.message);
            toast.error(error.message);
        }
    }


    useEffect(() => {
        getProduct();
    }, []);

    // Sample product data (Replace with API call)
    // const product = {
    //     id: productId,
    //     name: "Wireless Headphones",
    //     description: "High-quality wireless headphones with noise cancellation.",
    //     price: 199.99,
    //     image: "https://via.placeholder.com/400",
    //     seller: "TechStore",
    //     reviews: [
    //         { user: "Alice", rating: 5, comment: "Amazing sound quality!" },
    //         { user: "Bob", rating: 4, comment: "Great, but a bit expensive." },
    //     ],
    // };

    return (<>
        {(!loading) ? (

            <div className="max-w-5xl mx-auto p-6">
                {/* Product Details */}
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Product Image */}
                    <img src={product.imageUrl} alt={product.name} className="w-full rounded-xl shadow-lg" />

                    {/* Product Info */}
                    <div className="flex flex-col space-y-4">
                        <h1 className="text-3xl font-semibold">{product.name}</h1>
                        {/* <p className="text-gray-600">{product.description}</p> */}
                        <TextInput value={desc} onChange={(e) => setDesc(e.target.value)} />
                        {/* <TextInput type='number' className="text-xl font-bold text-green-600" value={price} onChange={(e) => setPrice(e.target.value)} /> */}
                        <p className="text-xl font-bold text-green-600">${product.price?.toFixed(2)}</p>

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
                            />
                            {quantity > defaultQty && (
                                <Button color='success' onClick={addToStock} >{`Add ${quantity - defaultQty} to stock`}</Button>
                            )}

                        </div>

                        {/* Add to Cart Button */}
                        <Button className="flex items-center gap-2 w-full" onClick={modifyItem}>
                            Save item details
                        </Button>
                    </div>
                </div>
            </div>
        ) : (
            <p className="text-center text-gray-500">Loading product...</p>
        )
        }

    </>
    );
}

export default SellerProductView
