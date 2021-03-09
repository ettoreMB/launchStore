const LoadProductsServices = require('../services/LoadProductsService')

const Cart = require('../../lib/cart')


module.exports ={

  async index(req, res) {
    try {
      let { cart } = req.session
      

      const product = await LoadProductsServices.load('product', { where: { id: 1}})
      cart = Cart.init(cart).addOne(product)
        
        
       
        console.log(cart)

        return res.render("cart/index", {cart})

     } catch (error) {
        console.error(error)
    }
  },
}