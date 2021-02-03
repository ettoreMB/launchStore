const { hash } = require('bcryptjs')
const fs = require('fs')
const User = require('../models/User')
const Product = require('../models/product')
const { formatCep,formatCpfCnpj} = require('../../lib/utils')




// eslint-disable-next-line no-undef
module.exports = {
  registerForm(req, res) {
    return res.render('user/register')
  },
  async show(req, res) {
    const { user } = req

    user.cpf_cnpj = formatCpfCnpj(user.cpf_cnpj)
    user.cep = formatCep(user.cep)

    return res.render('user/index', { user: req.body})
  },
  async post(req, res) {
    try {
      let {name, email, password, cpf_cnpj, address, cep} = req.body

      passwod = await hash(password, 8)
      cpf_cnpj = cpf_cnpj.replace(/\D/g, ""),
      cep = cep.replace(/\D/g, "")

      const userId = await User.create({
        name, 
        email, 
        password,
        cpf_cnpj, 
        address, 
        cep
      })

      req.session.userId = userId

      return res.redirect('/users')


    } catch (error) {
      console.error(error)
    }
  },
  async update(req, res) {
    try {
      const {user} = req
      let {name, email, cpf_cnpj, cep, address } = req.body
      cpf_cnpj = cpf_cnpj.replace(/\D/g, "")
      cep= cep.replace(/\D/g, "")

      await User.update(user.id, {
        name,
        email,
        cpf_cnpj,
        cep,
        address
      })
      return res.render("user/index", {
        user: req.body,
        success: 'Atualizado com sucesso!!'
      })

    } catch (error) {
      console.error(error)
      return res.render('user/index',{
        error: 'Ocorreu algum erro, Tente mais tarde'
      })


    }
  },
  async delete(req, res) {
    try {
      const products = await Product.findAll({where: {user_id: req.body.id}});

      const allFilesPromisse = products.map(product => 
        Product.files(product.id));

      let promisseResults = await Promise.all(allFilesPromisse)

      await User.delete(req.body.id)
      req.session.destroy()

      promisseResults.map(result => {
        result.rows.map(file => {
          try {
              fs.unlinkSync(file.path)
          } catch (error) {
            console.error(error)
          }; 
        })
      })
      return res.render('session/login',{
        success: " Conta excluida com sucesso!!"
      })
    } catch (error) {
      console.error(error)
      return res.render("user/index", {
        user: req.body,
        error: "Erro ao tentar excluir tente mais tarde"
      })  
    }
  }
}