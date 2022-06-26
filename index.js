

const express = require('express')


require("dotenv").config()
const { graphqlHTTP} = require("express-graphql");
const schema = require("./schema/schema.js")
const app = express()
app.use("/graphql",graphqlHTTP({
      schema,
      graphiql:true

}))
app.listen(process.env.PORT,()=> {
      console.log("listening on port "+process.env.PORT)
})