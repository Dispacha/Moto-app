const db = require("./config/db");

// wait for initialization promise
db.ready
  .then(() => {
    db.query("SELECT id, name, phone, role, password FROM users", (err, results) => {
      if (err) return console.error(err);
      console.table(results);
      process.exit();
    });
  })
  .catch(err => {
    console.error("Erreur lors de l'initialisation DB", err);
    process.exit(1);
  });