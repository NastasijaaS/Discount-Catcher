import './store_card.css'

import React from 'react'
// import { useState } from 'react'

import { getProductsFromStore } from '../../../Axios/Axios.js'

export default function Store_card({data}) {

  const fetch_products = async (name) => {
    const result = await getProductsFromStore({store_name: data.store_info.name})
    // setProducts(result.data)
    data.func(result.data)
  }

  return (
    <div className="store_cards_container" >
        <div className="store_main_card">
            <div className="store_container2" onClick={() => fetch_products()}>
                <img src="" alt="store_image" />
                <label className="store_card_name">{data.store_info.name}</label>
            </div>
        </div>
    </div>
  )
}
