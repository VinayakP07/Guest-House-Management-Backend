const connectToMongo = require('./db.js');
connectToMongo();
const express = require('express');
const cors = require('cors')
const app = express();


app.use(cors())
const port = 5000;

app.use(express.json());

app.use('/auth/user', require('./Routes/auth_user.js'));
app.use('/auth/admin', require('./Routes/auth_admin.js'));
app.use('/requests', require('./Routes/requests.js'));
app.use('/rooms', require('./Routes/rooms.js'));

app.listen(port, () => {
  console.log(`App listening on port http://localhost:${port}`)
})