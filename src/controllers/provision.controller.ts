import { Request, Response, NextFunction } from "express";
import Provision from "../factory/provision.factory";
import { deprovisionQueue } from "../services/bullmq.service";

const provisionController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const bucketName = req.body["bucketName"];
    const instance = new Provision(bucketName);
    const provisioned = await instance.initializeProvision();
    deprovisionQueue.add(
      "deprovisionQueue",
      {
        bucketName: bucketName,
      },
      {
        delay: 30 * 60 * 1000,
      }
    );
    return res.send({ bucketName, provisioned });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export default {
  provisionController,
};
