const router = require("express").Router()

router.get("/", async (req, res)=>{
    res.send("Welcome !")
})

module.exports = router