import React from 'react'
import './Offers.css'
import exclusive_image from '../Assets/exclusive_image.png'

const Offers = () => {
  return (
    <div className='offers'>
        <div className="offers-left">
            <h1>Sadece</h1>
            <h1>Sizin İçin</h1>
            <p>Sadece en çok satan ürünler</p>
            <button>Şimdi Tıkla</button>
        </div>
        <div className="offers-right">
            <img src={exclusive_image} alt="" />
        </div>
    </div>
  )
}

export default Offers