import './filter.css'

import React from 'react'
import { useState, useEffect } from 'react'

import { getAllLocations, getAllStoresByLocation, getProductsOnDiscount } from '../../Axios/Axios.js'

import Product from '../Product/Product.jsx'

export default function Filter() {

  const [locations, setLocations] = useState([])
  const [products, setProducts] = useState([])
  const [stores, setStores] = useState([])
  const [location, setLocation] = useState("")
  const [store_list, setStoreList] = useState([])

  const fetch_locations = async () => {
    const response = await getAllLocations()
    console.log(response.data)
    setLocations(response.data)
  }

  const fetch_stores = async (location) => {
    const response = await getAllStoresByLocation({location_id: location})
    console.log(response.data)
    setStores(response.data)
  }

  const fetch_products = async () => {
    // console.log(store_list)
    console.log('Fetching products from multiple stores: ');
    const response = await getProductsOnDiscount({ store_name: store_list })
    console.log('Response for multiple discounts from stores: ', response.data)
    setProducts(response.data)
  }

  const onOptionChange = e => {
    fetch_stores(e.target.value)
    setLocation(e.target.value)
  }

  const toogleStores = (name) => {
    if(store_list.includes(name))
        setStoreList(store_list.filter(x => x !== name))
    else
        setStoreList([name, ...store_list])
  }

  useEffect(() => {
    fetch_locations()
  }, [])
 
  return (
    <div className="filter_outer_div">
        <div className="filter_container">
            <div className="location_container">
                <label className="location_label">Lokacija: </label>
                <div className="location_checkbox_container" >
                    {
                        (locations) && (
                            <>
                                {
                                    locations.map(x => {
                                        return (
                                            <div className="button_container2">
                                                <input type="radio" name="location_select" value={x.name} onChange={onOptionChange} />
                                                <label className='location_label'>{x.name}</label>
                                            </div>
                                        )
                                    })
                                }
                            </>
                        )
                    }

                </div>
            </div>
            <div className="store_container">
                <label className="store_label">Prodavnica: </label>
                <div className="store_select_container">
                    {
                        (stores) && (
                            <>
                                {
                                    stores.map(x => {
                                        return (
                                            <div className="button_container2">
                                                <input type="checkbox" name="store_select" value={x.name} onChange={() => toogleStores(x.name)}/>
                                                <label className='location_label'>{x.name}</label>
                                            </div>
                                        )
                                    })
                                }
                            </>
                        )
                    }
                </div>
            </div>
            <button className="submit_filter_button" onClick={() => fetch_products()} >Filter!</button>
        </div>
        <div className="product_list_container">
          {
            (products.length > 0) && (
                products.map(x => {
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
