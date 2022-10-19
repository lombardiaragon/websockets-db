const {mysqlConfig}=require('./mysql/mysqlConfig')
const Knex= require('knex') (mysqlConfig)
// const Knex=knex(mysqlConfig)

Knex.schema.createTable('productos',tabla=>{
    // - id clave primaria autoincremental no nula
    tabla.increments('id')
    // - nombre tipo varchar 15 caracteres no nulo
    tabla.string('title',15).notNullable()
    // - precio tipo float
    tabla.float('price')
    // - codigo tipo varchar caracteres no nulo
    tabla.string('thumbnail').notNullable

})
    .then(()=>console.log('tabla creada'))
    .catch(e=>{
        console.log('error',e)
        // throw e
    })
    .finally(()=>Knex.destroy())