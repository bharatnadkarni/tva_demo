const Asteroids = require("../models/Asteroids")
const {post_error, post_message} = require("../helpers/postman")

const get_data = async (req, res) =>{
    try {
        let todate = new Date()
        let today = todate.getDay()
        //our range is monday to sunday. so if day is 0, query the previous week
        let start_date
        let end_date
        if(today == 0){
            start_date = todate.getDate() - 6
            end_date = start_date + 6
        } else {
            start_date = todate.getDate() - todate.getDay() + 1
            end_date = start_date + 6
        }

        let first = new Date(todate.setDate(start_date)).toISOString().substring(0,10)
        let last = new Date(todate.setDate(end_date)).toISOString().substring(0,10)

        let asteroid_data = await Asteroids.find({date: {$gte: new Date(first), $lte: new Date(last)}}).sort({date: 1}).lean()
        post_message(res, {data: asteroid_data, today: today == 0 ? 6 : today + 1}, "Data fetched successfully")

    } catch (error) {
        console.log(error)
        post_error(res, 500, "Application error.")
    }
}

module.exports = {
    get_data
}