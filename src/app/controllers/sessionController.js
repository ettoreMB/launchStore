const User = require('../models/User')
const mailer = require('../../lib/mailer')
const {hash} = require('bcryptjs')
const crypto = require('crypto')




module.exports = {
  loginForm(req, res) {
      return res.render('session/login')
  },
  
  login(req, res) {
    req.session.userId = req.user.id

    return res.redirect('/users')
  },

  logout(req, res) {
    req.session.destroy()
    return res.redirect('/')  
  },
  forgotForm(req, res) {
    return res.render('session/forgot-password')
  },

  async forgot(req, res){
    const user = req.user
   try {
    
    // token for user
    const  token = crypto.randomBytes(20).toString('hex')

    //create token expire
    let now = new Date()
    now = now.setHours(now.getHours() + 1) // add one hour after now

    await User.update(user.id, {
      reset_token: token,
      reset_token_expires : now
    })
    //send link - email
    await mailer.sendMail({
      to: user.email,
      from: 'no-reply@laucnhstore.com.br',
      subject: 'Recuperação de Senha',
      html: `<h2>Perdeu a chave?</h2>
            <p>Não se preocupe, clique no link abaixo para recuperar sua senha</p>
            <p>
              <a href="http://localhost:3000/users/password-reset?token=${token}" target="blank">Clique Aqui!!</a>
            </p>
      `

    })
    // warn
    return res.render("session/forgot-password", {
      succes: 'Verifique sua caixa de email !!!'
    })
   } catch (error) {
     console.error(error)
     return res.render("session/forgot-password", {
      error: "Erro inesperado, tente novamente"
    })
   }
  },

  async resetForm(req, res){
    return res.render('session/password-reset', {token: req.query.token})
  },
  async reset(req,res) {
    const {password, token } = req.body
    const user = req.user

    try {
      
      //new password hash
        const newPassword = await hash(password, 8)
      //update user
          await User.update(user.id, {
            password: newPassword,
            reset_token:"",
            reset_token_expires: "",
          })
      //done msg
          return res.render('session/login', {
            user: req.body,
            success: 'Password Reset Done, Please Login!'
          })

    } catch (error) {
      console.error(error)
      return res.render("session/password-reset", {
        user:req.body,
        token,
        error: "Erro inesperado, tente novamente"
      })
    }
  }
}