import util from 'util'
import {exec} from 'child_process'
import AWS, { S3 } from "aws-sdk";
import axios from "axios";
import { stderr, stdout } from 'process';
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
        Key: `${this.bucketName}.tfvars`,
        Body: tfVarsContent,
        ContentType: "text/plain",
      };

      let response;
      s3.upload(params, async (err: Error, data: S3.ManagedUpload.SendData) => {
        if (err) {
        } else {
          response = await axios.post(
            `https://gitlab.com/api/v4/projects/57900971/trigger/pipeline?token=${process.env.PERSONAL_ACCESS_TOKEN}&ref=main`,
            { variables: variables }
          );
        }
      });
      return response;
    } catch (err) {
      console.log(err);
    }
  }
  async initializeDeprovision() {
    try {
        
         exec(`echo "this might work ${this.bucketName}" && terraform init -backend-config="bucket=frotend-status-bucket" -backend-config="key=${this.bucketName}.tfstate" -backend-config="region=us-east-1" -migrate-state`)
    }catch(err) {

    }
    
  }
}

export default Provision;
