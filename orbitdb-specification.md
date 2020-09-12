# OrbitDB Schema 


## Main DBs 
### FEED 
- **Provider-ALL-FEED-DB** => store all providers by their details **(not sure if actually needed)**

- **Service-ALL-FEED-DB** => store all services by their details **(needed for UI)**

### KeyVal

- **Provider-KeyVal-DB** => **Key**: Provider Name, **Val**: hash obtained from adding to Provider-ALL-FEED-DB

- **Service-KeyVal-DB** =>  **Key**: Service Name, **Val**: hash obtained from adding to SERVICE-ALL-FEED-DB

## Individual DBs

- **Provider-SINGLE-FEED-DB** => for each provider, store the services he provides

- **Service-Rating-SINGLE-FEED-DB** => for each service, store all ratings 

- **Customer-SLA-SINGLE-FEED-DB** => for each customer, store all SLAs he has been involved with 


## Queries that should be possible:
- check whether provider is registered
- check if a customer has used a particular service (to allow for rating)
- get all services of a provider (to calculate reputation of a provider)

## Usage Examples


TO BE SPECIFIED 



First we add a provider/service to the FEED-DB and get the hash from db.add().
Only by this hash can we retrieve the entry from the FEED-DB. Thus we need to store the provider/service in a 
KeyVal-DB, where the key is the name and the value is the hash from db.add()
