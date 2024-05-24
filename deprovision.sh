#!/bin/bash
echo "bucket name $1"
terraform init -backend-config="bucket=frotend-status-bucket" -backend-config="key=$1.tfstate" -backend-config="region=us-east-1" -migrate-state
terraform destroy -auto-approve
for i in {1..5}; do
    if [ $? -eq 0 ]; then
        break
    else
        echo "Retrying terraform destroy (attempt $i)..."
        terraform destroy -auto-approve
    fi
done
echo "terraform destroy successfull"


