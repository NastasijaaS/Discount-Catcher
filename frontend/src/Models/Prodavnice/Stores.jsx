import './stores.css'

import React from 'react'
import Store_card from './Store_card/Store_card'

import { getAllStores, getProductsFromStore } from '../../Axios/Axios.js'
import { useState } from 'react'
import { useEffect } from 'react'
import Product from '../Product/Product'

export default function Stores() {

  const [stores, setStore] = useState([])
  const [products, setProducts] = useState([])
  const [selectedStore, setSelectedStore] = useState(null)

  const fetch_stores = async () => {
    const result = await getAllStores()
    console.log(result.data);
    setStore(result.data)
  }

  useEffect(() => {
    fetch_stores()
  }, [])

  // useEffect(() => {
  //   // console.log('nesto123')
  //   fetch_products()
  // }, [selectedStore])

  useEffect(() => {
    console.log("Product list changed: ", products)
  }, [products])

  return (
    <div className="stores_page_container">
        <div className="store_list_container">
          {
            (stores) && (
              <>
                  {
                    stores.map(x => {
                        return (
                          <Store_card data={{store_info: x, func: setProducts}} />
                        )
                    })
                  }
              </>
            )
          }
        </div>
        <div className="product_list_container">
          {
            (products) && (
              <>
                {
                  products.map(x => {
                    return (
                      <Product product_data={x}/>
                    )
                  }) 
                }
              </>
            )
          }
        </div>
    </div>
  )
}
