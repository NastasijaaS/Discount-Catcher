import './brand_list.css'

import React from 'react'
import Brand from '../Brand/Brand.jsx'

export default function Brand_list() {
  return (
    <>
      <div className="brand_list_container">
        <div className="brand_list_main">
          <Brand brand_data={'1'}/>
          <Brand brand_data={'2'}/>
          <Brand brand_data={'3'}/>
          <Brand brand_data={'4'}/>
        </div>
      </div>
    </>
  )
}
