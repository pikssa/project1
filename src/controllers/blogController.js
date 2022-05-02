const blogModel = require("../models/blogModel")
const authorModel = require("../models/authorModel")

const moment = require('moment');

const valid = function (value) {
    if (typeof value !== "string" || value.trim().length == 0) { return false }  
    return true
}

const createBlog = async function (req, res) {
    try {
        let blogData = req.body

        if (!blogData.title) { return res.status(400).send({ status: false, message: "title is required" }) }

        if (!blogData.body) { return res.status(400).send({ status: false, message: "body is required" }) }

        if (!blogData.author_Id) { return res.status(400).send({ status: false, message: "authorid is required" }) }

        if (!blogData.category) { return res.status(400).send({ status: false, message: "category is required" }) }


        if (!valid(blogData.title)) { return res.status(400).send({ status: false, message: "title is not valid" }) }

        if (!valid(blogData.body)) { return res.status(400).send({ status: false, message: "body is not valid" }) }

        if (!valid(blogData.category)) { return res.status(400).send({ status: false, message: "category is not valid" }) }

        if ( blogData.subCategory) {
            for (let i = 0; i <  blogData.subCategory.length; i++) {
                if (!valid( blogData.subCategory[i])) { return res.status(400).send({ status: false, message: "subCategory is not valid" }) }} }

        if ( blogData.tags) {
            for (let i = 0; i < blogData.tags.length; i++) {
                if (!valid( blogData.tags[i])) { return res.status(400).send({ status: false, message: "tags is not valid" }) }}}

        if (blogData.isPublished) { if (typeof blogData.isPublished !== "boolean") { return res.status(400).send({ status: false, message: "value must be in boolean" }) } }
        
        let Id = blogData.author_Id

        let pattern = /^[0-9A-Fa-f]{24}$/

        if (!pattern.test(Id)) { return res.status(400).send({ status: false, message: "author_Id is not valid" }) }

        let blog = await authorModel.findOne({ _id: Id })

        if (blog == null) { { return res.status(400).send({ status: false, message: "author is not persent" }) } }

        req.body.publishedAt = req.body.isPublished ? moment().format('DD-MM-YYYY') : null
        let blogCreated = await blogModel.create(blogData)
        res.status(201).send({ status: true, data: blogCreated })
    } catch (err) { return res.status(500).send({ status: false, msg: err.message }) }



}





const Bloglist = async function (req, res) {

    try {
        let id = req.query.author_Id
        let category = req.query.category
        let tag = req.query.tags
        let sub = req.query.subCategory
        let list = await blogModel.find({ isDeleted: false, isPublished: true })
        if (!list.length) { res.status(404).send({ status: false, msg: "blogs not found" }) }
      
        let bloglist = await blogModel.find({ isDeleted: false, isPublished: true, $or: [{ author_Id: id }, { category: category }, { tags: tag }, { subCategory: sub }] })
        if (!bloglist.length) {
            res.status(404).send({ status: false, msg: "blogs not found" })
        }

        else { res.status(200).send({ status: true, data: bloglist }) }

    } catch (err) { return res.status(500).send({ status: false, msg: err.message }) }

}


const BlogById = async function (req, res) {

   try {
        let id = req.params.blogId
        let pattern = /^[0-9A-Fa-f]{24}$/

        if (!pattern.test(id)) { res.status(400).send({ status: false, message: "blogId is not valid" }) }

        let list1 = await blogModel.findOne({ _id: id, isDeleted: false })
        if (list1 == null) { return res.status(404).send({ status: false, msg: "blog not found" }) }

        let blogData = req.body
        

        if ( blogData.body) {
            if (!valid(blogData.body)) { return res.status(400).send({ status: false, message: "body is not valid" }) }
        }
        if ( blogData.title) {
            if (!valid(blogData.title)) { return res.status(400).send({ status: false, message: "title is not valid" }) }
        }
        if ( blogData.subCategory) {
            for (let i = 0; i <  blogData.subCategory.length; i++) {
                if (!valid( blogData.subCategory[i])) { return res.status(400).send({ status: false, message: "subCategory is not valid" }) }
             
            }

        }

        if ( blogData.tags) {
            for (let i = 0; i < blogData.tags.length; i++) {
                if (!valid( blogData.tags[i])) { return res.status(400).send({ status: false, message: "tags is not valid" }) }

               
            }
        }
        let list = await blogModel.findOneAndUpdate({ _id: id, isDeleted: false} ,  {$addToSet: {tags: {$each:blogData.tags},subcategory:{$each:blogData.subCategory}},title: blogData.title, body: blogData.body,publishedAt: new Date(),isPublished: true},{new: true})
        if (list == null) {
            res.status(404).send({ status: false, msg: "blog not found" })
        }
        else { res.status(200).send({ status: true, data: list }) }
    } catch (err) { return res.status(500).send({ status: false, msg: err.message }) }
}

const deleteBlogData = async function (req, res) {

    try {
        let blogId = req.params.blogId;
        let pattern = /^[0-9A-Fa-f]{24}$/

        if (!pattern.test(blogId)) { res.status(400).send({ status: false, message: "blogId is not valid" }) }
        let blog = await blogModel.findById(blogId)

        if (!blog) {
            return res.status(400).send({ msg: 'no such blog exists' });
        }

        let deleteUser = await blogModel.findOneAndUpdate({ _id: blogId }, { isDeleted: true }, { new: true })
        res.status(200).send({ status: true, data: "deleted succesfully" })
    } catch (err) { return res.status(500).send({ status: false, msg: err.message }) }

}

const deleteData = async function (req, res) {



    try {
        const data = req.query
        console.log(data)

        if (!data) return res.status(400).send({ error: "Enter Valid Input " })

        const dataforUpdation = { ...data, isDeleted:true, isDeletedAt:new Date() }

        const result = await blogModel.updateMany(data, dataforUpdation, { new: true })

        if (!result) res.status(404).send({ error: "No Data Found" })

        res.status(200).send({ data: result })
    }
    catch (err) {
        console.log(err)
        res.status(500).send({ msg: err.message })
    }
}
  




module.exports.createBlog = createBlog

module.exports.Bloglist = Bloglist

module.exports.BlogById = BlogById

module.exports.deleteData = deleteData


module.exports.deleteBlogData = deleteBlogData
