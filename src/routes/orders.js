const express = require('express')
const routes = express.Router()

const { onlyUsers } = require('../app/middlewares/session')


const orderController = require('../app/controllers/orderController')


// //login - logout
routes.post('/', onlyUsers, orderController.post)
      .get('/', onlyUsers, orderController.index)
      .get('/sales', onlyUsers, orderController.sales)
      .get('/:id', onlyUsers, orderController.show)
      .post('/:id/:action', onlyUsers, orderController.update)




     

 module.exports = routes