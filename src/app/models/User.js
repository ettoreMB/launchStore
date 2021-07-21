const db =require('../../config/db')
const {hash} = require('bcryptjs')
const fs = require('fs')
const Product = require('./product')


module.exports = {
  async findOne(filters) {
    try {
      let query = "SELECT * FROM users"

    Object.keys(filters).map(key => {
      query = `
        ${query} 
        ${key}
      `

      Object.keys(filters[key]).map(field => {
        query =`${query} ${field} = '${filters[key][field]}'`
      })
    })

    const results = await db.query(query)

    return results.rows[0]

    } catch (error) {
      console.error(error)
    }
    
  },

  async create(data) {
    const query = `  
    INSERT INTO users(
        name,
        email,
        password,
        cep,
        address,
        cpf_cnpj
    ) VALUES ($1, $2, $3, $4, $5, $6) 
      RETURNING id`
      

      //criptografia password
      const passwordHash = await hash(data.password, 8)
    
    const values = [
        data.name,
        data.email,
        passwordHash,
        data.cep.replace(/\D/g, ""),
        data.address,
        data.cpf_cnpj.replace(/\D/g, "")
        
    ]
    const results = await db.query(query, values)
    return results.rows[0].id
  },

  async update(id, fields) {
    let query = "UPDATE users SET"

    Object.keys(fields).map((key, index, array) => {
      if ((index + 1) < array.length) {
        query = `${query}
          ${key} = '${fields[key]}',
        `
      } else {
        // Last iteration
        query = `${query}
        ${key} = '${fields[key]}'
        WHERE id = ${id}
      `
      }
    })
    return db.query(query)
    
  },
  async delete(id) {
    // get all products
    let results = await db.query("SELECT * FROM products WHERE user_id = $1", [id])
    const products = results.rows
    // get all files
    const allFilesPromise = products.map(product => 
      Product.files(product.id))

      let promisesResults = await Promise.all(allFilesPromise)

    // delete user
    await db.query('DELETE FROM users WHERE id = $1', [id])

    // remove images from public/images 
     promisesResults.map(results => {
       results.rows.map(file => {
          try{
            fs.unlinkSync(file.path)
          }catch(error) {
            console.error(error)
          }
        })          
     })
    
  }
}