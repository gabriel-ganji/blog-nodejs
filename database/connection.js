const Sequelize = require("sequelize");

const connection = new Sequelize("blogBentevi", "root", "Ganji01011010.", {
    host: "localhost",
    dialect: "mysql",
    timezone: "-3:00"
});


module.exports = connection;