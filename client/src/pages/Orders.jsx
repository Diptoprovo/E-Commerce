import { useState, useEffect, useContext } from "react";
import axios from "axios";
import AppContext from "../context/ContextApp";
import OrderItem from "../components/OrderItem";


const Orders = () => {
    const { backendURL, userData } = useContext(AppContext);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            console.log(userData.isSeller);
            try {
                const { data } = await axios.get(`${backendURL}/api/order/${userData.isSeller ? 'get-seller' : 'get-buyer'}`);
                if (data.success) {
                    console.log(data)
                    setOrders(data.response);
                }
            } catch (error) {
                console.error("Error fetching orders:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [backendURL, userData]);

    return (
        <div className="w-5/6 mx-auto p-6">
            <h2 className="text-2xl font-bold mb-4">Your Orders</h2>

            {loading ? (
                <p>Loading your orders...</p>
            ) : orders.length > 0 ? (
                <div className="space-y-4">
                    {orders.map(order => (
                        <OrderItem key={order._id} order={order} />
                    ))}
                </div>
            ) : (
                <p className="text-gray-500">You have no orders yet.</p>
            )}
        </div>
    );
};

export default Orders;
