const { query } = require('express')
const db = require('../../config/db')


function find(filters, table) {
    let query = `SELECT * FROM ${table}`

    if(filters) {
      Object.keys(filters).map(key => {
      query += `${key}`

      Object.keys(filters[key]).map(field => {
      query +=` ${field} = '${filters[key][field]}'`
      })
    })
  }
  return db.query(query)
}


const Base = {
  init({table}) {
    if(!table) throw new Error(`Inavlid params`)
    this.table = table
  },
  async find(id) {
    try {
     const results = await find({where: {id}}, this.table)
     return results.rows[0]
    } catch (error) {
      console.error(error)
    }
  },

  async findOne(filters) {
    try {
     const results = await find(filters, this.table)
     return results.rows[0]
    } catch (error) {
      console.error(error)
    }
  },

  async findAll(filters) {
    try {
     const results = await find(filters, this.table)
     return results.rows
    } catch (error) {
      console.error(error)
    }
  },

  async create(fields){ // user.create({name: 'ettore'})
    try {
      let keys = [],
          values = []

      Object.keys(fields).map(key => {
        keys.push(key)
        values.push(fields[key])

        const query =`INSERT INTO ${this.table} (${keys.join(',')})
          Values = (${values.join(',')})
          RETURNIG id`

          const result = await db.query(query)
          return result.rows[0].id

        // if((index +1) < array.length) {
        //   keys += `${key},`
        //   values += `${fields[key]},`
        // } else {
        //   keys += `${key}`
        //   values += `${fields[key]}`
        // }
      })
    } catch (error) {
      console.error(error)
    }
  },

  update(id, fields) {
    try {
      let update = []

      Object.keys(fields).map(key => {
        const line = `${key} = '${fields[key]}'`
        update.push(line)
      })   

      let query = `UPDATE ${this.table} SET 
        (${update.join(',')})
        WHERE id = $(${id})
      `
      return db.query(query)
      
    } catch (error) {
      console.error(error)
    }
  },

  delete(id) {
    return db.query(`DELETE FROM ${this.table} WHERE id = $1`, [id] )
  },

}




module.exports = Base