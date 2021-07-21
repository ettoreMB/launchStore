const User = require('../models/User')
const { compare } = require('bcryptjs')
const { urlencoded } = require('express')



async function login (req, res, next) {
  try {
    const{ email, password} = req.body

    const user = await User.findOne({ where: {email} })

    if (!user) return res.render('session/login', {
      user: req.body,
      error: 'Usuario nao cadastrado'
    })

  const passed = await compare(password, user.password)

  if (!passed) return res.render("session/login", {
    user: req.body,
    error: "Senha incorreta!!"
  })

  req.user = user

  next()
  } catch (error) {
    console.error(error)
  }
}

async function forgot (req, res, next) {
  const {email} = req.body

  try {
    let user = await User.findOne({where: {email}})

    if(!user) return res.render('session/forgot-password', {
      user: req.body,
      error: 'email nao cadastrado'
    })
    req.user = user
    next()

  } catch (error) {
    console.error(error)
  }
  
} 

async function reset (req, res, next) {
  try {
    // serach user
      const {email, password, token, passwordRepeat} = req.body

      const user = await User.findOne({where: {email}})

      if(!user) return res.render('session/password-reset', {
        user: req.body,
        token,
        error: 'USER NOT FOUND!!'
      })
    //password match
      if(password != passwordRepeat) return res.render('session/password-reset', {
        user: req.body,
        token,
        error: 'PASSWORD MISMATCH'
      })
    //token match
      if(token != user.reset_token) return res.render('session/password-reset', {
        user: req.body,
        token,
        error: 'Invalid Token, Please get a new password recover'
      })
      
    //expired toekn
    let now = new Date()
    now = now.setHours(now.getHours())
    
    if(now > user.reset_token_expires) return res.render('session/password-reset',{
      user: req.body,
      token,
      error: 'Your Token has expired, Please get a new password recover'
    })

    req.user = user
    next()
  } catch (error) {
    console.error(error)
  }
}

module.exports = {
  login,
  forgot,
  reset
}