const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
require('dotenv').config();
const productRoutes = require('./routes/API/products');
const userRoutes = require('./routes/API/auth');
app.use(express.json());

app.use('/api', productRoutes);
app.use('/api', userRoutes);

app.get('/', (req,res)=>{
    res.json({"meesage":"hello there"})
})
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})