import { create_session } from '../database.js'
import { store } from '../Models/store.js'
import { message } from '../Models/message.js'

import { storeRepository } from '../Models/Redis/store.js'
import { redis_client, connection } from '../database.js'

export const createStore = async (req, res) => {
    try {

        const { name, address } = req.body
        const new_store = new store(name, null, null, null, null, address);
        
        const session = await create_session()
        let response = null
        let store_obj = {}
        let store_id = null
        
        await session.run('CREATE (s:Store ' + new_store.toJson() + ') RETURN s AS store').then(r => {
            response = r.records[0].get('store').properties
            store_id = r.records[0].get('store').identity['low']
            store_obj=new_store
            store_obj.store_id = store_id
            session.close()
        })

        if (store_id) {
            const ttlInSeconds = 60;
            const store = await storeRepository.createEntity({
                ...store_obj
            })
            const redis_response = await storeRepository.search().return.all();
            if(redis_response)
            {
                for (let i=0; i<redis_response.length; i++){
                    await storeRepository.remove(redis_response[i].entityId)
                    await storeRepository.save(redis_response[i])
                    await redis_client.execute(['EXPIRE', `Store:${redis_response[i].entityId}`, ttlInSeconds]);               
                }
                console.log("resp " + redis_response)

                await storeRepository.save(store)
                await redis_client.execute(['EXPIRE', `Store:${store.entityId}`, ttlInSeconds]);
            }
            return res.status(200).json('Uspesno smo kreirali radnju: sa id-jem: ' + store_id)
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
            await session.run(`MATCH (s:Store), (p:Product) WHERE ID(s) = ${store_id} AND ID(p) = ${product_id} MERGE (s)-[r:HAS_DISCOUNT]->(p) ON CREATE SET r.price = ${discount} ON MATCH SET r.price = ${discount} RETURN r AS veza`).then(r => {
                response=r.records[0].get('veza').properties
                session.close();
            })

            // obavestavamo korisnike o popustu za dati proizvod:

            let intrested_users_list = []
            session = await create_session()
            await session.run(`MATCH (u:User)-[r:INTERESTED_IN_PRODUCT]->(p:Product) WHERE ID(p) = ${product_id} RETURN u AS user`).then(r => {

                r.records.map(x => {
                    let intrested_user = x.get('user').properties
                    intrested_user.user_id = x.get('user').identity['low']
                    
                    console.log('intrested user: ', intrested_user)

                    intrested_users_list.push(intrested_user)
                })

                session.close();
            })

            if(intrested_users_list.length > 0) {

                // let message = JSON.stringify({data: "Message 123", tag: [11]})
                // await connection.publish("app:customer", message)

                // jednom za sve trenutno prijavljene korisnike:
                let mess = JSON.stringify({data: `Proizvod za koji ste zainteresovani: ${product_response.name} je na akciji u prodavnici: ${store_response.name}!`, tag: [product_id]})
                await connection.publish("app:customer", mess)

                console.log('obavestili smo korisnike (prijavljene)')
                console.log('obavestavamo: ', intrested_users_list.length, 'korisnika preko poruka u bazi!')
                
                // kreiramo poruku i vezemo za sve korisnike u bazi:
                for(let i = 0; i < intrested_users_list.length; i++) {
                    const msg = new message(`Postovani: ${intrested_users_list[i].name}, proizvod koji pratite: ${product_response.name} je na akciji u prodavnici: ${store_response.name}!`)
                    
                    console.log('kreirali smo poruku: ', msg.toJson())
                    console.log('Sending: ', `MATCH (u:User WHERE ID(u) = ${intrested_users_list[i].user_id}) CREATE (u)-[r:USER_MESSAGE {read: False}]->(m:Message ${msg.toJson()})`)
                    session = await create_session()
                    await session.run(`MATCH (u:User WHERE ID(u) = ${intrested_users_list[i].user_id}) CREATE (u)-[r:USER_MESSAGE {read: False, type: 'Product', object_id: ${product_id}}]->(m:Message ${msg.toJson()}) RETURN r AS veza`).then(r => {
                        console.log(r.records.get('veza').properties)
                        session.close()
                    })
                }
            }

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
            response = r.records.map(x => { 
                let store_obj = x.get('store').properties 
                store_obj.store_id = x.get('p').identity['low']
                const ttlInSeconds = 5 * 60;
                const store = storeRepository.createEntity({
                    ...store_obj
                })
                storeRepository.save(store)
                storeRepository.expire(store.id, ttlInSeconds)
                
                return store_obj
            })
            session.close()
        })
        if (response.length != 0)
        {
            const ttlInSeconds = 60;
            for(let i = 0; i < response.length; i++) {
                const redis_product = await storeRepository.createEntity({
                        ...response[i]
                })
                await storeRepository.save(redis_product)
                await redis_client.execute(['EXPIRE', `Store:${redis_product.entityId}`, ttlInSeconds]);
                console.log('Seting expire: ', redis_cache[i].entityId)
            }


            return res.status(200).json(response)
        }
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
                obj.product_id = x.get('product').identity['low']
                obj.price = x.get('veza').properties['price']['low']

                response.push(obj)
            })

            session.close()
        })

        if (response.length !== 0)
        {
            return res.status(200).json(response)

        }
        else
            return res.status(404).json('Nema nijednog proizvoda u toj prodavnici!')

    } catch (err) {
        return res.status(500).json(err)
    }
}

export const removeDiscount = async (req, res) => {
    try {

        const store_id = req.body['store_id']
        const product_id = req.body['product_id']

        let session = await create_session();
        await session.run(`MATCH (s:Store)-[r:HAS_DISCOUNT]->(p:Product) WHERE ID(s)=${store_id} AND ID(p)=${product_id} DETACH DELETE r`).then(r => {
            session.close()
        })

        return res.status(200).json('Veza uspesno obrisana!')

    } catch (err) {
        return res.status(500).json(err)
    }
}