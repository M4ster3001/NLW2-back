import express, { response } from 'express'
import ClassesCtr from './controllers/ClassesCtr'

const routes = express.Router()

const classesCtr = new ClassesCtr();

routes.post('/classes', classesCtr.create)

export default routes