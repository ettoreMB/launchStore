const express = require('express')
const routes = express.Router()

const { onlyUsers } = require('../app/middlewares/session')


const orderController = require('../app/controllers/orderController')


// //login - logout
routes.post('/', onlyUsers, orderController.post)
routes.get('/', onlyUsers, orderController.index)
     

 module.exports = routes