const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
require('dotenv').config();
const productRoutes = require('./routes/API/products');
app.use(express.json());

app.use('/api', productRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})