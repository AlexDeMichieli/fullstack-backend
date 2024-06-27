const express = require('express');
const app = express();
const cors = require('cors')
const PORT = process.env.PORT || 3000;
require('dotenv').config();
const applyRoutes = require('./routes');

app.use(cors())
app.use(express.json());

applyRoutes(app);


app.get('/', (req,res)=>{
    res.json({"meesage":"hello there"})
})
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})