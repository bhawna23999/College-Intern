const { get } = require("express/lib/response")
const collegeModel = require("../model/collegeModel")
const internModel = require("../model/internModel")

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

        //Ectract Params
        const {name, fullName, logoLink} = details

        //validation start
        if(!isValid(name))
        return res.status(400).send({status:false, msg:"College Name is Required"})
        //Check for unique name
        let uniqueName = await collegeModel.findOne({name})
        if(uniqueName)
        return res.status(400).send({status:false, msg:`${name} college name is already registered`})

        if(!isValid(fullName))
        return res.status(400).send({status:false, msg:"FullName is required"})

        if(!isValid(logoLink))
        return res.status(400).send({status:false, msg:"LogoLink is Required"})
        if(!(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%.\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%\+.~#?&//=]*)/.test(logoLink)))        
        return res.status(400).send({ status: false, msg: "logoLink is invalid" })       
        //Validation ends

        const collegeData = {name, fullName, logoLink}

        let createdCollege = await collegeModel.create(collegeData)
        res.status(201).send({status:true,message:"College created successfully",data:createdCollege})
    }
    catch(err){
        console.log(err.message)
        res.status(500).send({status:false, msg:err.message})
    }
}


const collegeDetails = async function(req,res){

    let queryData = req.query
    let collegeName = queryData.collegeName
    if(!isValidRequestBody(queryData))
    return res.status(400).send({status:false, msg:"Plese write college Name"})

    let getCollege = await collegeModel.findOne({name:collegeName})
    // console.log({...getCollege})
      
    if(!getCollege)
    return res.status(404).send({status:false, msg:"no college found"})
    
    if(getCollege.isDeleted)
    return res.status(400).send({status:false, message:"this College is deleted"})

    getCollege = getCollege.toObject()
    // console.log({...getCollege})
  
    let getIntern = await internModel.find({collegeId:getCollege, isDeleted:false})

    if(Array.isArray(getIntern) && getIntern.length === 0){
        getCollege.Interest = "There is no intern at this college"
    }
    else{ 
        getCollege.Interest = getIntern  
    }
   
    res.status(200).send({status:true, data:getCollege})
}

module.exports = {colleges,collegeDetails}