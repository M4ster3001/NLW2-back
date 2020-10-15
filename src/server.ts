import express from 'express';
import routes from './routes';
import cors from 'cors';
import morgan from 'morgan';

const app = express();

const port = 3333;

app.use(cors());
app.use( express.json() );
app.use( morgan( process.env.NODE_DEV == 'PRODUCTION' ? 'tiny' : 'dev' ) );
app.use(routes);

if( app.listen() ) {
    
    app.listen().close();
}

app.listen(port, () => {
    console.log( `Servidor rodando na porta ${ port }` );
});
