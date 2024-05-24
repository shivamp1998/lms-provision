import express from 'express';
import dotenv from 'dotenv';
import { Request, Response, NextFunction} from 'express';
dotenv.config()
import router from './src/routes/provision.routes';
import redis from './src/services/redis.service'
import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter  } from '@bull-board/api/bullMQAdapter';
import { ExpressAdapter } from '@bull-board/express';
import  { deprovisionQueue } from './src/services/bullmq.service'

const app = express();
const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/v1/queue')
const { addQueue, removeQueue, setQueues, replaceQueues } = createBullBoard({
    queues: [new BullMQAdapter(deprovisionQueue)],
    serverAdapter: serverAdapter
})

app.use(express.json())
app.use('/v1', router)
app.use('/v1/queue', serverAdapter.getRouter())
app.use((err: Error,req:Request,res: Response,next: NextFunction) => {
    console.log("error occurred is", err)
    return res.status(500).send({err: err})
})



redis.on("connect", () => {
    console.log("connection to redis successful")
})
app.listen(process.env.PORT, () => {
    console.log("server listening on ", process.env.PORT)
})