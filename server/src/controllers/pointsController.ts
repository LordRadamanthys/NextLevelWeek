import knex from '../database/connections'
import { Request, Response } from 'express'


class PointController {

    async create(req: Request, res: Response) {
        const { name, email, whatsapp, latitude, longitude, city, uf, items } = req.body
        const trx = await knex.transaction()
        const point = {
            image: req.file.filename,
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

        const pointItems = await items.split(',')
            .map((item: string) => Number(item.trim()))
            .map((item_id: number) => {
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

        const serializedPoints = {

            ...point,
            image_url: `http://192.168.15.15:3333/uploads/${point.image}`,

        }

        return res.status(200).json({ serializedPoints, items })

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

        const serializedPoints = points.map(point => {
            return {
                ...point,
                image_url: `http://192.168.15.15:3333/uploads/${point.image}`,
            }
        })

        return res.json(serializedPoints)
    }
}

export default PointController