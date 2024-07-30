const { error } = require('console');
const express = require('express')
const path = require('path')
const MongoClient = require('mongodb').MongoClient;
const bcrypt = require('bcrypt');

const app = express()

const templatepath = path.join(__dirname, '../templates')

//setting the middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded bodies
app.set("view engine", "ejs");
app.set("views", templatepath);

const startServer = async () => {
  try {
    //connect to the database
    const client = await MongoClient.connect("mongodb://localhost:27017")
    console.log("connected to db");

    //define the db name and collection name
    const db = client.db("Employee");
    const collection = db.collection("employeeInfo");
    const authcollection = db.collection("authenticationInfo");
    //define the routes
    app.get("/home", async (req, res) => {
      res.render("home", { error: null });
    });

    app.get("/", async (req, res) => {
      res.render("login", { error: null });
    })

    app.get("/signup", async (req, res) => {
      res.render("signup", { error: null });
    })

    app.post("/addEmployees", async (req, res) => {
      const { newEmployeeName, newEmployeeNumber } = req.body;
      try {
        const data = {
          newEmployeeName,
          newEmployeeNumber,
        };
        await authcollection.insertOne(data);
        res.render("home", { message: "entry created successfully!" });

      } catch (error) {
        console.error("Cannot add employee due to some issues", error);
        res.status(500).send("Cannot add employee due to some issues");
      }
    });

    app.post("/signup", async (req, res) => {
      const { name, password } = req.body;
      try {
          const existUsername = await authcollection.findOne({ name: req.body.name });
          if (existUsername) {
              res.render("signup", { error: "Username already exists" });
          } else {
              const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
              const data = {
                  name,
                  password: hashedPassword,
              };
              await collection.insertOne(data);
              res.render("home", { message: "Account created successfully!" });
          }
      } catch (error) {
          console.error("Error during signup:", error);
          res.status(500).send("Error during signup");
      }
  });

  app.post("/login", async (req, res) => {
      const { name, password } = req.body;
      try {
          const user = await collection.findOne({ name });
          if (user && await bcrypt.compare(password, user.password)) { // Compare the hashed password
              res.render("home");
          } else {
              res.render("login", { error: "Invalid username or password" });
          }
      } catch (error) {
          console.error("Error during login:", error);
          res.status(500).send("Error during login");
      }
  });

    //defining the port which the app will listen
    app.listen(3000, () => {
      console.log('Server is running on port 3000')
    });
  } catch (error) {
    console.error("an error occured while connecting to the server", error);
  }
};

startServer();