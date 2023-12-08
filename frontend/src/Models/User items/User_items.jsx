import React, { useState } from 'react'
import './user_items.css'

import { user_products, user_stores, user_brands } from '../../Axios/Axios.js'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import Product from '../Product/Product'
import Filter from './Filter/Filter.jsx'
import Brand from './../Brand/Brand.jsx'
import Store_card from './Store card/Store_card'


export default function User_items() {

  const [products, setProducts] = useState([])
  const [filter, setFilter] = useState('product')
  let user = useSelector(state => state.user);

  const fetch_products = async () => {
    console.log("ID: ", user.id)
    const response = await user_products({user_id: user.id})
    console.log("User response: ", response)
    setProducts(response.data)
  }

  const fetch_stores = async () => {
    console.log("Started fetching store list!");
    const response = await user_stores({user_id: user.id})
    console.log('Got response from backend for fetching stores: ', response.data);
    setProducts(response.data)
  }
  
  const fetch_brands = async () => {
    console.log("Started fetching brand list!");
    const response = await user_brands({user_id: user.id})
    console.log('Got response from backend for fetching brands: ', response.data);
    setProducts(response.data)
  }

  useEffect(() => {
    fetch_products()
  }, [])

  useEffect(() => {
    switch(filter) {
      case 'product':
        fetch_products()
        break;
      case 'stores':
        fetch_stores()
        break;
      case 'brand':
        fetch_brands()
        break;
      default:
        break;
    }
  }, [filter])

  if(products.length > 0) {
    return (
        <>
          <Filter filter_event={setFilter}/>
          {
            {
              'product': products.map(x => {
                return (
                  <Product product_data={x}/>
                )
              }),
              'brand': products.map(x => {
                console.log(x)
                return (
                  <Brand brand_data={x}/>
                )
              }),
              'stores': products.map(x => {
                return (
                  <Store_card store_data={x}/>
                )
              })
            }[filter]
            // switch(filter) {
            //   case "product":
            //     products.map(x => {
            //       return (
            //         <Product product_data={x}/>
            //         )
            //     })
            //     break;   
            //   default: 
            //     break;
            // }
          }
        </>
    )
  }

}
