import React, { useContext } from 'react'
import { Card } from "flowbite-react";
import AppContext from '../context/ContextApp';

const OrderItem = ({ order }) => {

    const { userData } = useContext(AppContext);

    return (
        <Card className="p-4 shadow-lg">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Order ID: {order.orderId}</h3>
                <span className={`px-3 py-1 rounded-full text-white ${order.status === "Shipped" ? "bg-green-500" : order.status === 'Cancelled' ? 'bg-red-500' : "bg-yellow-500"}`}>
                    {order.status}
                </span>
            </div>

            {/* Order Details */}
            <p className="text-gray-600">Placed On: {new Date(order.createdAt).toLocaleDateString()}</p>
            <p className="text-gray-600">Total: <span className="font-bold">${order.total.toFixed(2)}</span></p>

            {/* Product Details */}
            <div className="flex items-center gap-4 border-t pt-3 mt-3">
                <img src={order.product.imageUrl} alt={order.product.name} className="w-16 h-16 object-cover rounded-md shadow" />
                <div>
                    <h4 className="text-md font-semibold">{order.product.name}</h4>
                    <p className="text-gray-500">Price: ₹{order.product.price.toFixed(2)}</p>
                    <p className="text-gray-500">Quantity: {order.quantity}</p>
                </div>
            </div>

            {/* Seller Info */}
            {!userData.isSeller && (<div className="mt-3 border-t pt-3">
                <p className="text-gray-600"><span className="font-semibold">Seller:</span> {order.seller.name}</p>
                <p className="text-gray-500">{order.seller.email}</p>
            </div>)}

        </Card>
    );
};

export default OrderItem;