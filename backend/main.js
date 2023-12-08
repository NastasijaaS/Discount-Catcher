import express from 'express';
import cors from 'cors'
import { create_session, driver } from './database.js';

// Routes import:
import userRoute from './Routes/user.js'
import storeRoute from './Routes/store.js'
import brandRoute from './Routes/brand.js'
import typeRoute from './Routes/type.js'
import productRoute from './Routes/product.js'
import locationRoute from './Routes/location.js'

// Express config:
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Express router:
app.use('/user/', userRoute);
app.use('/store/', storeRoute);
app.use('/brand/', brandRoute);
app.use('/type/', typeRoute);
app.use('/product/', productRoute);
app.use('/location/', locationRoute);

// Database connection instance:
const handler = async () => {
    
    // Create session?
    // await create_client()
    // const session = await create_session()
    app.listen(8000, () => {
        console.log("Express server started at: 8000")
    })

};

// Create connection and start Express server:
handler()