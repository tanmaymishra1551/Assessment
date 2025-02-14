import knex from "knex"
import knexfile from "./knexfile.js"

const db = knex(knexfile.development)

// Test Query
// const query = db.select("*").from("users").where("id", 1)

// query
//     .then((result) => {
//         console.log(result)
//     })
//     .catch((error) => {
//         console.error(error)
//     })

export default db
