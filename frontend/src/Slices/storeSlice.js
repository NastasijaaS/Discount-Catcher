import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    id: null,
    name: null,
    locations: [],
    brands:[],
    products: [],
    discounts:[]
}

export const storeSlice = createSlice({
    name: "storeSlice",
    initialState,
    reducers: {
        add_location: (state, action) => {
            state.locations.append(action.payload)
        },
        add_brand: (state, action) => {
            state.brands.append(action.payload)
        },
        add_product: (state, action) => {
            state.products.append(action.payload)
        }
    }
})

export const { add_location,add_brand,add_product } = storeSlice.actions

export default storeSlice.reducer