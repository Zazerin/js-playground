const { getAllOrders } = require('./orders.model');

module.exports = {
  Query: {
    orders: (parent) => {
      console.log('Getting orders ...')
      return getAllOrders();
    }
  }
}