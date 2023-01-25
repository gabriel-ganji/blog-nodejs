const express = require("express");
const app = express();

//Sessions

const session = require("express-session");
app.use(session({
    secret: "Ganji01011010.", cookie: { maxAge: 60000 }
}));

// Redis

const categoriesController = require("./categories/categoriesController");
const articlesController = require("./articles/articlesController");

const Article = require("./articles/Article");
const Category = require("./categories/Category");

const usersController = require("./user/userController");

//Database
const connection = require("./database/connection");
connection
    .authenticate()
    .then(() => {
        console.log("Conectado com o mysql.");
    }).catch((error) => {
        console.log(error)
    });

//BodyParser
const bodyParser = require("body-parser");
const { route } = require("./categories/categoriesController");
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//View Engine
app.set("view engine", "ejs");

//Static
app.use(express.static("public"));

//Routes
app.get("/", (req, res) => {

    Article.findAll({
        order: [
            ["id", "DESC"]
        ],
        limit: 4
    }).then(articles => {
        
        Category.findAll().then(categories => {
            res.render("index.ejs", {articles: articles, categories: categories});
        });
        
    });

});

app.get("/session", (req, res) => {
    req.session.treinamento = "Formação NodeJS"
    //Rota que grava
    res.send("Sessão gerada!");

});

app.get("/read", (req, res) => {
    const treinamento = req.session.treinamento;
    //Rota que lê
    res.json({treinamento});
});

app.use("/", categoriesController);
app.use("/", articlesController);
app.use("/", usersController);

app.listen(8080, () => {
    console.log("Servidor iniciado na porta 8080.")
});