az ad app create --display-name arabicmusicencyclopedia
az ad sp create --id $appId
az ad app federated-credential create --id $appId --parameters github-credential.json