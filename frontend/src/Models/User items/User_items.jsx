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
  const [result, setResult] = useState([])
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
        setResult([])
        break;
      // case 'stores':
      //   fetch_stores()
      //   setResult([])
      //   break;
      // case 'brand':
      //   fetch_brands()
      //   setResult([])
      //   break;
      default:
        break;
    }
  }, [filter])

  if(products.length > 0) {
    return (
        <div className='user_items_main_container'>
          <Filter filter_event={setFilter}/>
          <div className="result_container">
            {
              {
                'product': products.map(x => {
                  return (
                    <Product product_data={x}/>
                  )
                }),
                // 'brand': products.map(x => {
                //   console.log(x)
                //   return (
                //     <Brand brand_data={{data: x, func: setResult}}/>
                //   )
                // }),
                // 'stores': products.map(x => {
                //   return (
                //     <Store_card store_data={{data: x, func: setResult}}/>
                //   )
                // })
              }[filter]
            }
          </div>
          <div className="final_result_container">
            {
              (result) && (result.map(x => {
                return (
                  <Product product_data={x}/>
                )
              }))
            }
          </div>
        </div>
    )
  }

}
