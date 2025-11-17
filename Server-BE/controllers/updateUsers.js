import { pool } from "../data/conection.js";

export const updateUser = (request, response) => {
  const id = parseInt(request.params.id)
  const { name, email, passwd } = request.body

  pool.query(
    'UPDATE users SET name = $1, email = $2, passwd = $3 WHERE id = $4',
    [name, email, passwd, id],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`User modified with ID: ${id}`)
    }
  )
}