const express = require("express");
const router = express.Router();
const User = require("./User");
const bcrypt = require("bcryptjs");

router.get("/admin/users", (req, res) => {
    User.findAll().then(users => {
        res.render("admin/users/index", {users: users});
    });
});

router.get("/admin/users/create", (req, res) => {
    res.render("admin/users/create");
});

router.post("/users/create", (req, res) => {

    const email = req.body.email;
    const password = req.body.password;
    const passwordConfirmed = req.body.confirmPassword;

    if (password != passwordConfirmed) {
        console.log("Senhas divergentes. Certifique-se de que você digitou a mesma senha nos dois campos.")
        res.redirect("/admin/users/create");
    
    } else {

        User.findOne({where: {email: email}}).then(user => {
            if(user == undefined) {

                User.create({
                    email: email,
                    password: hash
                }).then(() => { 
                    console.log("Cadastro relaizado com sucesso!")
                    redirect("/");
                }).catch((err) => {
                    res.redirect("/");
                });        

            } else {
                res.redirect("/admin/users/create");
            }
        });

        let salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);
    }

});

router.get("/login", (req, res) => {
    res.render("admin/users/login");
});

router.post("/authenticate", (req, res) => {

    const email = req.body.email;
    const password = req.body.password;

    User.findOne({where: {email: email}}).then(user => {

        if (user !== undefined) {
            //Validar senha
            const correctPassword = bcrypt.compareSync(password, user.password);
            if(correctPassword) {
                req.session.user = {
                    id: user.id,
                    email: user.email
                }
                res.redirect("/admin/articles");

            } else {
                res.redirect("/login");
            }
        } else {
            res.redirect("/login");
        }
    });

});

router.get("/logout", (req, res) => {
    
    req.session.user = undefined;
    res.redirect("/");

});

module.exports = router;