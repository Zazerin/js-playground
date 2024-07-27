const {
  getAllProducts,
  getProductsByPrice,
  getProductById,
  addNewProduct,
  addNewReview
} = require('./products.model');

module.exports = {
  Query: {
    products: (parent, arg, context, info) => getAllProducts(),
    productsByPrice: (_, args) => getProductsByPrice(args.min, args.max),
    productById: (_, args) => getProductById(args.id),
  },
  Mutation: {
    addNewProduct: (_, args) => addNewProduct(args.description, args.price),
    addNewReview: (_, args) => {
      addNewReview(args.id, args.rating, args.comment)
    }
  }
}
