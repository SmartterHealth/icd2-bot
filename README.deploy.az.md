# Deploying the ICD2 Bot to Azure

## Deploy the ICD2DB Database to Azure

## Deploy the ICD2 Bot to Azure

Create web app bot in Azure

Open Kudu, navigate to wwwroot, then upload zip

From console in Kudu, enter the following command

```
npm install --production
```

Add variables

DB_UID
DB_PWD
DB_SERVER
DB_NAME


"{"code":"ResourceNotFound","message":"/ does not exist"}



```
az bot create --kind webapp --name "testicd2bot" --resource-group "smartterhealth" --lang Node --storage "smartterhealthstorage" --version v4
``