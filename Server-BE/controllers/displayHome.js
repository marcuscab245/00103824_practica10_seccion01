export const displayHome = (request, response) => {
  return response.status(200).json({ status: true,
       message: "Server running" });
}