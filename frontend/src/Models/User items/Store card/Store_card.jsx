import './store_card.css'

import React from 'react'

import { getProductsFromStore, getProductsOnDiscount } from '../../../Axios/Axios.js'

export default function Store_card({store_data}) {

  const fetchAllProducts = async () => {
    // console.log('nesto?')
    console.log('Fetching all products from store: ', store_data.data.name)
    const response = await getProductsFromStore({store_name: store_data.data.name})
    console.log('Got data for all products from store: ', response.data)
    store_data.func(response.data)
  }

  const fetchAllProductsOnSale = async () => {
    console.log('Fetching all products from store: ', store_data.data.name)
    const response = await getProductsOnDiscount({store_name: [store_data.data.name]})
    console.log('Got data for all products from store: ', response.data)
    store_data.func(response.data)
  }

  return (
    <div className="store_cards_container2" >
      <div className="store_main_card2">
        <div className="store_container2">
          <img src="" alt="store_image" className="store_image"/>
          <div className="store_card_name">{store_data.data.name}</div>
        </div>
        <div className="button_container">
          <button className="fetch_all_products" onClick={() => fetchAllProducts()}>All products</button>
          <button className="fetch_discounts" onClick={() => fetchAllProductsOnSale()}>On discount?</button>
        </div>
      </div>
    </div>
  )
}
