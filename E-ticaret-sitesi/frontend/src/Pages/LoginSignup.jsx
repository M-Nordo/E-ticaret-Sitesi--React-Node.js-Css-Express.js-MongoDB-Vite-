import React, { useState } from 'react'
import './CSS/LoginSignup.css'

const LoginSignup = () => {

  const [state,setState] = useState("Üye Ol");
  const [formData,setFormData] = useState({
    username:"",
    password:"",
    email:""
  })

  const changeHandler = (e) =>{
    setFormData({...formData,[e.target.name]:e.target.value})
  }

  const login = async ()=>{
    console.log("Giriş Yap fonksiyonu uygulandı",formData);
    let responseData;
    await fetch('http://localhost:4000/login',{
      method:'POST',
      headers:{
        Acceppt:'application/form-data',
        'Content-Type':'application/json',
      },
      body:JSON.stringify(formData),
    }).then((response)=> response.json()).then((data)=>responseData=data)

    if(responseData.success){
      localStorage.setItem('auth-token',responseData.token);
      window.location.replace("/");
    }
    else{
      alert(responseData.errors)
    }
  }
  
  const signup = async ()=>{
    console.log("Üye Ol fonksiyonu uygulandı",formData);
    let responseData;
    await fetch('http://localhost:4000/signup',{
      method:'POST',
      headers:{
        Acceppt:'application/form-data',
        'Content-Type':'application/json',
      },
      body:JSON.stringify(formData),
    }).then((response)=> response.json()).then((data)=>responseData=data)

    if(responseData.success){
      localStorage.setItem('auth-token',responseData.token);
      window.location.replace("/");
    }
    else{
      alert(responseData.errors)
    }

  }

  return (
    <div className='loginsignup'>
        <div className="loginsignup-container">
            <h1>{state}</h1>
            <div className="loginsignup-fields">
                {state==="Üye Ol"?<input name='username' value={formData.username} onChange={changeHandler} type="text" placeholder='Adınız' />:<></>}
                <input name='email' value={formData.email} onChange={changeHandler} type="email" placeholder='E-posta hesabınız' />
                <input name='password' value={formData.password} onChange={changeHandler} type="password" placeholder='Şifreniz'/>
            </div>
            <button onClick={()=>{state==="Giriş Yap"?login():signup()}}>Devam Et</button>
            {state==="Giriş Yap"
            ?<p className="loginsignup-login">Bir hesap oluştur. <span onClick={()=>{setState("Üye Ol")}}>Üye Olunuz</span></p>
            :<p className="loginsignup-login">Zaten bir hesabınız var mı ? <span onClick={()=>{setState("Giriş Yap")}}>Giriş Yapın</span></p>}
            <div className="loginsignup-agree">
                <input type="checkbox" name='' id='' />
                <p>Devam ederek kullanıcı koşullarını ve gizlilik politikasını onaylıyorum.</p>
            </div>
        </div>
    </div>
  )
}

export default LoginSignup