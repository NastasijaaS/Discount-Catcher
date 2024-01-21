import './login.css'
import React from 'react'

import { useDispatch, useSelector } from 'react-redux'
import { useState, useEffect } from 'react';
import { createClient } from 'redis';
import { useNavigate } from 'react-router-dom';

import { login, load_products } from '../../Slices/userSlice.js';
import { logIN  } from '../../Axios/Axios.js';

export default function Login() {
    
    let user = useSelector(state => state.user);
    const dispatch = useDispatch();
    const [data, setData] = useState({email: "", password: ""})
    const navigate = useNavigate();       
    
    const handleChange = ({currentTarget: input}) => {
        setData({...data, [input.name]: input.value })
    }

    const login_user = async (data) => {

        const res = await logIN(data);
        console.log('Login data:', res.data)

        // console.log('got data after login: ', res.data.found_user)
        if(res) {

            dispatch(login(res.data.found_user));
            dispatch(load_products(res.data.product_list))

            const ws = new WebSocket("ws://127.0.0.1:3400")

            ws.onopen = () => {
                console.log('Web socket is connected!')
                const message = {
                    id: user.id,
                    tag: user.intrested_in_products
                }
                ws.send(JSON.stringify(message))
            }

            ws.onmessage = (event) => {
                const message = JSON.parse(event.data); 
                try {
                    alert(message.data)
                } catch(err) {
                    console.log(err)
                }
            }
        }

        console.log('admin flag: ', user.is_admin)
        if(user.is_admin)
            navigate('/admin')
        

    }

  return (
    <div className='login_container'>
        <div className='login_message'>
            Login to your account
        </div>
        <div className='login_card'>
            <div className='login_card_input'>
                <label className='login_label'>Email: </label>
                <input type="text" className="login_input" name="email" onChange={handleChange}/>
            </div>
            <div className='login_card_input'>
                <label className='login_label'>Password: </label>
                <input type="password" className="login_input" name="password" onChange={handleChange}/>
            </div>
            <button onClick={() => login_user(data)} className='login_page_button'>Login!</button>
            {/* {
                (user) && (
                    <>
                        <label htmlFor="" className="user_name">ID: {user.id}</label>
                    </>
                )
            } */}
        </div>
    </div>
  );
}
