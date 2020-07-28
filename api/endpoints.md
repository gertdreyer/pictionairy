# RESTFUL
- POST /auth:
- - {username, password}

- POST /register
- - {username, password}

# SOCKETS.IO
- testing
- - {} 
- - returns input

- joinroom
- - {roomid: 'string'}
- - returns {success, [error]}

- drawdata
- - broadcast to all other clients in room