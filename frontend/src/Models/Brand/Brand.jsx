import './brand.css'

import React from 'react'

import { getByBrandProducts } from '../../Axios/Axios.js' 

export default function Brand({brand_data}) {
  
  const fetch_products = async () => {
    console.log('Fetching data from brand:', brand_data.data.name)
    const response = await getByBrandProducts({brand: brand_data.data.name})
    console.log('Got data from brand fetch:', response.data)
    brand_data.func(response.data)
  }
  
  return (
    <>
      <div className="brand_card" onClick={() => fetch_products()}>
        <div className="brand_container">
          <img alt="no image :(" className="logo" />
          <div className="brand_name_container">
            <label className="brand_name_label">{brand_data.data.name}</label>
          </div>
        </div>
      </div>
    </>
  )
}
