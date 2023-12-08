import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    id: null,
    name: null,
    last_name: null,
    intrested_in_products: [],
    intrested_in_stores: [],
    intrested_in_brands: []
}

export const userSlice = createSlice({
    name: "userSlice",
    initialState,
    reducers: {
        login: (state, action) => {
            state.id = action.payload
        },
        register:(state,action)=>{
            state.name=action.payload.name
            state.last_name=action.payload.last_name
            state.email=action.payload.email
            state.password=action.payload.password
        },
        add_product: (state, action) => {
            state.intrested_in_products.append(action.payload)
        },
        add_store: (state, action) => {
            state.intrested_in_products.append(action.payload)
        },
        add_brand: (state, action) => {
            state.intrested_in_brands.append(action.payload)
        },
        log_out: (state) => {
            state.id = null
        },
        load_products: (state, action) => {
            state.intrested_in_products = action.payload
        },
        append_product: (state, action) => {
            state.intrested_in_products.push(action.payload)
        },
        pop_product: (state, action) => {
            state.intrested_in_products = state.intrested_in_products.filter(x => x != action.payload)
        }
    }
})

export const {login,register, add_product, add_store, add_brand, log_out, load_products, append_product, pop_product } = userSlice.actions

export default userSlice.reducer