import './brand.css'

import React from 'react'

export default function Brand({brand_data}) {
  return (
    <>
      <div className="brand_card">
        <div className="brand_container">
          <img alt="no image :(" className="logo" />
          <div className="brand_name_container">
            <label htmlFor="" className="brand_name_label">{brand_data}</label>
          </div>
        </div>
      </div>
    </>
  )
}
