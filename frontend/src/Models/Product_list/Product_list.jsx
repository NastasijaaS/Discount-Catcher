import './product_list.css'

import React from 'react'
import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { getByTypeProduct, user_products } from '../../Axios/Axios.js'

import Product from '../Product/Product.jsx'

// Kao argument saljemo tag po kome vracamo listu proizvoda koje zelimo da prikazemo:
// tip proizvoda primarno, za one dugmice u navbar-u:
export default function Product_list() {
 
  // let user = useSelector(state => state.user);
  const location = useLocation()
  const dispatch = useDispatch()

  const[list, setList] = useState([])   // inicijalno, nemamo nista da prikazemo;
  const[tag_name, setTag] = useState(location.state)
  const[userProducts, setUserProducts] = useState([])
  
  // Inicijalno, prilikom prvog ulaska na stranicu, poziva se ova funkcija:
  useEffect(() => {
    console.log('First time got: ', tag_name);
    fetchProducts()
  }, [])
  
  // Poziva se svaki put kada se promeni vrednost taga, odnosno kada se klikne na navigaciju:
  useEffect(() => {
    console.log("N-th time got tag: ", location.tag)
  }, [tag_name])

  const fetchProducts = async () => {
    console.log('Fetching data for tag: ', tag_name);
    const data = await getByTypeProduct({type: tag_name})
    console.log(data.data);

    setList(data.data)
  }

  const fetch_user_products = async () => {
    const response = await user_products({user_id: tag_name})
    setUserProducts(response.data)
  }

  if(typeof(tag_name) === typeof(1)) {
    return (
      <>
        {
          (userProducts) && (
            <>
              {
                userProducts.map(x => {
                  return (
                    <Product product_data = {x}/>
                  )
                })
              }
            </>
          )
        }
      </>
    )
  }
  else {

    if(list.length === 0) {
      return (
        <>
          <label htmlFor="">No data!</label>
        </>
      )
    }
    else {
      return (
        <>
          <div className='product_list_container'>
            {
              list.map(x => {
                  return <Product product_data = {x}/>
              })
            }
          </div>
        </>
      )
    }
  }
}
