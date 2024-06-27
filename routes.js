const productRoutes = require('./routes/API/products');
const userRoutes = require('./routes/API/auth');
const cartRoutes = require('./routes/API/cart');

module.exports = function(app) {
  app.use('/api', productRoutes);
  app.use('/api', userRoutes);
  app.use('/api', cartRoutes);
};