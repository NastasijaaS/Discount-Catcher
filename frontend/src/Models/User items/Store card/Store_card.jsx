import './store_card.css'

import React from 'react'

export default function Store_card({store_data}) {
  return (
    <div className="store_cards_container" >
      <div className="store_main_card">
        <div className="store_container2">
          <img src="" alt="store_image" />
          <label className="store_card_name">{store_data.name}</label>
        </div>
      </div>
    </div>
  )
}
