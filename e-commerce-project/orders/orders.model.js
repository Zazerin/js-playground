orders = [
  {
    date: '2005-05-05',
    subtotal: 90.22,
    items: [
      {
        product: {
          id: '0',
          description: 'Red Shoe',
          price: 42.12
        },
        quantity: 2
      }
    ]
  }
]

module.exports = {
  getAllOrders: () => orders
}
