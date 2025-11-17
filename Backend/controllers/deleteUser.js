import { db } from "../data/connection.js";

export const deleteUser = (req, res) => {
  const id = parseInt(req.params.id);

  db.query("DELETE FROM users WHERE id = $1", [id], (error, results) => {
    if (error) {
      throw error;
    }
    res.status(200).send(`User deleted with ID: ${id}`);
  });
};
