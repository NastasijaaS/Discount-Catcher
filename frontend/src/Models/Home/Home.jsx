import './home.css'

import React from 'react'
import Login from '../Login/Login.jsx'
import Register from '../Register/Register.jsx'
import Product from '../Product/Product.jsx'
import Product_info from '../Product info/Product_info.jsx'
import Filter from '../Filter/Filter.jsx'
import Brand from '../Brand/Brand.jsx'
import Brand_list from '../Brand list/Brand_list.jsx'

export default function Home() {
  return (
    <>
      {/* <div className="home_div"> */}
        <Brand_list />
      {/* </div> */}
    </>
  )
}
