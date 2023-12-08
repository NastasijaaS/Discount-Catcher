import './filter.css'

import React from 'react'
import { useState, useEffect } from 'react'

import { getAllLocations, getAllStoresByLocation } from '../../Axios/Axios.js'

export default function Filter() {

  const [locations, setLocations] = useState([])
  const [stores, setStores] = useState([])

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

  const onOptionChange = e => {
    fetch_stores(e.target.value)
  }

  useEffect(() => {
    fetch_locations()
  }, [])
 
  return (
    <>
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
                                            <div className="button_container">
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
                                            <div className="button_container">
                                                <input type="checkbox" name="store_select" value={x.name} />
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
            <button className="submit_filter_button" >Filter!</button>
        </div>
    </>
  )
}
