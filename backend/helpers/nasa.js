let Asteroid = require("../models/Asteroids")
let axios = require("axios")
let config = require("./config")

const fetch_data = () => {
    let range = get_date_range()
    let start_date = range.start_date
    let api_key = config.NASA_API_KEY
    let url = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${start_date}&api_key=${api_key}`
    console.log("Querying... ", url)
    if (start_date) {
        axios.get(url).then(response => {
            console.log(response)
            let data = response.data.near_earth_objects
            for (var i = 0; i < Object.keys(data).length; i++) {
                let single_day = Object.keys(data)[i]
                let asteroids = data[single_day]
                let formatted = asteroids.map(el => {
                    return {
                        name: el.name,
                        magnitude: el.absolute_magnitude_h,
                        diameter: parseFloat(
                            el.estimated_diameter.kilometers.estimated_diameter_max
                        ),
                        radius:
                            parseFloat(
                                el.estimated_diameter.kilometers.estimated_diameter_max
                            ) / 2,
                        distance: parseFloat(
                            el.close_approach_data[0].miss_distance.astronomical
                        ),
                        velocity: parseFloat(
                            el.close_approach_data[0].relative_velocity.kilometers_per_second
                        ),
                    }
                })
                let date = new Date(single_day)
                update_dates(date, formatted)
            }
        }).catch(error => {
            console.log(error)
        })
    }
}

const update_dates = (date, data) => {
    Asteroid.findOne({ date: date }).then(asteroid => {
        if (asteroid) {
            Asteroid.findOneAndUpdate({ date: date }, { asteroids: data }).then(response => {
                console.log("ASTEROIDS DATA UPDATED")
            }).catch(error => {
                console.log(error)
            })
        } else {
            Asteroid.create({ date: date, asteroids: data }).then(response => {
                console.log("NEW DATE DATA ADDED")
            }).catch(error => {
                console.log(error)
            })
        }
    }).catch(error => {
        console.log(error)
    })
}

get_date_range = () => {
    let today = new Date()
    var first = today.getDate() - today.getDay();
    var firstday = new Date(today.setDate(first)).toISOString().substring(0, 10);
    return {
        start_date: firstday,
    }
}

module.exports = {
    fetch_data
}