import util from "util";
import { execFileSync } from "child_process";
import path from "path";
import AWS, { S3 } from "aws-sdk";
import axios from "axios";
import { stderr, stdout } from "process";
AWS.config.update({
  region: "ap-south-1",
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
});

class Provision {
  bucketName: string;
  constructor(bucketName: string) {
    this.bucketName = bucketName;
  }

  async initializeProvision() {
    try {
      const variables = {
        BUCKETNAME: this.bucketName,
      };
      const s3 = new S3();

      const tfVarsContent = Object.keys(variables)
        .map((key) => `${key} = "${variables[key as keyof typeof variables]}"`)
        .join("\n");
      const params = {
        Bucket: "lmsfrontend",
      };

      const uploadFileToBucket = (bucket: string) => {
        const params = {
          Bucket: bucket,
          Key: `${this.bucketName}.tfvars`,
          Body: tfVarsContent,
          ContentType: "text/plain",
        };
        return s3.upload(params).promise();
      };

      const promises = ["lmsfrontend", "lmsbackend"].map((bucket) =>
        uploadFileToBucket(bucket)
      );
      const results = await Promise.all(promises);
      let response;
      if (results.length == 2) {
        response = await axios.post(
          `https://gitlab.com/api/v4/projects/57900971/trigger/pipeline?token=${process.env.PERSONAL_ACCESS_TOKEN}&ref=main`,
          { variables: variables }
        );
        console.log(results, "what is response", response);
      }
      return { success: true };
    } catch (err) {
      console.log(err);
    }
  }
  async initializeDeprovision() {
    try {
      const scriptPath = path.join(process.cwd(), "deprovision.sh");
      const fs = require("fs");
      if (!fs.existsSync(scriptPath)) {
        throw new Error(`File not found: ${scriptPath}`);
      }

      execFileSync("bash", [scriptPath, this.bucketName], { stdio: "inherit" });
    } catch (err) {
      console.log(err);
    }
  }
}

export default Provision;
