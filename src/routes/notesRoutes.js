module.exports = function (app) {
  const notesHandlers = require("../controllers/notesController");
  const userHandlers = require("../controllers/userController");

  app
    .route("/api/notes/add")
    .post(userHandlers.loginRequired, notesHandlers.createNote);

  app
    .route("/api/notes/getAll")
    .get(userHandlers.loginRequired, notesHandlers.getAllNotes);

  app
    .route("/api/notes/getSingle/:id")
    .get(userHandlers.loginRequired, notesHandlers.getSingleNote);

  app
    .route("/api/notes/delete/:id")
    .delete(userHandlers.loginRequired, notesHandlers.deleteNote);

  app
    .route("/api/notes/update/:id")
    .put(userHandlers.loginRequired, notesHandlers.updateNote);
};
