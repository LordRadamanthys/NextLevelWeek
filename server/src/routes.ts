import express from 'express'
import PointsController from './controllers/pointsController'
import ItemsController from './controllers/itemsController'
import multer from 'multer'
import multerConfig from './config/multer'
import { celebrate, Joi } from 'celebrate'

const routes = express.Router()
const pointsController = new PointsController()
const itemsController = new ItemsController()

const upload = multer(multerConfig)


routes.get('/items', itemsController.index)

routes.post('/points',
    upload.single('image'),
    celebrate({
        body: Joi.object().keys({
            name: Joi.string().required(),
            email: Joi.string().email().required(),
            whatsapp: Joi.string().required(),
            longitude: Joi.number().required(),
            latitude: Joi.number().required(),
            city: Joi.string().required(),
            items: Joi.string().required(),
            uf: Joi.string().required().max(2),
        })
    },{
        abortEarly:false,
    }),
    pointsController.create)


routes.get('/points/:id', pointsController.show)
routes.get('/points', pointsController.index)

export default routes

// {
// 	"name":"Mateus",
// 	"email":"contato@imperatriz.com",
// 	"whatsapp":"22222222",
// 	"latitude":-23.5109597,
// 	"longitude":-46.4416642,
// 	"city":"São Paulo",
// 	"uf":"SP",
// 	"items":[
// 		1,2,3,4
// 	]
// }