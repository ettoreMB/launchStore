const LoadProductsService = require('../services/LoadProductsService')


module.exports ={
async index(req, res) {
        try {
            const allProducts = await LoadProductsService.load('products')
            const products = allProducts.filter((product, index) => 
                index > 6 ? false : true ) // ternario
                console.log(products)
            return res.render('home/index', {products})
        } catch (error) {
            console.log(error)
        }
   
    },
}