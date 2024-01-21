import React from 'react'
import './product.css'

import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { follow_product, notIntrestedInProduct } from '../../Axios/Axios.js'
import { append_product, pop_product } from '../../Slices/userSlice.js'

import Product_info from '../Product info/Product_info.jsx'

export default function Product({product_data}) {

  let user = useSelector(state => state.user);

  const [info, toogleInfo] = useState(false);
  const dispatch = useDispatch();

  const follow_product_fun = async () => {
    console.log('ID: ', user.id, "Product: ", product_data.product_id);
    const response = await follow_product({ user_id: user.id, product_id: product_data.product_id });
    alert("Uspesno smo dodali proizvod na pracenje/1");
    dispatch(append_product(product_data.product_id))
  }

  const remove_product_fun = async () => {
    console.log({ user_id: user.id, product_id: product_data.product_id })
    const response = await notIntrestedInProduct({ user_id: user.id, product_id: product_data.product_id });
    if(response.status === 200) {
      alert("Uspesno smo uklonili proizvod sa liste pracenja!")
      dispatch(pop_product(product_data.product_id))
    }
  }

  const show_info = () => {
    toogleInfo(!info)
  }

  return (
    <>
        <div className='product_card'>
            <div className='product_card_container'>
                <img className='product_image' src={product_data.image} alt="no img :)" />
                <div className='product_data'>
                    <div className='product_name'>Product: {product_data.name}</div>
                    <div className='product_brand'>Brand: {product_data.brand}</div>
                    <div className='product_type'>Type: {product_data.type}</div>
                </div>
                
                <button className='product_show_button' onClick={show_info} >Show more</button>
                <div className='product_discount_button'>
                  {
                    
                    (user.id !== null) && (!user.intrested_in_products.includes(product_data.product_id)) ? (
                      <>
                        <button className='product_show_button' onClick={follow_product_fun}>Catch discount</button>
                      </>
                    ) : (user.id !== null) && (
                      <>
                        <button className='product_remove_button' onClick={remove_product_fun} >Remove from list!</button>
                      </>
                    )
                  }
                </div>
            </div>
        </div>
        {
          (info) && (
            <div className="modal_container">
              <Product_info product_data_info={{data: product_data, toogle: toogleInfo}} />
            </div>
          )
        }
    </>
  )
}
