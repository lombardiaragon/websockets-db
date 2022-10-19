const knex=require('knex')

class DBcontainer{
    constructor(config,tableName){
        this.knex=knex(config)
        this.table=tableName
    }
    async insertData(data){
        return await this.knex.insert(data).into(this.table)
    }
    async getAll(){
        return await this.knex.select('*').from(this.table)
    }


}

module.exports={DBcontainer}
