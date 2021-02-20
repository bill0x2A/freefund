## Documentation

- POST '/login':
  
  body requirement: address
  
  response: 
    - 200: message="User registered", data, token
    - 400:
        - message = "User not yet registered" (Wrong or new address)
        - message="Address missing", error=true (Missing address from the body)

- POST '/register':
  
  body requirement: address, countryCode, bio, imgHash, email, firstName, lastName
  
  response:
    - 200: message = "registered successfully", token
    - 400: message = "One or more required fields not provided", error = true

- POST '/addProject':
  
  body requirement: title, creatorAddress, fundingAddress, imgHashes, description, reason, fundingLimit, 
            funding, tiers (array of tier object), funders
  
  response:
    - 200: message = "Project created successfully",name, id, address (escrow address)
    - 400: error = true, message = "One or more required fields not provided"

- GET '/listProjects':
  
  body requirements: token
  
  response:
    - 200: data

- POST '/project':
  
  body requirements: token, id(project id)
  
  response:
    - 200: message="Found successfully", data (project data)
    - 400: 
        - message = "Incorrect Id" (incorrect id)
        - error=true, message = "No id given"

- POST '/user':
  
  body requirements: token, address
  
  response: 
    - 200: message = "User registered", data
    - 400: 
      - message = "User not yet registered" (user not found)
      - message = "Address missing", error = true (missing address)

- POST '/addBalance':
  
  body requirements: token, address
  
  response: 
    - 200: message = "Balance Updated", data (former data)
    - 400: 
      - message = "User not yet registered" (user not found)
      - message = "Address missing", error = true (missing address)

- POST '/reduceBalance':
  
  body requirements: token, address
  
  response: 
    - 200: message = "Balance Updated", data (former data before update)
    - 400: 
      - message = "User not yet registered" (user not found)
      - message = "Address missing", error = true (missing address)