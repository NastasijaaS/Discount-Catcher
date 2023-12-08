import { create_session } from '../database.js'
import { store } from '../Models/store.js'

//import { storeRepository } from '../Models/Redis/store.js'

export const createStore = async (req, res) => {
    try {

        const { name, address } = req.body
        const new_store = new store(name, null, null, null, null, address);
        
        const session = await create_session()
        let response = null
        
        await session.run('CREATE (s:Store ' + new_store.toJson() + ') RETURN s AS store').then(r => {
            response = r.records[0].get('store').properties
            response.id = r.records[0].get('store').identity['low']
            session.close()
        })

        if (response) {

            const store = await storeRepository.createEntity({
                ...response
            })
            storeRepository.save(store)

            return res.status(200).json(response)
        }
        else
            return res.status(400).json('Nismo uspeli da kreiramo prodavnicu :(')

    } catch (err) {
        return res.status(500).json(err)
    }
}

export const getAllStores = async (req, res) => {
    try {

        let response = null

        const redis_res = await storeRepository.search().returnAll()
        if (redis_res.length > 0)
            return res.status(200).json(redis_res)
        
        const session = await create_session()
        await session.run('MATCH (s:Store) RETURN s LIMIT 25').then(r => {
            response = r.records.map(x => { return { store_id: x.get('s').identity['low'], ...x.get('s').properties } })
            session.close()
        })
        if (response.length != 0) {
            // Kesiranje prodavnica, za slucaj da prvi put ucitavamo sa neo4j nakon pokretanja redis-a:
            for(let i = 0; i < response.length; i++) {
                await storeRepository.createAndSave({
                    ...response[i]
                })
            }
            // storeRepository.save(store)
            return res.status(200).json(response)
        }
        else
            return res.status(404).json('Nema ni jedne prodavnice u bazi podataka!')

    } catch (err) {
        return res.status(500).json(err)
    }
}

export const addProductToStore = async (req, res) => {
    try {

        const { store_id, product_id, price } = req.body
        //console.log(store_id)

        // Pokusavamo da pronadjemo prodavnicu:
        let store_response = null
        let session = await create_session()
        await session.run('MATCH (s:Store) WHERE ID(s) = ' + store_id + ' RETURN s AS store').then(r => {
            store_response = r.records[0].get('store').properties
            //console.log(store_response)
            session.close()
        })


        // Pokusavamo da pronadjemo product:
        let product_response = null
        session = await create_session()
        await session.run('MATCH (p:Product) WHERE ID(p) = ' + product_id + ' RETURN p AS product').then(r => {
            product_response = r.records[0].get('product').properties
            session.close()
        })


        // Samo ako oba entiteta postoje:
        // FIXME: E sad, imam problem ovde, postoje 3 moguce situacije:
        // 1. Store -[HAS_PRODUCT]-> Product
        // 2. Store -[HAS_PRODUCT]-> Product 
        //            |- price: int    (cena regularno)
        //            |- discount: int (cena na popustu)
        //            |- discount_flag: bool 
        // 3. Store -[LINKED]-> Link -[LINK_PRODUCT]-> Product
        //if (store_response && product_response) {
            
        let response = null
        session = await create_session()
        await session.run('MATCH (p:Product WHERE ID(p) = ' + product_id + '), (s:Store WHERE ID(s) = ' + store_id + ') MERGE (s)-[r:HAS_PRODUCT{price: '+price+'}]->(p) RETURN r AS veza').then(r => {
            response=r.records[0].get('veza').properties
            //console.log(response)
            session.close();
        })

        let responseInverted = null
        session = await create_session()
        await session.run('MATCH (p:Product WHERE ID(p) = ' + product_id + '), (s:Store WHERE ID(s) = ' + store_id + ') MERGE (p)-[r:IN_STORE{price: '+price+'}]->(s) RETURN r AS veza').then(r => {
            responseInverted=r.records[0].get('veza').properties
            //console.log(responseInverted)
            session.close();
        })

        // update store data (redis):
        const store = await storeRepository.search().where('store_id').equals(store_id).returnFirst()
        store.product_list.append(product_id)
        await storeRepository.save(store)

        return res.status(200).json(response)

        // }

        // FIXME: vrati nesto sto ima smisla:
        // return res.status(200).json({store_id, product_id})

    } catch (err) {
        return res.status(500).json(err)
    }
}

export const addProductToDiscount = async (req, res) => {
    try {

        const { store_id, product_id, discount} = req.body
        //console.log(store_id)
        // storeRepository.

        // Pokusavamo da pronadjemo prodavnicu:
        let store_response = null
        let session = await create_session()
        await session.run('MATCH (s:Store) WHERE ID(s) = ' + store_id + ' RETURN s AS store').then(r => {
            store_response = r.records[0].get('store').properties
            //console.log(store_response)
            session.close()
        })

        // Pokusavamo da pronadjemo product:
        let product_response = null
        session = await create_session()
        await session.run('MATCH (p:Product) WHERE ID(p) = ' + product_id + ' RETURN p AS product').then(r => {
            product_response = r.records[0].get('product').properties
            session.close()
        })

        if (store_response && product_response) {
            
            let response = null
            session = await create_session()
            await session.run('MATCH (p:Product WHERE ID(p) = ' + product_id + '), (s:Store WHERE ID(s) = ' + store_id + ') MERGE (s)-[r:HAS_DISCOUNT{discount: '+discount+'}]->(p) RETURN r AS veza').then(r => {
                response=r.records[0].get('veza').properties
                session.close();
            })

            return res.status(200).json(response)
        }

        // FIXME: vrati nesto sto ima smisla:
        return res.status(200).json({store_id, product_id})

    } catch (err) {
        return res.status(500).json(err)
    }
}

export const addLocationToStore = async (req, res) => {
    try {

        const { store_id, location_id } = req.body
        //console.log(store_id)

        // Pokusavamo da pronadjemo prodavnicu:
        let store_response = null
        let session = await create_session()
        await session.run('MATCH (s:Store) WHERE ID(s) = ' + store_id + ' RETURN s AS store').then(r => {
            store_response = r.records[0].get('store').properties
            //console.log(store_response)
            session.close()
        })


        // Pokusavamo da pronadjemo location:
        let product_response = null
        session = await create_session()
        await session.run('MATCH (l:Location) WHERE ID(l) = ' + location_id + ' RETURN l AS location').then(r => {
            product_response = r.records[0].get('location').properties
            session.close()
        })

        if (store_response && product_response) {
            
            let response = null
            session = await create_session()
            await session.run('MATCH (l:Location WHERE ID(l) = ' + location_id + '), (s:Store WHERE ID(s) = ' + store_id + ') CREATE (l)-[r:ON_LOCATION]->(s) RETURN r AS veza').then(r=>{
                response=r.records[0].get('veza').properties
                session.close();
            })

            return res.status(200).json(response)
        }

        // FIXME: vrati nesto sto ima smisla:
        return res.status(200).json({store_id, product_id})

    } catch (err) {
        return res.status(500).json(err)
    }
}

export const getAllStoresByLocation = async (req, res) => {
    try {

        let response = null

        const {location_id}=req.body;
        console.log(location_id)
        const session = await create_session()
        await session.run('MATCH (l:Location)-[:ON_LOCATION]->(s:Store) WHERE l.name= \''+location_id+'\' RETURN s AS store').then(r => {
            response = r.records.map(x => { return x.get('store').properties })
            session.close()
        })
        if (response.length != 0)
            return res.status(200).json(response)
        else
            return res.status(404).json('Nema nijedne prodavnice na toj lokaciji!')

    } catch (err) {
        return res.status(500).json(err)
    }
}

export const getProductsFromStore = async (req, res) => {
    try {

        let response = []
        
        const { store_name } = req.body

        const session = await create_session()
        await session.run('MATCH (s:Store)-[r:HAS_PRODUCT]->(p:Product) WHERE s.name = \''+store_name+'\' RETURN r AS veza, p AS product').then(r => {

            r.records.map(x => {
                let obj = x.get('product').properties
                obj.price = x.get('veza').properties['price']['low']
                obj.discount = x.get('veza').properties['discount']['low']

                response.push(obj)
            })

            session.close()
        })

        if (response.length !== 0)
            return res.status(200).json(response)
        else
            return res.status(404).json('Nema nijednog proizvoda u toj prodavnici!')

    } catch (err) {
        return res.status(500).json(err)
    }
}