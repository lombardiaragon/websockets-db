const {mysqlConfig}=require('./mysql/mysqlConfig')
const Knex= require('knex') (mysqlConfig)
// const Knex=knex(mysqlConfig)

Knex.schema.createTable('mensajes',tabla=>{
    // - id clave primaria autoincremental no nula
    tabla.increments('id')
    // - nombre tipo varchar 15 caracteres no nulo
    tabla.string('author',15).notNullable()
    // - precio tipo timestamp
    tabla.timestamp('created_at').defaultTo(Knex.fn.now())
    // - codigo tipo varchar caracteres no nulo
    tabla.string('msg').notNullable

})
    .then(()=>console.log('tabla creada'))
    .catch(e=>{
        console.log('error',e)
        // throw e
    })
    .finally(()=>Knex.destroy())