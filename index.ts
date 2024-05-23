import express from 'express';
import dotenv from 'dotenv';
import { Request, Response, NextFunction} from 'express';
dotenv.config()
const app = express();
import router from './src/routes/provision.routes';


app.use(express.json())

app.use('/v1', router)


app.use((err: Error,req:Request,res: Response,next: NextFunction) => {
    return res.status(500).send({err: err})
})


app.listen(process.env.PORT, () => {
    console.log("server listening on ", process.env.PORT)
})