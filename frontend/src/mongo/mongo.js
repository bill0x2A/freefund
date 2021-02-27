import data from "@iconify-icons/simple-line-icons/wallet";

 
export const login = async address => {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address })
      };
      console.log(requestOptions.body)
      const response = await fetch(`https://floating-temple-50905.herokuapp.com/login`, requestOptions)
      const responseCode = response.status;
      if (!response.ok) {
        // Not an OK reseponse
        if (responseCode == 400) {
            // Parse the body to see if we have the message
            const data = await response.json();
            if (data.message === "User not yet registered") {
                console.log(data);
                return data;
            }
            console.log(data.message);
        }
        throw new Error("HTTP error " + responseCode);
    }

    // OK response, read the data from the body, this is also async
    const data = await response.json();
    console.log(data)
    console.log("TOKEN FROM LOGIN: ", data.token);
    return data;
};

export const register = async userData => {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      };
  
      let responseCode;
      fetch(`https://floating-temple-50905.herokuapp.com/register`, requestOptions)
        .then(response => {
          responseCode = response.status;
          return(response.json());
        })
        .then(data => {
            console.log("DATA: ", data)
          if(responseCode == 200){
            return(data.token)
          }
          if(responseCode == 400){
            if(data.message === "One or more required fields not provided"){
              // Do nothing (UI does not allow, so no UX impact, theoretically)
              return null;
            } else {
                console.log("400 ERROR MESSAGE", data.message)
                return null;
            }
          }
        })
        .catch(error => {
          console.log(error)
          return error;
          // Handle in calling component
        });    
}

export const addProject = async projectData => {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData)
      };
      const response = await fetch(`https://floating-temple-50905.herokuapp.com/addProject`, requestOptions)
      const responseCode = response.status;
      console.dir(response);
      if (!response.ok) {
        // Not an OK reseponse
        if (responseCode == 400) {
            // Parse the body to see if we have the message
            const data = await response.json();
            console.log(data.message);
            if (data.message === "One or more required fields not provided") {
                return;
            }
        }
        throw new Error("HTTP error " + responseCode);
    }

    // OK response
    const data = await response.json();
    return {data, response};
}

export const loadProject = async id => {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({id}),
  };
  console.log(requestOptions.body);
  const response = await fetch(`https://floating-temple-50905.herokuapp.com/project`, requestOptions)
  const responseCode = response.status;
  if (!response.ok) {
    // Not an OK reseponse
    if (responseCode == 400) {
        // Parse the body to see if we have the message
        const data = await response.json();
        console.log(data.message);
        if (data.message === "Incorrect Id") {
            return 404;
        }
    }
    throw new Error("HTTP error " + responseCode);
  }

  // OK response
  const data = await response.json();
  return data;
}

export const loadProjects = async () => {
  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    body: null,
  };
  const response = await fetch(`https://floating-temple-50905.herokuapp.com/listProjects`, requestOptions)
  const responseCode = response.status;
  if (!response.ok){
    const data = await response.json()
    throw new Error("HTTP error " + responseCode + "\n" + data.message);
  }
  const data = await response.json();
  console.log("PROJECTS", data.projects);
  return data.projects;

}

export const loadUser = async address => {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({address}),
  };
  const response = await fetch(`https://floating-temple-50905.herokuapp.com/short`, requestOptions)
  const responseCode = response.status;
  if (!response.ok) {
    // Not an OK reseponse
    const data = await response.json();
    throw new Error("HTTP ERROR : " + responseCode + "\n" + data.message);
    }

  // OK response
  const data = await response.json();
  return data;
}

