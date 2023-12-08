import './store_card.css'

import React from 'react'
import { useState } from 'react'

export default function Store_card({data}) {
  return (
    <div className="store_cards_container" >
        <div className="store_main_card">
            <div className="store_container2" onClick={() => data.func(data.store_info.name)}>
                <img src="" alt="store_image" />
                <label className="store_card_name">{data.store_info.name}</label>
            </div>
        </div>
    </div>
  )
}
