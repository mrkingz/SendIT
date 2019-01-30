import db from "./index";

db.dropTables()
  .then(() => {
    db.createTables().then(() => process.exit());
  })
  .catch(e => {
    console.log(e);
  });
