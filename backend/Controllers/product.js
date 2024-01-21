import { create_session } from '../database.js'
import { product } from '../Models/product.js'

import { productRepository } from '../Models/Redis/product.js'
import { redis_client, connection } from '../database.js'

export const createProduct = async (req, res) => {
    try {
        // brand && type names
        const { name, brand, type } = req.body
        const new_product = new product(name, brand, null, type,("/assets/products/" + name + ".png"))
        
        // Kreiraj novi objekat tipa Product sa prosledjenim parametrima
        let product_id = null
        let product_obj = {}
        let session = await create_session()    // u 12:14AM, nakon 3 sata provalio sam da ne mozemo da menjamo podatak tipa 'const' :')
        await session.run('CREATE (p:Product ' + new_product.toJson() + ') RETURN p AS product').then(r => {
            product_id = r.records[0].get('product').identity['low']
            product_obj = new_product
            product_obj.product_id = product_id
            session.close()
        })

        // Ukoliko smo uspeli da kreiramo proizvod:
        if (product_id !== null) {

            // Kreiraj vezu Brand -[HAS_PRODUCT_BRAND]-> Product
            session = await create_session()
            await session.run('MATCH (p:Product WHERE ID(p) = ' + product_id + '), (b:Brand WHERE b.name = \'' + brand + '\') CREATE (b)-[r:HAS_PRODUCT_BRAND]->(p) RETURN r AS veza').then(r => {
                session.close()
            })

            // Kreiraj vezu Type -[HAS_PRODUCT_TYPE]-> Product
            session = await create_session()
            await session.run('MATCH (p:Product WHERE ID(p) = ' + product_id + '), (t:Type WHERE t.name = \'' + type + '\') CREATE (t)-[r:HAS_PRODUCT_TYPE]->(p) RETURN r AS veza').then(r => {
                session.close()
            })

            const ttlInSeconds = 60;
            const product = await productRepository.createEntity({
                ...product_obj
            })
            const redis_response = await productRepository.search().return.all();
            if(redis_response)
            {
                // console.log(redis_response)
                for (let i=0; i<redis_response.length; i++){
                    await redis_client.execute(['EXPIRE', `Product:${redis_response[i].entityId}`, ttlInSeconds]);               
                    console.log('Updating expire: ', redis_response[i].entityId, 'TTL: ', ttlInSeconds)
                }
                
                await productRepository.save(product)
                await redis_client.execute(['EXPIRE', `Product:${product.entityId}`, ttlInSeconds]);
            }
            
            
            return res.status(200).json('Uspesno smo kreirali proizvod: ' + name + ' sa id-jem: ' + product_id)
        }
        else 
            return res.status(400).json('Nismo uspeli da kreiramo proizvod, ni veze ka product-u i type-u!')

    } catch (err) {
        return res.status(500).json(err)
    }
}

export const getAllProductsByType = async (req, res) => {
    try {

        let response = []
        const { type } = req.body;

        
        const redis_response = await productRepository.search().where('type').equals(type).return.all()
        if(redis_response.length!=0){
            console.log("Vraca iz redis: ", redis_response)
            return res.status(200).json(redis_response)
        }

        // let redis_cache = [];
        const session = await create_session()
        await session.run('MATCH (p:Product {type: \''+type+'\'}) RETURN p AS p').then(r => {
            // response = 
            r.records.map(x => { 
                let product_obj = x.get('p').properties
                product_obj.product_id = x.get('p').identity['low']

                response.push(product_obj)
            })
            console.log('response: ', response)
            session.close()
        })
        if (response.length != 0) {
            
            // // kesiranje product-a u redis-u:
            const ttlInSeconds = 60;
            for(let i = 0; i < response.length; i++) {
                const redis_product = await productRepository.createEntity({
                        ...response[i]
                })
                await productRepository.save(redis_product)
                await redis_client.execute(['EXPIRE', `Product:${redis_product.entityId}`, ttlInSeconds]);
                console.log('Seting expire: ', redis_product.entityId, ttlInSeconds, 's')
            }


            return res.status(200).json(response)
        }
        else
            return res.status(404).json('Nema nijednog proizvoda tog tipa u bazi podataka!')

    } catch (err) {
        return res.status(500).json(err);
    }
}

export const getAllProductsByBrand = async (req, res) => {
    try {

        let response = []
        const {brand}=req.body;
        
        const redis_res = await productRepository.search().where('brand').equals(type).returnAll()
        if (redis_res.length > 0) {
            return res.status(200).json(['Redis response', redis_res])
        }

        const session = await create_session()
        await session.run('MATCH (p:Product {brand: \''+brand+'\'}) RETURN p').then(r => {
            response = r.records.map(x => {
                let product_obj = x.get('p').properties
                product_obj.product_id = x.get('p').identity['low']

                return product_obj
                })
            session.close()
        })
        if (response.length != 0)
        {
            const ttlInSeconds = 60;
            for(let i = 0; i < response.length; i++) {
                const redis_product = await productRepository.createEntity({
                        ...response[i]
                })
                await productRepository.save(redis_product)
                await redis_client.execute(['EXPIRE', `Product:${redis_product.entityId}`, ttlInSeconds]);
                console.log('Seting expire: ', redis_cache[i].entityId)
                return res.status(200).json(response)

            }
        }
        else
            return res.status(404).json('Nema nijednog proizvoda tog brenda u bazi podataka!')

    } catch (err) {
        return res.status(500).json(err)
    }
}

export const getProductFromAllStores = async (req, res) => {
    try {

        let response = []
        const { product_id } = req.body

        const session = await create_session()
        await session.run('MATCH (s:Store)-[r:HAS_PRODUCT]->(p:Product) WHERE ID(p)= '+product_id+' RETURN r AS veza, s AS store').then(r => {
            console.log(r)
            r.records.map(x => {
                let data = x.get('store').properties
                data.price = x.get('veza').properties['price'].low
                // console.log(data)
                response.push(data)
                console.log(response.length)
            })

            console.log('response: ', response)

            session.close()
        })
        if (response)
            return res.status(200).json(response)
        else
            return res.status(404).json('Nema nijedne prodavnice na toj lokaciji!')
        

    } catch (err) {
        return res.status(500).json(err)
    }
}

export const getProductsFilter = async (req, res) => {
    try {

        const {store_name} = req.body

        let names = ""
        for(let i=0; i<store_name.length; i++){
            names+="s.name= \'"+store_name[i]+"\'"
            if(i!=store_name.length-1)
                names+=" OR "
        }

        let response = []
        let session = await create_session()
        await session.run('MATCH (s:Store)-[r:HAS_DISCOUNT]->(p:Product) WHERE '+names+' RETURN r AS veza, p AS product').then(r => {
            r.records.forEach(x => {
                let data = x.get('product').properties
                data.price = x.get('veza').properties['discount'].low
                data.product_id=x.get('product').identity['low']
                response.push(data)
            })
            session.close()
        })
    
        if (response)
            return res.status(200).json(response)
        else
            return res.status(404).json('Nema nijednog proizvoda na akciji u izabranoj prodavnici!')
        
    } catch (err) {
        return res.status(500).json(err)
    }
}

export const fetchLatestDiscounts = async (req, res) => {
    try {

        let response = [];
        let session = await create_session();
        // console.log('ovde?')
        await session.run(`MATCH (s:Store)-[r:HAS_DISCOUNT]->(p:Product) RETURN p AS product LIMIT 50`).then(r => {
            r.records.map(x => {
                let product_obj = x.get('product').properties
                product_obj.product_id = x.get('product').identity['low']
                // const ttlInSeconds = 5 * 60;
                // const product = productRepository.createEntity({
                //     ...product_obj
                // })
                // productRepository.save(product)
                // productRepository.expire(product.id, ttlInSeconds)

                // console.log(product_obj)

                response.push(product_obj)
            })
            session.close();
        })

        console.log('After fetch, result is: ', response)

        if(response.length > 0)
            return res.status(200).json(response);
        else
            return res.status(404).json('No products!');

    } catch (err) {
        return res.status(500).json('No discounts!');
    }
}

