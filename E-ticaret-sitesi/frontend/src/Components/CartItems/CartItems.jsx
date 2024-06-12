import React, { useContext } from 'react'
import './CartItems.css'
import { ShopContext } from '../../Context/ShopContext'
import remove_icon from '../Assets/cart_cross_icon.png'

const CartItems = () => {
  const {getTotalCartAmount,all_product,cartItems,removeFromCart} = useContext(ShopContext);
  return (
    <div className='cartitems'>
        <div className="cartitems-format-main">
            <p>Ürünler</p>
            <p>Ürün Adı</p>
            <p>Fiyat</p>
            <p>Adet</p>
            <p>Toplam</p>
            <p>Sil</p>
        </div>
        <hr />
        {all_product.map((e)=>{
            if(cartItems[e.id]>0)
            {
                return <div>
                         <div className="cartitems-format cartitems-format-main">
                            <img src={e.image} alt="" className='carticon-product-icon' />
                            <p>{e.name}</p>
                            <p>₺{e.new_price}</p>
                            <button className='cartitems-quantity'>{cartItems[e.id]}</button>
                            <p>₺{e.new_price*cartItems[e.id]}</p>
                            <img className='cartitems-remove-icon' src={remove_icon} onClick={()=>{removeFromCart(e.id)}} alt="" />
                         </div>
                        <hr />
                        </div>
                }
                return null;
                })}
                <div className="cartitems-down">
                    <div className="cartitems-total">
                        <h1>Aldıklarım</h1>
                        <div>
                            <div className="cartitems-total-item">
                                <p>Toplam Fiyat</p>
                                <p>₺{getTotalCartAmount()}</p>
                            </div>
                            <hr />
                            <div className="cartitems-total-item">
                                <p>Kargo Ücreti</p>
                                <p>Ücretsiz</p>
                            </div>
                            <hr />
                            <div className="cartitems-total-item">
                                <h3>Toplam</h3>
                                <h3>₺{getTotalCartAmount()}</h3>
                            </div>
                        </div>
                        <button>ÖDEMEYİ GERÇEKLEŞTİR</button>
                    </div>
                    <div className="cartitems-promocode">
                        <p>Promosyon kodunuz varsa buraya giriniz</p>
                        <div className="cartitems-promobox">
                            <input type="text" placeholder='kodu giriniz'/>
                            <button>Gönder</button>
                        </div>
                    </div>
                </div>
        </div>
  )
}

export default CartItems