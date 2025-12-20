// setup
const port = process.env.PORT || 3000
const express = require('express')
const secret = "somesecret"
const router = express.Router()
const bodyParser = require("body-parser")
const jwt = require('jwt-simple')
const Song = require("./models/songs")
const User = require("./models/users")
const Student = require("./models/students")
const Instructor = require("./models/instructors")
const Course = require("./models/courses")
var cors = require('cors')

const app = express() // assigns an express server
app.use(cors()) // needed for same device stuff

app.use(bodyParser.json())
app.use(express.json())

const specialInstructorCode = 202520252025

router.post("/new_student", async(req,res)=>{
    if(!req.body.username || !req.body.password){
        res.status(400).json({error: "Missing username or password"})
    }
    const newStudent = await new Student ({
        username: req.body.username,
        password: req.body.password,
        status: req.body.status
    })
    
    // The following checks for an existing username in the db.
    let collisionTest = await Student.findOne({username : req.body.username})
    if (!collisionTest){
        try{
            await newStudent.save()
            res.sendStatus(201)
        }
        catch(err){
            res.sendStatus(400).send(err)
        }
    }
    else {
        res.sendStatus(403)
    }
})

router.post("/new_instructor", async(req,res)=>{
    if(!req.body.username || !req.body.password){
        res.sendStatus(400).json({error: "Missing username or password"})
        return // tutorial didnt have these but these are logically correct
    }

    if(req.body.specialCode != specialInstructorCode) {
        res.sendStatus(400).json({error: "Missing valid special code"})
        return // tutorial didnt have these but these are logically correct
    }

    const newInstructor = await new Instructor ({
        username: req.body.username,
        password: req.body.password,
        status: req.body.status
    })

    // The following checks for an existing username in the db.
    let collisionTest = await Instructor.findOne({username : req.body.username})
    if (!collisionTest){
        try{
            await newInstructor.save()
            res.sendStatus(201)
        }
        catch(err){
            res.sendStatus(400).send(err)
        }
    }
    else {
        res.sendStatus(403)
    }
    
})

router.post("/auth", async(req,res) => {
    if (!req.body.username || !req.body.password) {
        res.status(400).json({error: "Missing Username or Password"})
        return
    }
    
    if (req.body.type == "student") { // WE NEED A FIELD ON FRONTEND TO TICK STUDENT OR INSTRUCTOR AND PASS THIS!
        let student = await Student.findOne({username : req.body.username})

        if (!student){
            res.status(401).json({error: "Bad Username"})
        }
        else {
            if (student.password != req.body.password){
                res.status(401).json({error:"Bad Password"})
            }
            else{
                username2 = student.username
                const token = jwt.encode({username : student.username}, secret)
                const auth = 1

                res.json({
                    username2,
                    token:token,
                    auth:auth,
                    type:"student"
                })
            }
        }
    }

    else if (req.body.type = "instructor") { // SAME AS PREVIOUS, FRONT END NEEDS TO PASS TYPE
        let instructor = await Instructor.findOne({username : req.body.username})

        if (!instructor){
            res.status(401).json({error: "Bad Username"})
        }
        else {
            if (instructor.password != req.body.password){
                res.status(401).json({error:"Bad Password"})
            }
            else{
                username2 = instructor.username
                const token = jwt.encode({username : instructor.username}, secret)
                const auth = 1

                res.json({
                    username2,
                    token:token,
                    auth:auth,
                    type:"instructor"
                })
            }
        }
    }

    
})

// THIS IS COMMENTED OUT BECAUSE I DONT KNOW IF WE NEED IT
//I believe this is related to authorization encryption - AAS

 router.get("/status", async(req,res) => {
    if (!req.headers["x-auth"]) {
         return res.status(401).json({error: "Missing X-Auth"})
    }

     const token = req.headers["x-auth"]
     try{
         const decoded = jwt.decode(token,secret)

         let users = User.find({}, "username status")
         res.json(users)
     }
     catch(ex){
        res.status(401).json({error: "invalid jwt"})
     }
 })

// grab courses
router.get("/courses", async(req, res) => {
    try {
        const courses = await Course.find({})
        res.send(courses)
        console.log(courses)
    }
    catch (err){
        console.log(err)
    }
})


router.get("/courses/:id", async(req,res) =>{
    try{
        const course = await Course.findById(req.params.id)
        res.json(course)
    }
    catch (err){
        res.status(400).send(err)
    }
})


router.post("/courses", async(req,res) => {
    try{
        console.log(req.body)
        const course = await new Course(req.body)
        await course.save()
        res.sendStatus(201).json(course)
        console.log(course)
    }

    catch(err){
        res.sendStatus(400).send(err)
    }
})

router.delete("/courses/:id", async(req,res) => {
    try{
        const course = await Course.findById(req.params.id)
        await Course.deleteOne({_id: course._id})
        res.sendStatus(204)
    }
    catch(err){
        res.status(400).send(err)
    }
})

// THIS ONE NEVER WORKED FOR ME ORIGINALLY SO UPDATING COURSES PROBABLY NEEDS TO BE FIXED.
router.put("/courses/:id", async(req,res) => {
    try{
        const course = req.body
        await Course.updateOne({_id: course._id},course)
        res.sendStatus(204)
    }
    catch(err){
        res.status(400).send(err)
    }
})

app.use('/api', router)

app.listen(port,function(){
    console.log("Running on port " + port)
})