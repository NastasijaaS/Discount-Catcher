import { create_session } from '../database.js'
import { brand } from '../Models/brand.js'

export const createBrand = async (req, res) => {
    try {

        const { name } = req.body
        const new_brand = new brand(name, null, null);
        
        const session = await create_session()
        let response = null
        
        await session.run('CREATE (b:Brand ' + new_brand.toJson() + ') RETURN b AS brand').then(r => {
            response = r.records[0].get('brand').properties
            session.close()
        })

        if (response)
            return res.status(200).json('Uspesno smo kreirali brend: ' + response.name)
        else
            return res.status(404).json('Nismo uspeli da dodamo brend!')

    } catch (err) {
        return res.status(500).json(err)
    }
}

export const getAllBrands = async (req, res) => {
    try {

        let response = []
        
        const session = await create_session()
        await session.run('MATCH (s:Brand) RETURN s LIMIT 25').then(r => {
            // response = r.records.map(x => { return x.get('s').properties })
            r.records.map(x => {
                let brand_obj = x.get('s').properties
                brand_obj.brand_id = x.get('s').identity['low']

                response.push(brand_obj)
            })
            session.close()
        })
        if (response.length != 0)
            return res.status(200).json(response)
        else
            return res.status(404).json('Nema nijednog brenda u bazi podataka!')

    } catch (err) {
        return res.status(500).json(err)
    }
}