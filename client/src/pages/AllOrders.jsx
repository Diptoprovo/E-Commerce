import React, { useCallback, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import AppContext from '../context/ContextApp';

const AllOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { backendURL } = useContext(AppContext);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const { data } = await axios.get(`${backendURL}/api/admin/get-all-orders`);
                if (data.success) {
                    setOrders(data.response);
                } else {
                    console.error(data.message);
                }
            } catch (error) {
                console.error('Error fetching orders:', error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            const { data } = await axios.post(`${backendURL}/api/admin/change-status`, {
                orderId,
                status: newStatus
            });

            if (data.success) {
                if (newStatus === "Delivered") {
                    // Remove the order from the state
                    setOrders(prevOrders => prevOrders.filter(order => order.orderId !== orderId));
                } else {
                    // Update the order status in the state
                    setOrders(prevOrders =>
                        prevOrders.map(order =>
                            order.orderId === orderId ? { ...order, status: newStatus } : order
                        )
                    );
                }
            } else {
                console.error(data.message);
            }
        } catch (error) {
            console.error('Error updating status:', error);
        }
    }


    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">All Orders</h1>

            {loading ? (
                <p>Loading...</p>
            ) : orders.length === 0 ? (
                <p>No orders found.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                        <thead className="bg-gray-100">
                            <tr className="text-left">
                                <th className="px-4 py-2">Order ID</th>
                                <th className="px-4 py-2">Buyer</th>
                                <th className="px-4 py-2">Seller</th>
                                <th className="px-4 py-2">Product</th>
                                <th className="px-4 py-2">Quantity</th>
                                <th className="px-4 py-2">Total</th>
                                <th className="px-4 py-2">Status</th>
                                <th className="px-4 py-2">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order.orderId} className="border-t">
                                    <td className="px-4 py-2">{order.orderId}</td>
                                    <td className="px-4 py-2">{order.buyer.name} ({order.buyer.email})</td>
                                    <td className="px-4 py-2">{order.seller.name} ({order.seller.email})</td>
                                    <td className="px-4 py-2 flex items-center gap-2">
                                        <img src={order.product.imageUrl || 'https://via.placeholder.com/50'} alt={order.product.name} className="w-12 h-12 object-cover rounded" />
                                        {order.product.name} - ₹{order.product.price}
                                    </td>
                                    <td className="px-4 py-2">{order.quantity}</td>
                                    <td className="px-4 py-2">₹{order.totalAmount}</td>
                                    <td className="px-4 py-2">
                                        <select
                                            value={order.status}
                                            onChange={(e) => updateOrderStatus(order.orderId, e.target.value)}
                                            className="border rounded px-2 py-1 bg-white cursor-pointer"
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Shipped">Shipped</option>
                                            <option value="Delivered">Delivered</option>
                                            <option value="Cancelled">Cancelled</option>
                                        </select>
                                    </td>
                                    <td className="px-4 py-2">{new Date(order.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AllOrders;
