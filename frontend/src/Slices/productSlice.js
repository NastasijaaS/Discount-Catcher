import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    id: null,
    name: null,
    brand: null,
    type:null,
    stores: []
}

export const productSlice = createSlice({
    name: "productSlice",
    initialState,
    reducers: {
        add_store: (state, action) => {
            state.stores.append(action.payload)
        },
        getByType: (state, action) => {
            state.name = action.payload.name
            state.type = action.payload.type
            state.brand = action.payload.brand
        },
        getByBrand: (state, action) => {
            state.name = action.payload.name
            state.type = action.payload.type
            state.brand = action.payload.brand
        }
    }
})

export const { add_store,getByType,getByBrand } = productSlice.actions

export default productSlice.reducer