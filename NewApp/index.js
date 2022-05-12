const express = require("express");
const jwt = require("jsonwebtoken");

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => "server is listening on port " + PORT);

//backend

app.get("/", (req, res) => {
  res.json("this is the new app i am creating");
});

//post data without requiring authentication
app.post("/api/post", (req, res) => {
  res.json("post created");
});

//post data only after authentication
app.post("/api/posts", verifyToken, (req, res) => {
  jwt.verify(req.token, "secretkey", (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      res.json({
        message: "post created",
        authData,
      });
    }
  });
});

//authenticating login details
app.post("/api/login", (req, res) => {
  const user = {
    id: 1,
    username: "admin",
    email: "admin@gmail.com",
  };

  jwt.sign({ user }, "secretkey", (err, token) => {
    res.json({ token });
  });
});

//authentication, verifying token
function verifyToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  } else {
    res.sendStatus(403);
  }
}
