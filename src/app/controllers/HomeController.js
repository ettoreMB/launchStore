const LoadService = require('../services/LoadProductsService')


module.exports ={
async index(req, res) {
        try {
            const allProducts = await LoadService.load('products')
            const products = allProducts.filter((product, index) => 
                index > 2 ? false : true ) // ternario
        
            return res.render('home/index', {products})
        } catch (error) {
            console.log(error)
        }
   
    },
}