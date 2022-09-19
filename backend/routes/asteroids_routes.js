const router = require("express").Router()

const {get_data} = require("../controllers/asteroids_controller")

router.get("/get_data", async (req, res)=>{
    await get_data(req, res)
})

module.exports = router