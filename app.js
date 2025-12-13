// setup
const port = process.env.PORT || 3000
const express = require('express')
const secret = "somesecret"
const router = express.Router()
const bodyParser = require("body-parser")
const jwt = require('jwt-simple')
const Song = require("./models/songs")
const User = require("./models/users")
const Student = require("./models/student")
const Instructor = require("./models/instructor")
const Course = require("./models/course")
var cors = require('cors')

const app = express() // assigns an express server
app.use(cors()) // needed for same device stuff

app.use(bodyParser.json())
app.use(express.json())

router.post("/user", async(req,res)=>{
    if(!req.body.username || !req.body.password){
        res.status(400).json({error: "Missing username or password"})
    }
    const newUser = await new User ({
        username: req.body.username,
        password: req.body.password,
        status: req.body.status
    })
    
    try{
        await newUser.save()
        res.sendStatus(201)
    }
    catch(err){
        res.sendStatus(400).send(err)
    }
})

router.post("/auth", async(req,res) => {
    if (!req.body.username || !req.body.password) {
        res.status(400).json({error: "Missing Username or Password"})
        return
    }
    
    let user = await User.findOne({username : req.body.username})

    if (!user){
        res.status(401).json({error: "Bad Username"})
    }
    else {
        if (user.password != req.body.password){
            res.status(401).json({error:"Bad Password"})
        }
        else{
            username2 = user.username
            const token = jwt.encode({username : user.username}, secret)
            const auth = 1

            res.json({
                username2,
                token:token,
                auth:auth
            })
        }
    }
})

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

// ALL OF THE OLD SONG ROUTING CODE FROM THE TUTORIAL. MIGHT BE USEFUL IF SOMETHING DOES NOT WORK.

// // grab songs
// router.get("/songs", async(req, res) => {
//     try {
//         const songs = await Song.find({})
//         res.send(songs)
//         console.log(songs)
//     }
//     catch (err){
//         console.log(err)
//     }
// })

// router.get("/songs/:id", async(req,res) =>{
//     try{
//         const song = await Song.findById(req.params.id)
//         res.json(song)
//     }
//     catch (err){
//         res.status(400).send(err)
//     }
// })

// router.post("/songs", async(req,res) => {
//     try{
//         const song = await new Song(req.body)
//         await song.save()
//         res.status(201).json(song)
//         console.log(song)
//     }

//     catch(err){
//         res.status(400).send(err)
//     }
// })

// router.delete("/songs/:id", async(req,res) => {
//     try{
//         const song = await Song.findById(req.params.id)
//         await Song.deleteOne({_id: song._id})
//         res.sendStatus(204)
//     }
//     catch(err){
//         res.status(400).send(err)
//     }
// })

// BE AWARE THAT IM NOT SURE IF THIS ONE EVER WORKED
// router.put("/songs/:id", async(req,res) => {
//     try{
//         const song = req.body
//         await Song.updateOne({_id: song._id},song)
//         res.sendStatus(204)
//     }
//     catch(err){
//         res.status(400).send(err)
//     }
// })

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
        const course = await new Course(req.body)
        await course.save()
        res.status(201).json(course)
        console.log(course)
    }

    catch(err){
        res.status(400).send(err)
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