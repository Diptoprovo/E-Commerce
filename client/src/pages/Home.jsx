// import React, { useContext, useEffect, useRef } from 'react'
// import Offers from '../components/Offers'
// import Sidebar from '../components/Sidebar'
// import LatestItems from '../components/LatestItems'

// import { useNavigate } from 'react-router-dom'
// import AppContext from '../context/ContextApp'
// import AllItems from '../components/AllItems'
// import SellerItems from '../components/SellerItems'
// import Title from '../components/Title'
// import SignInCard from '../components/SignInCard'
// // import AddProductCard from '../components/AddProductCard'

// const Home = () => {

//     const scrRef = useRef(null);

//     const { backendURL, isLoggedin, userData } = useContext(AppContext);
//     const navigate = useNavigate();

//     // useEffect(() => {
//     //     if (!isLoggedin) {
//     //         navigate('/login');
//     //     }
//     // }, [])
//     useEffect(() => {
//         console.log(userData);

//     }, [userData])

//     return (
//         <>
//             {!userData ? (<div>
//                 <Title text1="Welcome to" text2="E-Mart" />
//                 <div className='my-10'>
//                     <Offers scrollRef={scrRef} />
//                 </div>
//                 <div className='my-10 cursor-pointer' onClick={() => { navigate('/login') }}>
//                     <SignInCard />
//                 </div>


//             </div>)
//                 :
//                 (!userData.isSeller ?
//                     (<div >
//                         <Offers scrollRef={scrRef} />
//                         <Sidebar />
//                         <div ref={scrRef}>
//                             <LatestItems />
//                         </div>
//                         <AllItems />
//                     </div>)
//                     :
//                     <div>
//                         <SellerItems />
//                     </div>)
//             }

//         </>
//     )
// }

// export default Home

import React, { useContext, useEffect, useRef, useState } from 'react';
import Offers from '../components/Offers';
import Sidebar from '../components/Sidebar';
import LatestItems from '../components/LatestItems';
import { useNavigate } from 'react-router-dom';
import AppContext from '../context/ContextApp';
import AllItems from '../components/AllItems';
import SellerItems from '../components/SellerItems';
import Title from '../components/Title';
import SignInCard from '../components/SignInCard';
import AdminHome from './AdminHome';

const Home = () => {
    const scrRef = useRef(null);
    const { isLoggedin, userData, admin } = useContext(AppContext);
    const navigate = useNavigate();

    const [filters, setFilters] = useState({
        sort: "",
        priceRange: [0, 1000],
        category: []
    });

    // Function to update filters from Sidebar
    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
    };


    return (
        <>
            {!userData ? (

                <div>
                    <Title text1="Welcome to" text2="E-Mart" />
                    <div className='my-10'>
                        <Offers scrollRef={scrRef} />
                    </div>
                    <div className='my-10 cursor-pointer' onClick={() => navigate('/login')}>
                        <SignInCard />
                    </div>
                </div>
            ) :
                (userData && userData.name === 'Admin' ? (<div><AdminHome /></div>) :
                    (
                        !userData.isSeller ? (
                            <div className="flex">
                                <Sidebar onFilterChange={handleFilterChange} />
                                <div className="flex-1">
                                    <Offers scrollRef={scrRef} />
                                    <div ref={scrRef}>
                                        <LatestItems />
                                    </div>
                                    <AllItems filters={filters} />
                                </div>
                            </div>
                        ) : (
                            <div>
                                <SellerItems />
                            </div>
                        )
                    ))}
        </>
    );
};

export default Home;
