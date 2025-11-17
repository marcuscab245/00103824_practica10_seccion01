import { db } from "../data/connection.js";

export const getUsers = async (req, res) => {
  const { order } = req.query;
  if (order === "asc") return await getUsersAsc(req, res);

  await getUsersDesc(req, res);
};

export const getUsersDesc = async (req, res) => {
  db.query("SELECT * FROM users ORDER BY name DESC", async (error, results) => {
    if (error) {
      throw error;
    }

    const resultsFind = results.rows;
    const resultsLength = resultsFind.length ?? 0;

    return res.status(200).json({
      success: true,
      message: `users finded: ${resultsLength}`,
      resultsFind,
    });
  });
};

export const getUsersAsc = async (req, res) => {
  db.query("SELECT * FROM users ORDER BY name ASC", async (error, results) => {
    if (error) {
      throw error;
    }

    const resultsFind = results.rows;
    const resultsLength = resultsFind.length ?? 0;

    return res.status(200).json({
      success: true,
      message: `users finded: ${resultsLength}`,
      resultsFind,
    });
  });
};

export const getUserById = (req, res) => {
  const id = parseInt(req.params.id);

  db.query("SELECT * FROM users WHERE id = $1", [id], (error, results) => {
    if (error) {
      throw error;
    }

    res.status(200).json(results.rows[0]);
  });
};
