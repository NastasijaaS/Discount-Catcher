import React from 'react'
import './admin.css'

import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';

import { getAllBrands, getAllTypes, getAllStores, getAllLocations, getByTypeProduct, getProductsFromStore } from '../../Axios/Axios.js' // get
import { addStoreToLocation, createProduct, createStore, addProductToStore, addProductToDiscount, removeFromDiscount  } from '../../Axios/Axios.js'          // post/put

export default function Admin() {
  let user = useSelector(state => state.user);

  const [brands, setBrands] = useState([])
  const [selectedBrand, setSelectedBrand] = useState(null)

  const [types, setTypes] = useState([])
  const [selectedType, setSelectedType] = useState(null)

  const [store, setStores] = useState([])
  const [selectedStore, setSelectedStore] = useState(null)

  const [locations, setLocations] = useState([])
  const [selectedLocation, setSelectedLocation] = useState(null)

  const [products, setProducts] = useState([])
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [selectedProduct2, setSelectedProduct2] = useState(null)
  const [selectedProduct3, setSelectedProduct3] = useState(null)
  const [selectedSelectProductType, setSelectedSelectProductType] = useState(null)

  const [products2, setProducts2] = useState([])
  const [selectedStore2, setSelectedStore2] = useState(null)
  const [selectedStore3, setSelectedStore3] = useState(null)


  const fetch_brands = async () => {
    const response = await getAllBrands()
    setBrands(response.data)
  }

  const fetch_types = async () => {
    const response = await getAllTypes()
    setTypes(response.data)
  }

  const fetch_stores = async () => {
    const response = await getAllStores()
    setStores(response.data)
  }

  const fecth_locations = async () => {
    const response = await getAllLocations()
    setLocations(response.data)
  }

  const fetch_products_by_type = async () => {
    const response = await getByTypeProduct({type: selectedSelectProductType})
    console.log('products by type: ', response.data)
    setProducts(response.data)
  }

  const fetch_products_by_store = async (store) => {
    // console.log('fetching products from store: ', {store_name: store})
    const response = await getProductsFromStore({store_name: store})
    // console.log('fetched products by store: ', response)
    setProducts2(response.data)
    // setProducts3(response.data)
  }
  
  useEffect(() => {
    fetch_brands()
    fetch_types()
    fetch_stores()
    fecth_locations()
  }, [])

  useEffect(() => {
    if(selectedSelectProductType)
        fetch_products_by_type()
  }, [selectedSelectProductType])

//   useEffect(() => {
//     if(selectedStore)
//         fetch_products_by_store()
//   }, [selectedStore])

  useEffect(() => {
    if(selectedStore2) {
        // console.log('selected store 2: ', selectedStore2)
        fetch_products_by_store(selectedStore2)
    }
  }, [selectedStore2])

  useEffect(() => {
    if(selectedStore3) {
        // console.log('selected store 3: ', selectedStore3)
        fetch_products_by_store(selectedStore3)
    }
  }, [selectedStore3])

  // Events:

  const create_product_event = async () => {
    if (selectedBrand && selectedType && document.getElementById('1').value != '') {

        const body = {
            name: document.getElementById('1').value,
            brand: selectedBrand,
            type: selectedType
        }

        // console.log('create body event body:', body)
        const response = await createProduct(body)
        alert(`Uspesno smo kreirali proizvod: ${body.name}`)
    } else {
        alert('Morate prvo da odaberete sva polja pre kreiranja proizvoda!')
    }
  }

  const create_store_event = async () => {
    if (document.getElementById('2').value != '' && document.getElementById('3').value != '') {
        const body = {
            name: document.getElementById('2').value,
            address: document.getElementById('3').value
        }
        // console.log('create store body: ', body)
        await createStore(body)
        alert(`Uspesno smo kreirali prodavnicu: ${document.getElementById('2').value}`)

    } else {
        alert('Morate prvo da popunite sva polja pre kreiranja prodavnice!')
    }
  }

  const add_store_to_location_event = async () => {
    if (selectedStore && selectedLocation) {
        const body = {
            store_id: selectedStore,
            location_id: selectedLocation
        }

        // console.log('add location to store event: ', body)
        await addStoreToLocation(body)
        alert(`Operacija uspesna!`)
    } else {
        alert('Morate prvo da izaberete i prodavnicu i lokaciju!')
    }
  }

  const add_product_to_store_event = async () => {
    if(selectedStore && selectedProduct && document.getElementById('4').value != '') {
        // console.log('store: ', parseInt(selectedStore), 'product: ', parseInt(selectedProduct), 'price', parseInt(document.getElementById('4').value))
        const body = {
            store_id: parseInt(selectedStore),
            product_id: parseInt(selectedProduct),
            price: parseInt(document.getElementById('4').value)
        }
        // console.log('sending body: ', body)
        await addProductToStore(body)
        alert('Operacija uspesno obavljena!')

    } else {
        alert('Morate prvo da popunite sva polja!')
    }
  }

  const set_product_on_discount = async () => {
    // console.log('store:', store.filter(x => x.name === selectedStore2), 'product: ', selectedProduct2, 'price: ', document.getElementById('5').value)
    if(selectedStore2 && selectedProduct2 && document.getElementById('5').value != '') {
        
        const selected_store = store.filter(x => x.name === selectedStore2)
        
        const body = {
            store_id: selected_store[0].store_id,
            product_id: parseInt(selectedProduct2),
            discount: parseInt(document.getElementById('5').value)
        }

        // console.log('Creating discount:', body)
        await addProductToDiscount(body)
        alert('Uspesno smo obavili operaciju!')
    } else {
        alert(`Morate prvo da popunite sva polja!`)
    }
  }

  const remove_discount_from_product = async () => {
    if(selectedStore3 && selectedProduct3) {
        const body = {
            store_id: store.filter(x => x.name === selectedStore3)[0].store_id,
            product_id: parseInt(selectedProduct3)
        }

        await removeFromDiscount(body)
        alert('Uspesno smo uklonili proizvod sa popusta!')
        // console.log('Body: ', body)

    } else {
        alert(`Morate prvo da izaberete sve vrednosti!`)
    }
  }

  if(user.is_admin) {
      return (
          <div className='admin_controll_div'>
          <div className="inner_control_div">
            <div className="controll_option add_product">
                <div className="input_cont">
                    <label className="input_label">Product name: </label>
                    <input type="text" className="admin_input input_new_product_name" id='1'/>
                </div>
                <div className="input_cont">
                    <label className="input_label">Product brand: </label>
                    <select name="select_brand" id="add_product_brand_select" onChange={(e) => setSelectedBrand(e.target.value)}>
                      {
                        brands.map(x => {
                          return (
                              <option value={x.name}>{x.name}</option>
                          )
                        })    
                      }
                    </select>
                </div>
                <div className="input_cont">
                    <label className="input_label">Product type: </label>
                    <select name="select_brand" id="add_product_brand_select" onChange={(e) => setSelectedType(e.target.value)}>
                      {
                        types.map(x => {
                          return (
                              <option value={x.name}>{x.name}</option>
                          )
                        })    
                      }
                    </select>
                </div>
                <button className="admin_button create_product_event" onClick={() => create_product_event()}>Create product!</button>
            </div>

            <div className="controll_option add_store">
                <div className="input_cont">
                    <label className="input_label">Store name: </label>
                    <input type="text" className="admin_input input_new_store_name" id='2'/>
                </div>
                <div className="input_cont">
                    <label className="input_label">Store address: </label>
                    <input type="text" className="admin_input input_new_store_address" id='3'/>
                </div>
                <button className="admin_button create_store_event" onClick={() => create_store_event()}>Create store!</button>
            </div>

            <div className="controll_option add_store_to_location">
                <div className="input_cont">
                    <label className="input_label">Store: </label>
                    <select name="select_brand" id="add_product_brand_select" onChange={(e) => setSelectedStore(e.target.value)}>
                        {
                            store.map(x => {
                            return (
                                <option value={x.store_id}>{x.name}</option>
                            )
                        })    
                        }
                    </select>
                </div>
                <div className="input_cont">
                    <label className="input_label">Location: </label>
                    <select name="select_location" id="add_product_brand_select" onChange={(e) => setSelectedLocation(e.target.value)}>
                        {
                            locations.map(x => {
                            return (
                                <option value={x.location_id}>{x.name}</option>
                            )
                        })    
                        }
                    </select>
                </div>
                <button className="admin_button add_store_to_location" onClick={() => add_store_to_location_event()}>Add to location!</button>

            </div>
            <div className="controll_option add_product_to_store">
                <div className="input_cont">
                    <label className="input_label">Store: </label>
                    <select name="select_type" id="add_product_type_select" onChange={(e) => setSelectedStore(e.target.value)}>
                        {
                            store.map(x => {
                            return (
                                <option value={x.store_id}>{x.name}</option>
                            )
                        })    
                        }
                    </select>
                </div>
                <div className="input_cont">
                    <label className="input_label">Product type: </label>
                    <select name="select_type" id="add_product_type_select" onChange={(e) => setSelectedSelectProductType(e.target.value)}>
                        {
                            types.map(x => {
                            return (
                                <option value={x.name}>{x.name}</option>
                            )
                        })    
                        }
                    </select>
                </div>
                <div className="input_cont">
                    <label className="input_label">Product: </label>
                    <select name="select_product" id="add_product_type_select" onChange={(e) => setSelectedProduct(e.target.value)}>
                        {
                            products.map(x => {
                            return (
                                <option value={x.product_id}>{x.name}</option>
                            )
                        })    
                        }
                    </select>
                </div>
                <div className="input_cont">
                    <label className="input_label">Product price: </label>
                    <input type="text" className="admin_input input_new_product_price" id='4'/>
                </div>
                <button className="admin_button add_product_to_store_button" onClick={() => add_product_to_store_event()}>Add to location!</button>

            </div>
            <div className="controll_option add_product_on_discount">
                <div className="input_cont">
                    <label className="input_label">Store: </label>
                    <select name="select_type" id="add_discount_store_select" onChange={(e) => setSelectedStore2(e.target.value)}>
                        {
                            store.map(x => {
                                return (
                                    <option value={x.name}>{x.name}</option>
                                )
                            })    
                        }
                    </select>
                </div>
                <div className="input_cont">
                    <label className="input_label">Product: </label>
                    <select name="select_product" id="add_discount_product_select" onChange={(e) => setSelectedProduct2(e.target.value)}>
                        {
                            (products2) && (products2.map(x => {
                                return (
                                    <option value={x.product_id}>{x.name}</option>
                                )
                            }))
                        }
                    </select>
                </div>
                <div className="input_cont">
                    <label className="input_label">Discount price: </label>
                    <input type="text" className="admin_input input_discount_price" id='5'/>
                </div>
                <button className="admin_button set_product_discount" onClick={() => set_product_on_discount()}>Add on discount!</button>
            </div>
            <div className="controll_option remove_from_discount">
                <div className="input_cont">
                    <label className="input_label">Store: </label>
                    <select name="select_type" id="add_discount_store_select" onChange={(e) => setSelectedStore3(e.target.value)}>
                        {
                            store.map(x => {
                                return (
                                    <option value={x.name}>{x.name}</option>
                                )
                            })    
                        }
                    </select>
                </div>
                <div className="input_cont">
                    <label className="input_label">Product: </label>
                    <select name="select_product" id="add_discount_product_select" onChange={(e) => setSelectedProduct3(e.target.value)}>
                        {
                            (products2) && (products2.map(x => {
                                return (
                                    <option value={x.product_id}>{x.name}</option>
                                )
                            }))
                        }
                    </select>
                </div>
                <button className="admin_button remove_product_discount" onClick={() => remove_discount_from_product()}>Remove discount!</button>
            </div>
          </div>
        </div>
      )
  } else {
    return (
        <div>Nemate pristup admin stranici!</div>
    )
  }
}
