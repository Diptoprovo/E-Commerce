import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Collection from './pages/Collection'
import About from './pages/About'
import Contact from './pages/Contact'
import Product from './pages/Product'
import Cart from './pages/Cart'
import Login from './pages/Login'
import PlaceOrder from './pages/PlaceOrder'
import Orders from './pages/Orders'
import NavBarTop from './components/NavBarTop'
import EmailVerify from './pages/EmailVerify'
import ResetPassword from './pages/ResetPassword'
import SellerProductView from './pages/SellerProductView'
import AddItem from './pages/AddItem'
import AdminHome from './pages/AdminHome'
import AllOrders from './pages/AllOrders'


const App = () => {
  return (
    <div>
      <div className='sticky top-0 z-10'>
        <NavBarTop />
      </div>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/collection' element={<Collection />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/product/:productId' element={<Product />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/login' element={<Login />} />
        <Route path='/place-order' element={<PlaceOrder />} />
        <Route path='/orders' element={<Orders />} />
        <Route path='/email-verify' element={<EmailVerify />} />
        <Route path='/reset-password' element={<ResetPassword />} />
        <Route path='/product-seller/:productId' element={<SellerProductView />} />
        <Route path='/add-item' element={<AddItem />} />
        <Route path='/admin' element={<AdminHome />} />
        <Route path='/all-orders' element={<AllOrders />} />


      </Routes>
    </div>
  )
}

export default App
