import React from 'react'
import { useEffect } from 'react'
import './product_info.css'

import { useState } from 'react'

import { getProductFromAllStores } from '../../Axios/Axios.js'

export default function Product_info({product_data_info}) {

  const[stores, setStores] = useState([]);
  const[loading, setLoading] = useState(false)

  const fetch_stores = async (product_id) => {
    const res = await getProductFromAllStores({product_id: product_id})
    if (res) {
        console.log("Stores: ", res.data)
        setLoading(true)
        setStores(res.data)
    }
  }
  
  useEffect(() => {
    console.log('Fetching data for product: ', product_data_info.data.product_id)
    fetch_stores(product_data_info.data.product_id)
  }, [])

  const close_card = () => {
    product_data_info.toogle(false)
  }

  return (
    <>
        <div className='product_info_cont'>
            <div className="product_info_cont_div">
                <div className="product_info">
                    <img className='product_image' src={product_data_info.data.image} alt="nema slike :(" />
                    <div className='product_data_cont'>
                        <div className='product_name'>Product: {product_data_info.data.name}</div>
                        <div className='product_brand'>Brand: {product_data_info.data.brand}</div>
                        <div className='product_type'>Type: {product_data_info.data.type}</div>
                    </div>
                </div>

                <div className="product_prices">
                    <label className="label_prices" >Cene: </label>
                    {
                        (loading) ? (
                            <>
                                {
                                    stores.map(x => {
                                        return (
                                            <> 
                                                <div className="product_price_cont">
                                                    <label className="product_store_name">{x.name}</label>
                                                    <label className="product_store_price">{x.price} RSD</label>
                                                </div>
                                            </>
                                        )
                                    })
                                }
                            </>
                        ) : (
                            <div>Data loading...</div>
                        )
                    }
                    {/* {{
                        if (loading) {
                            return (
                                <>
                                    {
                                        stores.map(x => {
                                            return (
                                                <> 
                                                    <div className="product_price_cont">
                                                    <label className="product_store_name">{x.name}</label>
                                                    <label className="product_store_price">{x.price}RSD</label>
                                                    </div>
                                                </>
                                            )
                                        })
                                    }
                                </>
                            )
                        }
                    }} */}
                </div>
            </div>
            <button className="exit_button" onClick={close_card}>X</button>
        </div>
    </>
  )
}
