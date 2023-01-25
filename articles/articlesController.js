const express = require("express");
const router = express.Router();
const Category = require("../categories/Category");
const Article = require("./Article");
const slugify = require("slugify");

//AdminAuth
const adminAuth = require("../middlewares/adminAuth");

router.get("/admin/articles", adminAuth, (req, res) => {
    Article.findAll({
            include: [{model: Category}]
    }).then(articles => {
        res.render("admin/articles/index", {articles: articles});
    });
});

router.get("/admin/articles/new", adminAuth, (req, res) => {
    Category.findAll().then(categories => {
        res.render("admin/articles/new", {categories: categories})
    });
});

router.post("/articles/save", (req, res) => {

    const title = req.body.title;
    const body = req.body.body;
    const category = req.body.category;

    Article.create({
        title: title,
        slug: slugify(title),
        body: body,
        categoryId: category
    }).then(() => {
        res.redirect("/admin/articles");
    });

});

router.post("/articles/delete", (req, res) => {
    const id = req.body.id;
    if (id != undefined) {
        if (!isNaN(id)){
            Article.destroy({
                where: {
                    id: id
                }
            }).then(() => {
                res.redirect("/admin/articles");
            });
        } else {
            res.redirect("/admin/articles");
        }
    } else {
        res.redirect("/admin/articles");
    }
});


router.get("/article/:slug", (req, res) => {
    const slug = req.params.slug;
    Article.findOne({
        where: {
            slug: slug
        }
    }).then(article => {
 
        if(article) {
            Category.findAll().then(categories => {
                res.render("article", {article: article, categories: categories});
            });
        } else {
            res.redirect("/");
        }
    }).catch(err => {
        res.redirect("/");
    });

});

router.get("/admin/article/edit/:id", adminAuth, (req, res) => {
   
    const id = req.params.id;
    if (id != undefined) {
        if (!isNaN(id)){
            Article.findOne({
                where: {id: id},
                include: [{model: Category}]
            }).then(article => {
                Category.findAll().then(categories => {
                    res.render("admin/articles/edit.ejs", {article: article, categories: categories});
                })
            })
            
        } else {
            res.redirect("/admin/articles");
        }
    } else {
        res.redirect("/admin/articles");
    }

});

router.post("/admin/article/update", adminAuth, (req, res) => {

    const title = req.body.title;
    const body = req.body.body;
    const categoryId = req.body.category; 
    const id = req.body.id;

    Article.update({title: title, slug: slugify(title), body: body, categoryId: categoryId}, {
        where: {
            id: id
        }
    }).then(() => res.redirect("/admin/articles"));

});

router.get("/articles/page/:num", (req, res) => {

    let page = parseInt(req.params.num);
    let offset = 0;

    if (isNaN(page) || page == 1) {
        offset = 0;
    } else {
        offset = (page-1)*4; 
    }
    
    Article.findAndCountAll({
        limit: 4,
        offset: offset,
        order: [
            ["id", "DESC"]
        ]
    }).then(articles => {
        if ((offset+4) > articles.count) {
            next = false;
        } else {
            next = true;
        }

        const result = {
            page: page,
            next: next,
            articles: articles
        }

        Category.findAll().then(categories => {
            res.render("admin/articles/page", {result: result, categories: categories});
        });

      
    
    });

});

module.exports = router;
