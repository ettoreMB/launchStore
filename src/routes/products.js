const express = require('express')
const routes = express.Router()
const multer = require('../app/middlewares/multer')

const productController = require('../app/controllers/productsController')
const searchController = require('../app/controllers/searchController')
const {onlyUsers} = require('../app/middlewares/session')

//Search
routes.get('/search', searchController.index)

//Products
routes.get('/create', onlyUsers, productController.create)
routes.get('/:id', productController.show )
routes.get('/:id/edit',onlyUsers, productController.edit)


//create product
routes.post('/',onlyUsers, multer.array("photos", 6), productController.post)
routes.put('/',onlyUsers, multer.array("photos", 6), productController.put)
routes.delete('/',onlyUsers, productController.delete)





module.exports = routes