const LoadProductService = require('../services/LoadProductsService')
const User = require('../models/User')
const mailer = require('../../lib/mailer')



const email =(seller) =>  `
  <h2>Olá ${seller.name}</h2>
  <p>Você tem um novo pedido de compra do seu produto</p>
  <p>Produto: ${product.name}</p>
  <p>Preço: ${product.formatedPrice}</p>
  <p></br></br></p>
  <h3>Dados do comprador</h3>
  <p>Nome: ${buyer.name}</p>
  <p>Email: ${buyer.email}</p>
  <p>Endereço: ${buyer.address}</p>
  <p> ${buyer.cep}</p>
  <p></br></br></p>
  <p>Entre em contato com o comprador para finalizar a venda!</p>
  <p></br></br></p>
`
module.exports ={
async post(req, res) {
        try {
            const product = await LoadProductService.load('product', { where: {
              id: req.body.id
            }})

            const seller = await User.findOne({ where: { id: product.user_id}})

            const buyer = await User.findOne({ where: {id: req.session.userId}})

            await mailer.sendMail({
              to: seller.email, 
              from: 'noreplay@laucnhstore.com',
              subject: 'Novo pedido de compra',
              html: email(seller, product, buyer)
            })


            return res.render('orders/success')
        } catch (error) {
            console.log(error)
            return res.render('orders/error')
        }
   
    },
}