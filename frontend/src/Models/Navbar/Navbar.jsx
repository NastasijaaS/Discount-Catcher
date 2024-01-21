import React from 'react'
import './navbar.css'

import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { log_out } from '../../Slices/userSlice.js'

export default function Navbar() {
    
    const navigation_list = [['Prodavnice', 'fa-solid fa-store'], ['Namirnice', 'fa-solid fa-burger'], ['Odeca', 'fa-solid fa-shirt'], ['Obuca', 'fa-solid fa-shoe-prints'], ['Pica', 'fa-solid fa-mug-hot']]
    const navigate = useNavigate()
    const dispatch = useDispatch();
    
    let user = useSelector(state => state.user);

    const handleNavigate = event => {
        const button = event.currentTarget.id;   // sta je kliknuto?
        switch(button) {
            case 'logo':
                navigate('/')
                break
            case 'login':
                navigate('/login')
                break
            case 'register':
                navigate('/register')
                break
            case 'Prodavnice':
                navigate('/prodavnice')
                break
            case 'my_products':
                navigate('/my_products', {state: user.id})
                break
            case 'log_out':
                console.log(user)
                dispatch(log_out())
                console.log(user)
                navigate('/')
                break
            case 'messages':
                navigate('/messages')
                break
            default: {
                navigate('/proizvodi', {state: button})
                // console.log('From navigaton calling route /proizvodi with tag: ', button.toLowerCase())
                break
            }
        }
    }

    return (
        <>
            <div className='navbar_main'>
                <div id='logo' onClick={handleNavigate} className='navigation_logo'>
                    Discount-Catcher
                </div>

                <div className='navigation_div'>
                    {
                        navigation_list.map(prod => (
                            <button id={prod[0]} onClick={handleNavigate} className={`${prod[0].toLowerCase() + "_button"}`}>
                                <i className={prod[1]} />
                                {prod[0]}
                            </button>
                        ))
                    }
                </div>
                {
                    (user.id === null) ? (
                        <>              
                            <div className='login_div'>
                                <button id='login' className='login_button' onClick={handleNavigate} >Login</button>
                                <button id='register' className='register_button' onClick={handleNavigate} >Register</button>
                            </div>
                        </>
                    )
                    : (
                        <>
                            <div className="login_div">
                                <button id='my_products' className="my_products_button" onClick={handleNavigate}>My products</button>
                                <button id='log_out' className="log_out_button" onClick={handleNavigate}>Log out</button>
                                <button id='messages' className="user_messages_button" onClick={handleNavigate}><i className='fa-solid fa-message'/></button>
                            </div>
                        </>
                    )
                }

            </div>
        </>    
    )
}
