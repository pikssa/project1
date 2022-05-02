// const authorModel = require("../models/authorModel")
const AuthorModel = require("../models/authorModel")
const jwt = require("jsonwebtoken")
const valid = function (value) {

    if (typeof value !== "string" || value.trim().length == 0) { return false }
    return true
}

const createAuthor = async function (req, res) {
    try {
        let author = req.body
        if (!author.title) { return res.status(400).send({ status: false, message: "title is required" }) }

        if (!author.firstName) { return res.status(400).send({ status: false, message: "author first name is required" }) }

        if (!author.lastName) { return res.status(400).send({ status: false, message: "author last name is required" }) }

        if (!author.email) { return res.status(400).send({ status: false, message: "email is required" }) }

        if (!author.password) { return res.status(400).send({ status: false, message: "password is required" }) }

        if (!valid(author.title)) { return res.status(400).send({ status: false, message: "title is invalid" }) }

        if (["Mr", "Mrs", "Miss"].indexOf(author.title)== -1) { return res.status(400).send({ status: false, message: "title should be Mr,Miss,Mrs" }) }

        if (!valid(author.firstName)) { return res.status(400).send({ status: false, message: "author first name is not valid" }) }

        if (!valid(author.lastName)) { return res.status(400).send({ status: false, message: "author last name must is not valid " }) }

        if (!valid(author.password)) { return res.status(400).send({ status: false, message: "password name is not valid" }) }


        let pattern = /^[A-Za-z0-9._]{3,}@[A-Za-z]{3,}[.]{1}[A-Za-z.]{2,6}$/

        if (!pattern.test(author.email)) { return res.status(400).send({ status: false, message: "email is not valid" }) }

        if (author.email) {let check=await AuthorModel.findOne(author.email)
        if(!check==null)
        { return res.status(400).send({ status: false, message: "email is already registered" })} }
        else {
            let authorCreated = await AuthorModel.create(author)
            res.status(201).send({ status:true,data: authorCreated })
        }
    } catch (err) { return res.status(500).send({ status: false, msg: err.message }) }
}


const authorLogIn = async function (req, res) {
    let data1 = req.body.email;
    let data2 = req.body.password;

    if (!data1) { return res.status(400).send({ status: false, message: "email is required" }) }

    if (!data2) { return res.status(400).send({ status: false, message: "password is required" }) }

    let checkData = await AuthorModel.findOne({ email: data1, password: data2 });
    
    if (!checkData) {
        res.status(404).send({ status: false, msg: 'Invalid Credential' });
    }
    else {
        let token = jwt.sign({ userId: checkData._id.toString() }, "functionUp");
        res.setHeader("x-api-key",token);
        res.setHeader("x-userId",checkData._id)
        res.status(200).send({status:true,data:"logged in successfully"})
        
    }
}

module.exports.authorLogIn = authorLogIn;

module.exports.createAuthor = createAuthor




