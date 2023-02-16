const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const dotenv = require("dotenv").config()

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors())
console.log(process.env.USERNAME_MONGODB)

/*==============================================
            Port Details and Database url
================================================*/
const PORT = process.env.PORT || 8080
const URL = process.env.MONGODB_URL
console.log( process.env.MONGODB_URL)

mongoose.connect(URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("Connection Successfull")
}).catch((err) => {
    console.log(err)
})

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        index: true,
        unique: true,
        trim: true,
    },
    mobile: String,
    password: String,
    repassword: String,
    data: {
        companyName: String,
        vesselName: String,
        hullNubmer: String,
        manufacture: String,
        vesselType: String,
        totalRunningHours: Number,
        runninghrssincelast: Number,
        cyloiltype: String,
        cyloilconsump: String,
        normalserviceloadpercentMCR: Number,
        lubrication_regulation: String,
    }
})
const userModel = new mongoose.model("User", userSchema)

/*===============================================
            Route get and post method
================================================*/
app.get("/", (req, res) => {
    res.send("server is running")
    console.log(req.body)
})

app.post("/signup", (req, res) => {
    console.log(req.body)
    userModel.findOne({ email: req.body.email }, async (err, user) => {
        if (user) {
            if (req.body.password === user.password) {
                res.send({ message: "This User is already registered" })
            }
            else {
                res.send({ message: "Check your Password" })
            }
        }
        else {
            const user = new userModel({
                email: req.body.email,
                mobile: req.body.mobile,
                password: req.body.password,
                repassword: req.body.repassword,
                data: {
                    datacompanyName: req.body.companyName,
                    vesselName: req.body.vesselName,
                    hullNubmer: req.body.hullNubmer,
                    manufacture: req.body.manufacture,
                    vesselType: req.body.vesselType,
                    totalRunningHours: req.body.totalRunningHours,
                    runninghrssincelast: req.body.runninghrssincelast,
                    cyloiltype: req.body.cyloiltype,
                    cyloilconsump: req.body.cyloilconsump,
                    normalserviceloadpercentMCR: req.body.normalserviceloadpercentMCR,
                    lubrication_regulation: req.body.lubrication_regulation,
                }
            })

            const registered = await user.save()
            res.send({ message: "Registation Successfull! Login again..." })
        }
    })
})


app.post("/signin", (req, res) => {
    try {
        console.log(req.body)
        const { email, password } = req.body
        userModel.findOne({ email: email }, (err, user) => {
            if (user) {
                console.log(password)
                console.log(user.password)
                if (password === user.password) {
                    res.send({ message: ` Login successfull`, user })
                }
                else {
                    res.send({ message: "Check your password" })
                }
            }
            else {
                res.send({ message: `This email id is not Registered` })
            }
        })
    }
    catch (err) {
        console.log(err)
    }
})

app.post("/updateData", (req, res) => {
    console.log(req.body)
})


/*===============================================
            listen the port
================================================*/
app.listen(PORT, () => {
    console.log("running")
})
