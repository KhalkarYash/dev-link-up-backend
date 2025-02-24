const express = require("express");

const app = express();

app.use("/user", (req, res) => {
    res.send("Hahahahahahahahaha");
})

app.get("/user", (req, res) => {
    res.send({firstName: "Yash", lastName: "Khalkar"});
})

app.post("/user", (req, res) => {
    console.log("Data send logic here")
    res.send("Data successfully saved in the database")
})

app.delete("/user", (req, res) => {
    res.send("Deleted Sucessfully")
})

app.use("/hello",(req, res) => {
    res.send("Hello hello hello");
})

app.listen(7777, () => {
    console.log("Server is running on port 7777");
});
