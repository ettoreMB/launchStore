const express = require('express')
const routes = express.Router()

const cartController = require('../app/controllers/cartController')


// //login - logout
routes.get('/', cartController.index)
      .post('/:id/add-one', cartController.addOne)
      .post('/:id/remove-one', cartController.removeOne)
      .post('/:id/delete', cartController.delete)

 module.exports = routes