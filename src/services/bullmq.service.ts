import { Queue, Worker } from "bullmq";
import redis from "./redis.service";
import Provision from "../factory/provision.factory";
import { ChildProcess } from "child_process";

const deprovisionQueue = new Queue("deprovisionQueue");
const deprovisionWorker = new Worker(
  "deprovisionQueue",
  async (job) => {
    try {
      const instance = new Provision(job.data.bucketName);
      const child: any = await instance.initializeDeprovision();
    } catch (err: any) {
      console.log(err);
      throw err;
    }
  },
  {
    connection: redis,
  }
);

export { deprovisionQueue };
