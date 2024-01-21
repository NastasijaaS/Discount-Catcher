import './home_page.css'

import React from 'react'
import { useEffect, useState } from 'react'

import { fetchLatestDiscounts } from '../../Axios/Axios.js'
import Product from '../Product/Product.jsx'

export default function Home_page() {
  
  const [discounts, setDiscounts] = useState([])

  const fetch_discounts = async () => {
    const response = await fetchLatestDiscounts()
    console.log('Latest discounts: ', response.data)
    setDiscounts(response.data)
  }

  useEffect(() => {
    fetch_discounts()
  }, [])

  return (
    <div className='home_page_div'>
      <div className="home_page_card_container">
        {
          (discounts.length > 0) && (
            discounts.map(x => {
              return (
                <Product product_data={x}/>
              )
            })
          )
        } 
      </div>
    </div>
  )
}
