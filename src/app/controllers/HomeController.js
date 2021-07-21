const Product = require('../models/product')
const {formatPrice} = require ('../../lib/utils.js')
const File = require('../models/File')


module.exports ={
async index(req, res) {
        try {
            let results = await Product.all()
            const products = results.rows
        
            if(!products) return res.send('Produto nao encontrado !!')
        
            async function getImage(productId) {
                let results = await Product.files(productId) 
                const files = results.rows.map(file => `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`)
                
                return files[0]
            
            }
            
            const productsPromisse = products.map(async product => {
                product.img = await getImage(product.id)    
                product.price = formatPrice(product.price)
                product.oldPrice = formatPrice(product.old_price)
                return product
            }).filter((product, index) => index > 2 ? false : true ) // ternario
        
            const lastAdded = await Promise.all(productsPromisse)
            return res.render('home/index', {products: lastAdded})
        } catch (error) {
            console.log(error)
        }
   
    },
}