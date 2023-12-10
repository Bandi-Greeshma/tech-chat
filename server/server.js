const { server } = require("./socket");

// DB connecter execution
require("./db.connector")(() => {
  // Starting Server event loop
  server.listen(process.env.PORT, () =>
    console.log(
      `Server running on port ${process.env.PORT} url: http://localhost:${process.env.PORT}`
    )
  );
});
