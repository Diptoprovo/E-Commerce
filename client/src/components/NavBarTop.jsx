// import React, { useContext } from 'react'
// import { Navbar, Button, TextInput, ButtonGroup } from 'flowbite-react'

// import { useNavigate } from 'react-router-dom';
// import AppContext from '../context/ContextApp';




// const NavBarTop = () => {


//     const { isLoggedin, userData } = useContext(AppContext);
//     const navigate = useNavigate();

//     const handleClick = () => {
//         navigate('/login');
//     }

//     return (<div className='drop-shadow-md'>
//         <Navbar fluid rounded>

//             <Navbar.Brand href="https://flowbite-react.com">

//                 <span className='mx-3'>

//                     <lord-icon
//                         src="https://cdn.lordicon.com/ggirntso.json"
//                         trigger="hover"
//                         style={{ width: '45px', height: "45px" }}
//                     >
//                     </lord-icon>
//                 </span>

//                 <span className="self-center whitespace-nowrap text-2xl font-semibold dark:text-white"> e-Comm</span>
//             </Navbar.Brand>
//             <span className={`${isLoggedin ? 'w-1/2' : 'w-1/3'} flex flex-row`}>

//                 <TextInput id='searchBar' placeholder='Search anything' className='basis-4/5 me-3' />
//                 <lord-icon
//                     src="https://cdn.lordicon.com/wjyqkiew.json"
//                     trigger="hover"
//                     style={{ width: '30px', height: "30px" }}>
//                 </lord-icon>
//             </span>
//             <Navbar.Toggle />

//             {isLoggedin && ( // Show Collapse only if logged in
//                 <Navbar.Collapse>
//                     <Navbar.Link href="/">
//                         <p>Home</p>
//                     </Navbar.Link>
//                     {!userData.isSeller && (
//                         <Navbar.Link href="/cart">
//                             <p>Cart</p>
//                         </Navbar.Link>
//                     )}

//                     <Navbar.Link href="/orders">
//                         <p>My Orders</p>
//                     </Navbar.Link>
//                     <Navbar.Link href="/about">
//                         <p>Profile</p>
//                     </Navbar.Link>
//                 </Navbar.Collapse>
//             )}

//             {!isLoggedin && (

//                 <Button color='success' className='border-2 border-black-500' onClick={handleClick}>Sign in</Button>

//             )}


//         </Navbar>
//     </div>
//     )
// }
// export default NavBarTop





import React, { useContext, useState, useEffect } from 'react';
import { Navbar, Button, TextInput } from 'flowbite-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AppContext from '../context/ContextApp';

const NavBarTop = () => {
    const { isLoggedin, userData, backendURL } = useContext(AppContext);
    const navigate = useNavigate();

    const [searchQuery, setSearchQuery] = useState('');
    const [products, setProducts] = useState([]); // Store all products
    const [filteredProducts, setFilteredProducts] = useState([]); // Store search results
    const [isLoading, setIsLoading] = useState(true);

    // Fetch all products ONCE on page load
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data } = await axios.get(`${backendURL}/api/item/all`);
                setProducts(data.items);
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProducts();
        console.log(userData);
    }, []);

    // Filter products when searchQuery changes
    useEffect(() => {
        if (!searchQuery.trim()) {
            setFilteredProducts([]);
            return;
        }
        const results = products.filter((item) =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredProducts(results);
    }, [searchQuery, products]);

    // Handle search input
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    // Navigate to the search results page on submit
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    };

    const handleSearchPress = (productId) => {
        setSearchQuery('');
        navigate(`/product/${productId}`);
    }

    return (
        <div className="relative drop-shadow-md">
            <Navbar fluid rounded>
                {/* Brand Logo */}
                <Navbar.Brand href="/">
                    <span className="mx-3">
                        <lord-icon
                            src="https://cdn.lordicon.com/ggirntso.json"
                            trigger="hover"
                            style={{ width: '45px', height: '45px' }}
                        ></lord-icon>
                    </span>
                    <span className="self-center whitespace-nowrap text-2xl font-semibold dark:text-white">
                        e-Mart
                    </span>
                </Navbar.Brand>

                {/* Search Bar */}
                <form onSubmit={handleSearchSubmit} className="relative w-1/2 flex items-center">
                    <TextInput
                        id="searchBar"
                        placeholder="Search for products..."
                        className="basis-4/5 me-3"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        disabled={!isLoggedin}
                    />
                    <button type='button'>
                        <lord-icon
                            src="https://cdn.lordicon.com/wjyqkiew.json"
                            trigger="hover"
                            style={{ width: '30px', height: '30px' }}
                        ></lord-icon>
                    </button>

                    {/* Search Results Dropdown */}
                    {searchQuery && (
                        <div className="absolute top-full mt-1 w-full bg-white shadow-lg rounded-lg z-10">
                            {isLoading ? (
                                <p className="p-3 text-gray-500">Loading products...</p>
                            ) : filteredProducts.length > 0 ? (
                                filteredProducts.map((item) => (
                                    <div
                                        key={item._id}
                                        className="p-3 border-b hover:bg-gray-100 cursor-pointer"
                                        onClick={() => handleSearchPress(item._id)}
                                    >
                                        <div className="flex items-center">
                                            <img src={item.imageUrl} alt={item.name} className="w-12 h-12 mr-3 rounded-md" />
                                            <div>
                                                <p className="font-medium">{item.name}</p>
                                                <p className="text-sm text-gray-600">${item.price}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="p-3 text-gray-500">No results found</p>
                            )}
                        </div>
                    )}
                </form>

                {/* Navbar Links */}
                <Navbar.Toggle />
                {isLoggedin && (
                    <Navbar.Collapse>
                        {userData.name !== 'Admin' && <Navbar.Link href="/">Home</Navbar.Link>}
                        {userData.name !== 'Admin' && !userData.isSeller && <Navbar.Link href="/cart">Cart</Navbar.Link>}
                        {userData.name !== 'Admin' && <Navbar.Link href="/orders">My Orders</Navbar.Link>}
                        <Navbar.Link href="/about">Profile</Navbar.Link>
                        {userData.name === 'Admin' && <Navbar.Link href="/admin">Collection</Navbar.Link>}
                        {userData.name === 'Admin' && <Navbar.Link href="/all-orders">Orders</Navbar.Link>}

                    </Navbar.Collapse>
                )}

                {/* Sign-in Button */}
                {!isLoggedin && (
                    <Button color="success" className="border-2 border-black-500" onClick={() => navigate('/login')}>
                        Sign in
                    </Button>
                )}
            </Navbar>
        </div>
    );
};

export default NavBarTop;
