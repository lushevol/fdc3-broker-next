export default async (req, res) => {
  res.set("Content-Type", `application/json`);
  res.send({
    "message": "Hello World!"
  });
};
