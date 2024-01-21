import bcrypt from 'bcrypt'
import { create_session } from '../database.js'

import { user } from '../Models/user.js';
import { userRepository } from '../Models/Redis/user.js';
import { redis_client, connection } from '../database.js'
// import { product } from '../Models/product.js';

export const createUser = async (req, res) => {
    try {

        const {password, ...other} = req.body 
        //const salt = await bcrypt.genSalt(10)
        //const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new user(other.name, other.last_name, other.email, password, null, null, null, false);
        
        let response = null;

        const session = await create_session()
        await session.run('CREATE (u: User' + newUser.toJson() + ') RETURN u AS user').then(r => {
            response = r.records[0].get('user').properties
            response.user_id = r.records[0].get('user').identity['low']
            // console.log('id: ', r.records[0].get('user').identity)
            // console.log(response)
            session.close()
        })

        if (response) {
            // FIXME: mozda ovako?
            // const userRepository = redis_client.fetchRepository(userSchema)
            // console.log(response)
            const user = userRepository.createEntity({
                ...response
            })

            console.log(user)
            userRepository.save(user)

            return res.status(200).json(response)
        }
        else 
            return res.status(400).json('Nismo uspeli da kreiramo korisnika!')
        
        
    } catch(err) {
        console.log(err)
        return res.status(500).json(err)
    } 
}

export const getUser = async (req, res) => {
    try {
        
        const id = req.params['id']
        // let found_user = null

        // Provera da li se korisnik nalazi u redis-u:
        console.log('first')
        // const userRepository = await redis_client.fetchRepository(userSchema)
        const redis_res = await userRepository.search().where('user_id').equals(id).returnFirst()
        console.log(redis_res)
        
        // const session = await create_session()
        // await session.run('MATCH (u:User) WHERE ID(u) = ' + id + ' RETURN u AS user').then(r => {
        //     found_user = r.records[0].get('user').properties
        //     session.close()
        // })

        if(redis_res)
            return res.status(200).json(redis_res);
        else
            return res.status(404).json('Nismo pronasli korisnika sa datim id-jem!');

    } catch(err) {
        return res.status(500).json(err)
    }
}

export const loginUser = async (req, res) => {
    try {
        
        const {email,password} = req.body
        
        //const salt = await bcrypt.genSalt(10)
       // const hashedPassword = await bcrypt.hash(password, salt);
    

        let found_user = null
        let session = await create_session()
        await session.run('MATCH (u:User) WHERE u.email = \'' + email + '\' AND u.password= \''+ password +'\' RETURN u AS user').then(r => {
            found_user = r.records[0].get('user').properties
            found_user.user_id = r.records[0].get('user').identity['low']
            session.close()
        }).catch(() => {
            session.close()
        })

        // console.log('nesto21')

        let product_list = []
        session = await create_session()
        await session.run('MATCH (u:User)-[r:INTERESTED_IN_PRODUCT]->(p:Product) WHERE ID(u) = ' + found_user.user_id + ' RETURN p AS product').then(r => {
            r.records.map(x => {
                product_list.push(x.get('product').identity['low'])

            })
            session.close()
        })

        // FIXME: store list & brand list1

        if(found_user)
            return res.status(200).json({found_user, product_list});
        else
            return res.status(404).json('Nismo pronasli korisnika!');

    } catch(err) {
        return res.status(500).json(err)
    }
}

export const intrestedInProduct = async (req, res) => {
    try {

        const user_id = req.body['user_id']
        const product_id = req.body['product_id']

        
        // Pribavljamo korisnika:
        let result1 = null        
        let session = await create_session();
        await session.run('MATCH (u:User) WHERE ID(u) = ' + user_id + ' RETURN u AS user').then(r => {
            result1 = r.records[0].get('user').properties
            session.close()
        })


        // Pribavljamo proizvod za koji je zainteresovan:
        let result2 = null
        session = await create_session()
        await session.run('MATCH (p:Product) WHERE ID(p) = ' + product_id + ' RETURN p AS product').then(s => {
            console.log(s.records[0].get('product').properties)
            result2 = s.records[0].get('product').properties
            session.close()
        })


        // Samo ako smo prosledili postojeceg korisnika i postojeci proizvod:
        if (result1 && result2) {
            let result = null
            session = await create_session()
            await session.run('MATCH (u:User WHERE ID(u) = ' + user_id + '), (p:Product WHERE ID(p) = ' + product_id + ') CREATE (u)-[r:INTERESTED_IN_PRODUCT]->(p) RETURN r AS veza').then(r => {
                result = r.records[0].get('veza').properties
                session.close()
            })
            if (result)
                return res.status(200).json('Uspesno smo dodali proizvod na listu interesovanja!')
            else
                return res.status(400).json('Nismo uspeli da dodamo proizvod na listu interesovanja!')
        }
        else {
            return res.status(404).json('Nema User-a ili Product-a sa datim id-jem;')
        }

    } catch (err) {
        return res.status(500).json(err)
    }
}

export const intrestedInStore = async (req, res) => {
    try {

        const user_id = req.body['user_id']
        const store_id = req.body['store_id']

        // Pribavljamo korisnika:
        let result1 = null
        let session = await create_session();
        await session.run('MATCH (u:User) WHERE ID(u) = ' + user_id + ' RETURN u AS user').then(r => {
            result1 = r.records[0].get('user').properties
            session.close()
        })


        // Pribavljamo prodavnicu u koju je zainteresovan:
        let result2 = null
        session = await create_session()
        await session.run('MATCH (s:Store) WHERE ID(s) = ' + store_id + ' RETURN s AS store').then(r => {
            result2 = r.records[0].get('store').properties
            session.close()
        })

        // Samo ukoliko oba entiteta postoje:
        if (result1 && result2) {
            let response = null
            session = await create_session()
            await session.run('MATCH (u:User WHERE ID(u) = ' + user_id + '), (s:Store WHERE ID(s) = ' + store_id + ') CREATE (u)-[r:INTERESTED_IN_STORE]->(s) RETURN r AS veza').then(r => {
                response = r.records[0].get('veza').properties
                session.close()
            })

            if (response)
                return res.status(200).json('Uspesno smo dodali prodavnicu na listu interesovanja!')
            else
                return res.status(400).json('Nismo uspeli da dodamo prodavnicu na listu interesovanja!')
        }
        else {
            return res.status(404).json('Nema User-a ili Product-a sa datim id-jem;')
        }

    } catch (err) {
        return res.status(500).json(err)
    }
}

export const intrestedInBrand = async (req, res) => {
    try {

        const user_id = req.body['user_id']
        const brand_id = req.body['brand_id']

        // Pribavljamo korisnika:
        let result1 = null
        let session = await create_session();
        await session.run('MATCH (u:User) WHERE ID(u) = ' + user_id + ' RETURN u AS user').then(r => {
            result1 = r.records[0].get('user').properties
            session.close()
        })

        // Pribavljamo brend za koji je zainteresovan:
        let result2 = null
        session = await create_session()
        await session.run('MATCH (b:Brand) WHERE ID(b) = ' + brand_id + ' RETURN b AS brand').then(r => {
            result2 = r.records[0].get('brand').properties
            session.close()
        })

        // Samo ukoliko oba entiteta postoje:
        if (result1 && result2) {
            let result = null
            session = await create_session()
            await session.run('MATCH (u:User WHERE ID(u) = ' + user_id + '), (b:Brand WHERE ID(b) = ' + brand_id + ') CREATE (u)-[r:INTERESTED_IN_BRAND]->(b) RETURN r AS veza').then(r => {
                result = r.records[0].get('veza').properties
                session.close()
            })

            if (result)
                return res.status(200).json('Brend uspesno dodat na listu interesovanja!')
            else
                return res.status(400).json('Nismo uspeli da brend dodamo na listu interesovanja!')
        }
        else {
            return res.status(404).json('Nema User-a ili Brand-a sa datim id-jem;')
        }

    } catch (err) {
        return res.status(500).json(err)
    }
}

export const notIntrestedInBrand = async (req, res) => {
    try {

        const user_id = req.body['user_id']
        const brand_id = req.body['brand_id']

        // Pribavljamo korisnika:
        let result1 = null
        let session = await create_session();
        await session.run('MATCH (u:User) WHERE ID(u) = ' + user_id + ' RETURN u AS user').then(r => {
            result1 = r.records[0].get('user').properties
            session.close()
        })

        // Pribavljamo brend za koji je zainteresovan:
        let result2 = null
        session = await create_session()
        await session.run('MATCH (b:Brand) WHERE ID(b) = ' + brand_id + ' RETURN b AS brand').then(r => {
            result2 = r.records[0].get('brand').properties
            session.close()
        })

        // Samo ukoliko oba entiteta postoje:
        if (result1 && result2) {
            let result = null
            session = await create_session()
            await session.run('MATCH(u:User)-[r:INTERESTED_IN_BRAND]->(b:Brand) WHERE ID(u)= ' +user_id + ' AND ID(b)= ' + brand_id + ' DELETE r').then(r => {
                result = r.records[0].get('veza').properties
                session.close()
            })

            if (result)
                return res.status(200).json('Brend uspesno obrisan sa liste interesovanja!')
            else
                return res.status(400).json('Nismo uspeli da brend obrisemo sa liste interesovanja!')
        }
        else {
            return res.status(404).json('Nema User-a ili Brand-a sa datim id-jem;')
        }

    } catch (err) {
        return res.status(500).json(err)
    }
}

export const notIntrestedInProduct = async (req, res) => {
    try {

        const user_id = req.body['user_id']
        const product_id = req.body['product_id']

        // Pribavljamo korisnika:
        let result1 = null
        let session = await create_session();
        await session.run('MATCH (u:User) WHERE ID(u) = ' + user_id + ' RETURN u AS user').then(r => {
            result1 = r.records[0].get('user').properties
            session.close()
        })
        
        // Pribavljamo brend za koji je zainteresovan:
        let result2 = null
        session = await create_session()
        await session.run('MATCH (p:Product) WHERE ID(p) = ' + product_id + ' RETURN p AS product').then(r => {
            result2 = r.records[0].get('product').properties
            session.close()
        })
        
        // Samo ukoliko oba entiteta postoje:
        if (result1 && result2) {
            let result = null
            
            console.log('ovde smo')
            session = await create_session()
            await session.run(`MATCH(u:User)-[r:INTERESTED_IN_PRODUCT]->(p:Product) WHERE ID(u)= ${user_id} AND ID(p)=  ${product_id} DELETE r RETURN r`).then(r => {
                // result = r.records[0].get('veza').properties
                // console.log(r.updateStatistics)
                session.close()
            })

            return res.status(200).json('Proizvod uspesno obrisan sa liste interesovanja!')
            // if (result)
            // else
                // return res.status(400).json('Nismo uspeli da proizvod obrisemo sa liste interesovanja!')
        }
        else {
            return res.status(404).json('Nema User-a ili Product-a sa datim id-jem;')
        }

    } catch (err) {
        return res.status(500).json(err)
    }
}

export const notIntrestedInStore = async (req, res) => {
    try {

        const user_id = req.body['user_id']
        const store_id = req.body['store_id']

        // Pribavljamo korisnika:
        let result1 = null
        let session = await create_session();
        await session.run('MATCH (u:User) WHERE ID(u) = ' + user_id + ' RETURN u AS user').then(r => {
            result1 = r.records[0].get('user').properties
            session.close()
        })

        // Pribavljamo brend za koji je zainteresovan:
        let result2 = null
        session = await create_session()
        await session.run('MATCH (s:Store) WHERE ID(s) = ' + store_id + ' RETURN s AS store').then(r => {
            result2 = r.records[0].get('brand').properties
            session.close()
        })

        // Samo ukoliko oba entiteta postoje:
        if (result1 && result2) {
            let result = null
            session = await create_session()
            await session.run('MATCH(u:User)-[r:INTERESTED_IN_STORE]->(s:Store) WHERE ID(u)= ' +user_id + ' AND ID(s)= ' + store_id + ' DELETE r').then(r => {
                result = r.records[0].get('veza').properties
                session.close()
            })

            if (result)
                return res.status(200).json('Prodavnica uspesno obrisana sa liste interesovanja!')
            else
                return res.status(400).json('Nismo uspeli da prodavnicu obrisemo sa liste interesovanja!')
        }
        else {
            return res.status(404).json('Nema User-a ili prodavnice sa datim id-jem;')
        }

    } catch (err) {
        return res.status(500).json(err)
    }
}

export const getAllInterestedInProducts = async (req, res) => {

    try {

        const user_id = req.body['user_id']
        // const product_id = req.body['product_id']
        // console.log('ovde123')
        // let message = JSON.stringify({data: "Message 123", tag: [11]})
        // await connection.publish("app:customer", message)
        // console.log('ovde123')
        // Pribavljamo korisnika:

        let result1 = null

        let session = await create_session();
        await session.run('MATCH (u:User) WHERE ID(u) = ' + user_id + ' RETURN u AS user').then(r => {
            result1 = r.records[0].get('user').properties
            session.close()
        })

        // Samo ukoliko oba entiteta postoje:
        if (result1) {

            let result = []

            session = await create_session()
            await session.run('MATCH(u:User)-[r:INTERESTED_IN_PRODUCT]->(p:Product) WHERE ID(u)= ' +user_id + ' RETURN p AS product').then(r => {
                // console.log('intrested in products fun')
                r.records.map(x => {
                    // console.log(x)
                    let product_obj = x.get('product').properties
                    product_obj.product_id = x.get('product').identity['low']

                    console.log(product_obj)
                    result.push(product_obj)
                })

                console.log(result)
                session.close()
            })

            if (result)
                return res.status(200).json(result)
            else
                return res.status(400).json('Doslo je do greske prilikom pretrage proizvoda!')
        }

        else {
            return res.status(404).json('Nema User-a sa datim id-jem;')
        }

    } catch (err) {
        return res.status(500).json(err)
    }

}

export const getAllInterestedInStores = async (req, res) => {
    try {

        const user_id = req.body['user_id']

        let response = [];
        let session = await create_session();

        await session.run(`MATCH (u:User)-[r:INTERESTED_IN_STORE]->(s:Store) WHERE ID(u)= ${user_id} RETURN s AS store`).then(r => {
            // console.log(r.records[0].get('store').properties)
            
            r.records.map(s => {
                let store_obj = s.get('store').properties
                store_obj.store_id = s.get('store').identity['low']

                console.log(store_obj)

                response.push(store_obj)
            })
            session.close();
        })

        if(response.length > 0)
            return res.status(200).json(response)
        else
            return res.status(404).json('Nismo nista nasli!')

    } catch(err) {
        return res.status(500).json(err)
    }
}

export const getAllInterestedInBrand = async (req, res) => {
    try {

        const user_id = req.body['user_id'];

        let response = []
        let session = await create_session();

        await session.run(`MATCH (u:User)-[]->(b:Brand) WHERE ID(u)= ${user_id} RETURN b AS brand`).then(r => {

            r.records.map(x => {
                let brand_obj = x.get('brand').properties
                brand_obj.brand_id = x.get('brand').identity['low']

                response.push(brand_obj)
            })

            session.close();
        })

        if(response.length > 0)
            return res.status(200).json(response);
        else 
            return res.status(404).json('Nismo nasli ni jedan objekat!');


    } catch(err) {
        return res.status(500).json(err);
    }
}

export const userMessages = async (req, res) => {
    try {
        const user_id = req.body['user_id']
        let response = []
        
        let session = await create_session();
        await session.run(`MATCH (u:User)-[r:USER_MESSAGE]->(m:Message) WHERE ID(u) = ${user_id} RETURN r AS veza, m AS poruka`).then(r => {

            r.records.map(x => {
                let message_obj = x.get('poruka').properties
                message_obj.status = x.get('veza').properties['read']
                message_obj.message_id = x.get('veza').identity['low']

                // console.log(x.get('veza').properties)

                response.push(message_obj)
            })

            session.close();
        })

        if(response.length > 0)
            return res.status(200).json(response)
        else
            return res.status(404).json('No messages!')

    } catch (err) {
        return res.status(500).json(err)
    }
}

export const readMessage = async (req, res) => {
    try {

        console.log(req.body.message_id)

        let session = await create_session();
        await session.run(`MATCH (u:User)-[r:USER_MESSAGE]->(m:Message) WHERE ID(r) = ${req.body.message_id} SET r.read = True RETURN r`).then(r => {
            session.close()
        })

        return res.status(200).json('Ok!')

    } catch (err) {
        return res.status(500).json(err)
    }
}