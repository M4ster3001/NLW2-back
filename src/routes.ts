import express, { response } from 'express';
import ClassesCtr from './controllers/ClassesCtr';
import ConnectionsCtr from './controllers/ConnectionsCtr';

const routes = express.Router();

const classesCtr = new ClassesCtr();
const connCtr = new ConnectionsCtr();

routes.get('/classes', classesCtr.index);
routes.post('/classes', classesCtr.create);

routes.get( '/connections', connCtr.index );
routes.post( '/connections', connCtr.create );


export default routes;