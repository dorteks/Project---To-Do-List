const express = require("express");
const Joi = require("joi");
const { validate } = require("uuid");
const app = express();

app.use(express.json());

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => "server is listening on port " + PORT);

app.set("view engine", "ejs");
app.set("views", "views");

// //front end
// app.get("/", (req, res) => {
//   res.render("index.ejs");
// });

// app.get("/home", (req, res) => {
//   res.redirect("/");
// });

// app.get("/about-us", (req, res) => {
//   res.render("about.ejs");
// });

// app.get("/contact-us", (req, res) => {
//   res.render("contact.ejs");
// });

//backend

const lists = [
  { todo: "What do you want to do?", id: "What time do you plan to do this?" },
];

// console.log(
//   "The id for each activity (ToDo) is represented by an hour between 1:00hrs to 24:00hrs"
// );

app.get("/api/lists", (req, res) => {
  res.send(lists);
});

app.get("/api/lists/:id", (req, res) => {
  const list = lists.find((l) => l.id === parseInt(req.params.id));

  if (!list)
    res.status(404).send("There is no activity (ToDo) lined up for this id");
  res.send(list);
});

app.post("/api/lists", (req, res) => {
  const schema = Joi.object({
    todo: Joi.string().min(3).required(),
    id: Joi.number().min(0).max(24).required(),
  });

  const result = schema.validate();

  console.log(result);

  if (result.error) {
    res.status(400).send(result.error.details[0].message);
    return;
  }

  const list = {
    todo: req.body.todo,
    id: req.body.id,
  };

  lists.push(list);
  res.send(list);
});

app.put("/api/lists/:id", (req, res) => {
  const list = lists.find((l) => l.id === parseInt(req.params.id));

  if (!list)
    res.status(404).send("There is no activity (ToDo) lined up for this id");

  const schema = Joi.object({
    todo: Joi.string().min(3).required(),
    id: Joi.number().min().max(24).required(),
  });

  const result = schema.validate();

  if (result.error) {
    res.status(400).send(result.error.details[0].message);
    return;
  }

  list.todo = req.body.todo;
  list.id = req.body.id;

  res.send(list);
});

app.delete("/api/lists/:id", (req, res) => {
  const list = lists.find((l) => l.id === parseInt(req.params.id));

  if (!list)
    res.status(404).send("There is no activity (ToDo) lined up for this id");

  const index = lists.indexOf(list);
  lists.splice(index, 1);

  res.send(list);
});
