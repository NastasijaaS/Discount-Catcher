import React from 'react'
import './register.css'

import { userSlice, register } from '../../Slices/userSlice.js';
import { registerIN } from '../../Axios/Axios.js';

import { useDispatch, useSelector } from 'react-redux'
import { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'



export default function Register() {

    let user = useSelector(state => state.user);
    const dispatch = useDispatch();
    const [data, setData] = useState({name: "", last_name: "",email: "",password:""})

    const navigate = useNavigate()
  
    const handleChange = ({currentTarget: input}) => {
      setData({...data, [input.name]: input.value })
    }
  
    const register_user = async (data) => {
      console.log("data: ", data)
      const res = await registerIN(data);
      if(res) {
          dispatch(register(res.data));
          console.log('User data:', res.data)
          navigate('/')
      }
    }
    return (
        <>
        <div className='register_container'>
            <div className='register_message'>
                Register your account
            </div>
            <div className='register_card'>
                <div className='register_card_input'>
                    <label className='register_label'>Name: </label>
                    <input type="text" className="register_input" name="name" onChange={handleChange}/>
                </div>
                <div className='register_card_input'>
                    <label className='register_label'>Last name: </label>
                    <input type="text" className="register_input" name="last_name" onChange={handleChange}/>
                </div>
                <div className='register_card_input'>
                    <label className='register_label'>Email: </label>
                    <input type="text" className="register_input" name="email" onChange={handleChange}/>
                </div>
                <div className='register_card_input'>
                    <label className='register_label'>Password: </label>
                    <input type="password" className="register_input" name="password" onChange={handleChange}/>
                </div> 
                <button onClick={() => register_user(data)} className='register_page_button'>Register!</button>
                {
                (user) && (
                    <>
                        <label htmlFor="" className="user_name">id: {user.name}</label>
                    </>
                )
            }
            </div>
        </div>
        </>
    );
}
