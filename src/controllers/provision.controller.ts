import { Request, Response, NextFunction} from 'express';
import Provision from '../factory/provision.factory';

const provisionController = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const bucketName = req.body["bucketName"];
      const instance = new Provision(bucketName);
      instance.initializeProvision();
      return res.send(({bucketName}))  
    }catch(err) {
        console.log(err);
       next(err)
    }
}

export default {
    provisionController
}