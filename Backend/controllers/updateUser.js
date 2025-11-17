import { db } from "../data/connection.js";

export const updateUser = (req, res) => {
  const id = parseInt(req.params.id);
  const { name, email } = req.body;

  db.query(
    "UPDATE users SET name = $1, email = $2 WHERE id = $3",
    [name, email, id],
    (error, results) => {
      if (error) {
        throw error;
      }

      res.status(200).send(`User modified with ID: ${id}`);
    }
  );
};
