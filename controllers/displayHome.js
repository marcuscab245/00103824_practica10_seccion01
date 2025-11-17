export const displayHome = async (req, res) => {
  return res.status(200).json({ status: true, message: "Server running" });
};
