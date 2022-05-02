const express = require('express');
const router = express.Router();

const authorController = require("../controllers/authorController")
const blogController = require("../controllers/blogController")
const Middleware=require("../middleware/auth")


router.post("/createAuthor", authorController.createAuthor)

router.post("/createBlog",Middleware.authentication,Middleware.authorization, blogController.createBlog)

router.put("/blogs/:blogId", Middleware.authentication,Middleware.authorization,blogController.BlogById)

router.get("/getBlogList",Middleware.authentication, blogController.Bloglist)

router.delete("/blogs", Middleware.authentication,Middleware.authorization,blogController.deleteData)

router.delete("/blog/:blogId",Middleware.authentication,Middleware.authorization,blogController.deleteBlogData)

router.post("/login", authorController.authorLogIn)

module.exports = router;

