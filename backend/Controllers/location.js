import { create_session } from '../database.js'
import { location } from '../Models/location.js'

export const createLocation = async (req, res) => {
    try {

        const { name } = req.body
        const new_location = new location(name);
        
        const session = await create_session()
        let response = null
        
        await session.run('CREATE (l:Location ' + new_location.toJson() + ') RETURN l AS location').then(r => {
            response = r.records[0].get('location').properties
            session.close()
        })

        if (response) 
            return res.status(200).json('Uspesno smo kreirali lokaciju: ' + response.name)
        else
            return res.status(400).json('Nismo uspeli da kreiramo lokaciju!')

    } catch (err) {
        return res.status(500).json(err)
    }
}

export const getAllLocations = async (req, res) => {
    try {

        let response = []
        
        const session = await create_session()
        await session.run('MATCH (l:Location) RETURN l LIMIT 25').then(r => {
            // response = r.records.map(x => { return x.get('l').properties })
            r.records.map(x => {
                let location_obj = x.get('l').properties
                location_obj.location_id = x.get('l').identity['low']

                response.push(location_obj)
            })
            session.close()
        })
        if (response.length != 0)
            return res.status(200).json(response)
        else
            return res.status(404).json('Nema ni jedne prodavnice u bazi podataka!')

    } catch (err) {
        return res.status(500).json(err)
    }
}