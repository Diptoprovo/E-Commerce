// import React, { useContext, useEffect, useState } from 'react'
// import Title from './Title'
// import AppContext from '../context/ContextApp'
// import Item from './Item';
// import { toast } from 'react-toastify';
// import axios from 'axios';

// const AllItems = () => {

//     const { backendURL, isLoggedin, userData } = useContext(AppContext);
//     const [items, setItems] = useState([]);

//     const getItems = async (req, res) => {
//         try {
//             const { data } = await axios.get(`${backendURL}/api/item/all`); // Update with your actual API URL
//             if (data.success) {
//                 console.log("got all items")
//                 setItems(data.items);
//             } else {
//                 console.log("Failed all");
//             }
//         } catch (error) {
//             toast.error(error.message);
//         }
//     }

//     useEffect(() => {
//         getItems();
//     }, []);

//     return (
//         <div>
//             <Title text1="Our" text2="Collections" />
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-5/6 mx-auto mt-10">
//                 {items.map((item) => (
//                     <div className=''>
//                         <Item key={item._id} item={item} />
//                     </div>
//                 ))}
//             </div>
//         </div>
//     )
// }

// export default AllItems


import React, { useContext, useEffect, useState } from 'react';
import Title from './Title';
import AppContext from '../context/ContextApp';
import Item from './Item';
import { toast } from 'react-toastify';
import axios from 'axios';

const AllItems = ({ filters }) => {
    const { backendURL } = useContext(AppContext);
    const [items, setItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);

    useEffect(() => {
        const getItems = async () => {
            try {
                const { data } = await axios.get(`${backendURL}/api/item/all`);
                if (data.success) {
                    setItems(data.items);
                    setFilteredItems(data.items); // Show all items initially
                } else {
                    console.log("Failed to fetch items");
                }
            } catch (error) {
                toast.error(error.message);
            }
        };
        getItems();
    }, []);

    useEffect(() => {
        if (!filters || (!filters.sort && !filters.category.length && filters.priceRange === 1000)) {
            setFilteredItems(items); // No filters applied, show all items
            return;
        }

        let filtered = [...items];

        // Apply price range filter only if it's less than the maximum value
        if (filters.priceRange < 1000) {
            filtered = filtered.filter(item => item.price <= filters.priceRange);
        }

        // Apply category filter only if categories are selected
        if (filters.category.length > 0) {
            filtered = filtered.filter(item => filters.category.includes(item.category));
        }

        // Apply sorting
        if (filters.sort === "price-low") {
            filtered.sort((a, b) => a.price - b.price);
        } else if (filters.sort === "price-high") {
            filtered.sort((a, b) => b.price - a.price);
        } else if (filters.sort === "alpha-asc") {
            filtered.sort((a, b) => a.name.localeCompare(b.name));
        } else if (filters.sort === "alpha-desc") {
            filtered.sort((a, b) => b.name.localeCompare(a.name));
        }

        setFilteredItems(filtered);
    }, [filters, items]);

    return (
        <div>
            <Title text1="Our" text2="Collections" />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-5/6 mx-auto mt-10">
                {filteredItems.length > 0 ? (
                    filteredItems.map((item) => (
                        <Item key={item._id} item={item} />
                    ))
                ) : (
                    <p className="text-gray-500 w-full text-center text-xl font-bold">No items match your filters.</p>
                )}
            </div>
        </div>
    );
};

export default AllItems;
