const collegeModel = require("../model/collegeModel")

const isValidRequestBody = function(requestBody){
    return Object.keys(requestBody).length > 0
}

const isValid = function(value){
    if(typeof value ==='undefined' || value === null)
    return false
    if(typeof value === 'string' && value.trim().length === 0)
    return false
    return true
}

const colleges = async function(req,res){
    try
    {
        let details = req.body
        if(!isValidRequestBody(details))
        return res.status(400).send({status:false, msg:"Please fill college details"})

        const {name, fullName, logoLink} = details

        if(!isValid(name))
        return res.status(400).send({status:false, msg:"Name is Required"})
        //Check for unique name
        let uniqueName = await collegeModel.findOne({name})
        if(uniqueName)
        return res.status(400).send({status:false, msg:"This Name is already registered"})

        if(!isValid(fullName))
        return res.status(400).send({status:false, msg:"FullName is required"})

        if(!isValid(logoLink))
        return res.status(400).send({status:false, msg:"LogoLink is Required"})

        let createdCollege = await collegeModel.create(details)
        res.status(201).send({status:true,data:createdCollege})

    }
    catch(err){
        console.log(err.message)
        res.status(500).send({status:false, msg:err.message})
    }
}

const collegeDetails = async function(req,res){

    let filetrQuery = {isDeleted:false}
    let queryData = req.query.collegeName
    if(!queryData)
    return res.status(400).send({status:false, msg:"Plese write college Name"})

    let getResult = await collegeModel.find({name:queryData})

    if(Array.isArray(getResult) && getResult.length === 0)
    return res.status(404).send({status:false, msg:"no college found"})
  
    res.status(200).send({status:true, data: getResult})
}

module.exports = {colleges,collegeDetails}