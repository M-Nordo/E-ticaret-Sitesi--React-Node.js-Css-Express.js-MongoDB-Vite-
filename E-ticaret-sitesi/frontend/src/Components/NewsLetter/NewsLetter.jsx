import React from 'react'
import './NewsLetter.css'

const NewsLetter = () => {
  return (
    <div className='newsletter'>
        <h1>Yenilikleri erken öğrenmek için kaydolun</h1>
        <p>Güncellemelerden haberdar olun</p>
        <div>
            <input type="email" placeholder='e-posta hesabınız' />
            <button>Abone Ol</button>
        </div>
    </div>
  )
}

export default NewsLetter