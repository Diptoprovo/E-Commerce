import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Card } from 'flowbite-react';
import AppContext from '../context/ContextApp';

const AdminHome = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const { backendURL } = useContext(AppContext);

    // Fetch all items from backend
    useEffect(() => {
        const fetchItems = async () => {
            try {
                const { data } = await axios.get(`${backendURL}/api/item/all`);
                if (data.success) {
                    setItems(data.items);
                    console.log(data.message);
                    console.log(data.items);
                }
            } catch (error) {
                console.error('Error fetching items:', error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchItems();
    }, []);

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">All Products</h1>

            {loading ? (
                <p>Loading...</p>
            ) : items.length === 0 ? (
                <p>No items found.</p>
            ) : (
                <div className="space-y-4">
                    {items.map(item => (
                        <div key={item.id} className="flex flex-row p-4 shadow-lg rounded-xl">
                            <img src={item.imageUrl || 'https://via.placeholder.com/150'} alt={item.name} className="w-32 h-32 object-cover rounded-md" />
                            <div className="flex flex-col justify-between ml-4">
                                <h2 className="text-lg font-semibold">{item.name}</h2>
                                <p className="text-gray-600">{item.description}</p>
                                <p className="font-bold text-blue-600">${item.price}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminHome;
