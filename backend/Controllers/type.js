import { create_session } from '../database.js'
import { type } from '../Models/type.js'

export const createType = async (req, res) => {
    try {

        const { name } = req.body
        const new_type = new type(name, null, null);
        
        let response = null
        
        const session = await create_session()
        await session.run('CREATE (t:Type ' + new_type.toJson() + ') RETURN t AS type').then(r => {
            response = r.records[0].get('type').properties
            session.close()
        })

        if (response)
            return res.status(200).json('Uspesno smo kreirali tip: ' + response.name)
        else
            return res.status(404).json('Nismo uspeli da kreiramo tip!') 

    } catch (err) {
        return res.status(500).json(err)
    }
}

export const getAllTypes = async (req, res) => {
    try {

        let response = []

        let session = await create_session();
        await session.run(`MATCH (t:Type) RETURN t AS type`).then(r => {
            r.records.map(x => {
                let type_obj = x.get('type').properties
                type_obj.type_id = x.get('type').identity['low']

                response.push(type_obj)
            })

            session.close();
        })

        if(response.length > 0)
            return res.status(200).json(response)
        else 
            return res.status(400).json('Nema ni jednog tipa u bazi podataka!')

    } catch (err) {
        return res.status(500).json(err)
    }
}