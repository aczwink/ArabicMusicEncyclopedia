az group create --name arabicmusicencyclopedia --location westeurope
az deployment group create --resource-group arabicmusicencyclopedia --template-file deploy.bicep --parameters deployParams.json
