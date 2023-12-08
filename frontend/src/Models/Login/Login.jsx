import React from 'react'
import './login.css'

import { useDispatch, useSelector } from 'react-redux'
import { login, load_products } from '../../Slices/userSlice.js';
import { logIN,  } from '../../Axios/Axios.js';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// import { client } from '../../redis.js';

// import { client } from '../../redis.js';

export default function Login() {

  let user = useSelector(state => state.user);
  const dispatch = useDispatch();
  const [data, setData] = useState({email: "", password: ""})
  const navigate = useNavigate();

  const handleChange = ({currentTarget: input}) => {
    setData({...data, [input.name]: input.value })
  }

  const login_user = async (data) => {
    // console.log("data: ", data)
    const res = await logIN(data);
    if(res) {
        // console.log(res.data)
        dispatch(login(res.data.found_user));
        dispatch(load_products(res.data.product_list))

        // user.intrested_in_products.map(x => {
        //     redis_client.subscribe(x.product_id, (message) => {
        //         alert(message);
        //     })
        // })
        // console.log(user.intrested_in_products)
    }
  }

  return (
    <>
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
            {
                (user) && (
                    <>
                        <label htmlFor="" className="user_name">ID: {user.id}</label>
                    </>
                )
            }
        </div>
    </div>
    </>
  );
}
