const User = require('../models/User')
const {
  formatCep,
  formatCpfCnpj
} = require('../../lib/utils')


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
      const userId = await User.create(req.body)
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
      await User.delete(req.body.id)
      req.session.destroy()

      return res.render('session/login',{
        success: 'ACCOUNT DELETED'
      })
    } catch (error) {
      console.error(error)
      return res.render('user/index',{
        user: req.body,
        error: 'Error ! try it later again '
      })
    }
  }
}