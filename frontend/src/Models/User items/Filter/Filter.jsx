import './filter.css'

import React from 'react'

export default function Filter({filter_event}) {
  return (
    <div className="filter_container_cnt2">
        <div className="filter_main2">
            {/* <button id="brand" className="filter_button2" onClick={() => filter_event("brand")}>Brand</button> */}
            {/* <button id="stores" className="filter_button2" onClick={() => filter_event("stores")}>Stores</button> */}
            <button id="products" className="filter_button2" onClick={() => filter_event("product")}>Products</button>
        </div>
    </div>
  )
}
