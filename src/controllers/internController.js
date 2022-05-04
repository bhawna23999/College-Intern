const collegeModel = require("../model/collegeModel")
const internModel = require("../model/internModel")
const mongoose = require('mongoose')

const isValid = function(value){
    if(typeof value === 'undefined' || value === null) return false
    if(typeof value === 'string' &&  value.trim().length === 0) return false
    return true
}

const isValidRequestBody = function(requestBody){
    return Object.keys(requestBody).length > 0
}

const isValidObjectId = function(objectId){
    return mongoose.Types.ObjectId.isValid(objectId)
}

const interns = async function(req,res){
    try
    {
        const details = req.body
        if(!isValidRequestBody(details))
        return res.status(400).send({status:false, msg:"Please fill Intern details"})

        const {name, email, mobile, collegeId} = details 

        if(!isValid(name))
        res.status(400).send({staus:false, msg:"Name is Required"})

        if(!isValid(email))
        return res.status(400).send({status:false, msg:"Email ie Required"})
        // check for valid email
        if(!email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/))
        return res.status(400).send({status:false, msg:"Please enter valid Email"})
        // check for unique mail
        let mail = await internModel.findOne({email})
        if(mail)
        return res.status(400).send({status:false, msg:"This mail is already exist"})

        if(!isValid(mobile))
        return res.status(400).send({status:false, msg:"Please enter mobile no"})
        //check for valid mobile no
        if(!mobile.match(/^(\+\d{1,3}[- ]?)?\d{10}$/))
        return res.status(400).send({status:false, msg:"Please enter valid mobile number"})
        //check for unique mob no
        let mob = await internModel.findOne({mobile})
        if(mob)
        return res.status(400).send({status:false, msg:"This mobile number is already exist"})

        if(!isValid(collegeId))
        return res.status(400).send({status:false, msg :"CollegeId is Required"})
        if(!isValidObjectId(collegeId))
        return res.status(400).send({status:false, msg:"Please enter valid collegeId"})
        //check for valid collegeId
        let collegeData = details.collegeId
        let collegenum = await collegeModel.findById(collegeData)
        if(!collegenum)
        return res.status(400).send({status:false, msg:"college id is not exists"})

        const createdIntern = await internModel.create(details)
        res.status(201).send({status:true, data:createdIntern})
    }
    catch(err)
    {
        console.log(err.message)
        res.status(500).send({status:false,error:err.message})
    }   
}

module.exports = {interns}