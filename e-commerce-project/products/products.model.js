const products = [
  {
    id: 0,
    description: 'Red Shoe',
    price: 42.12,
    reviews: []
  },
  {
    id: 1,
    description: 'Blue Jeans',
    price: 55.55,
    reviews: []
  }
]

const getProductById = (id) => products.find((p) => p.id === id)

module.exports = {
  getAllProducts: () => products,
  getProductsByPrice: (min, max) => products.filter(p => p.price >= min && p.price <= max),
  getProductById,
  addNewProduct: (description, price) => {
    const newProduct = { id: new Date().valueOf(), description, price, reviews: [] };
    products.push(newProduct);

    return newProduct;
  },
  addNewReview: function (id, rating, comment) {  
    const product = getProductById(id);

    if (product) {
      const review = {
        id: new Date().valueOf(),
        rating,
        comment
      }

      product.reviews.push(review);

      return review;
    }
  },
}
