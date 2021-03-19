export const getCookie= name => { 
    var ident
    let t = decodeURIComponent(document.cookie).split(';')
    t.map(i => {
        let b = i.trim().split('=')
        if (b[0] == name) {
            ident = b[1]
        }
    })
    return ident
  };

export const setCookie = token => { 
    let date = new Date()
    date.setTime(date.getTime() + (1*24*3600*1000))
    let expires = `; Expires=${date.toUTCString()}`
    document.cookie = `state=${token || ""}${expires}; Path=/`
  }