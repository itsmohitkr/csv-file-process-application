const { PORT = 5001 } = process.env;

const app = require("./app");

app.listen(PORT, () => {
    console.log(`server is listening on port: ${PORT}`);
})
