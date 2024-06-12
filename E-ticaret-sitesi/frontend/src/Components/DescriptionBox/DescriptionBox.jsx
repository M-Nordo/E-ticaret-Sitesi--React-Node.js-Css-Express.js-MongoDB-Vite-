import React from 'react'
import './DescriptionBox.css'

const DescriptionBox = () => {
  return (
    <div className='descriptionbox'>
        <div className="descriptionbox-navigator">
            <div className="descriptionbox-nav-box">Açıklamalar</div>
            <div className="descriptionbox-nav-box fade">Yorumlar (122)</div>
        </div>
        <div className="descriptionbox-description">
            <p>Uzunca yorum cümleleri falan işte onlardan biraz biraz...</p>
            <p>
                yine aynı şekilde bol bol açıklama içerikleri falan işte, bi ara doldur burayı...
            </p>
        </div>
    </div>
  )
}

export default DescriptionBox