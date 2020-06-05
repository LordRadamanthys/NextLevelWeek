import knex from '../database/connections'
import { Request, Response } from 'express'


class PointController {

    async create(req: Request, res: Response) {
        const { name, email, whatsapp, latitude, longitude, city, uf, items } = req.body
        const trx = await knex.transaction()
        const point = {
            image: 'iamge-fake',
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
        }
        const insertedIds = await trx('points').insert(point)

        const point_id = insertedIds[0]
        const pointItems = await items.map((item_id: number) => {
            return {
                point_id,
                item_id,
            }
        })
        console.log(insertedIds)
        await trx('points_items').insert(pointItems)

        trx.commit()
        return res.json({
            id: point_id,
            ...point,
        })

    }

    async show(req: Request, res: Response) {
        const { id } = req.params

        const point = await knex('points').where('id', id).first()

        if (!point)
            return res.status(400).json({ message: 'Point not found' })


        const items = await knex('items')
            .join('points_items', 'items.id', '=', 'points_items.item_id')
            .where('points_items.point_id', id)
            .select('title')

        return res.status(200).json({ point, items })

    }

    async index(req: Request, res: Response) {
        const { city, uf, items } = req.query

        const parseItems = String(items)
            .split(',')
            .map(item => Number(item.trim()))

        const points = await knex('points')
            .join('points_items', 'points.id', '=', 'points_items.point_id')
            .whereIn('points_items.item_id', parseItems)
            .where('city', String(city))
            .where('uf', String(uf))
            .distinct()
            .select('points.*')

        res.json(points)
    }
}

export default PointController