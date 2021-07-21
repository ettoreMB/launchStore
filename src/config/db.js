const {Pool} = require('pg')



module.exports = 
        new Pool({
        user: 'postgres',
        password: "250791",
        host: 'localhost',
        port:5432,
        database: 'launchstoredb',

    })

     
 


