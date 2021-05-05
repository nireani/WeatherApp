const express = require('express')
const router = express()
const request = require('request')
const City = require('../../modules/City')


const key = "da8efec24a2ebd3b14713a35bb1f2c4f"

router.get(`/city`, function (req, res) {
   
    const lon = req.query.lon
    const lat = req.query.lat
    const cityName = req.query.cityName

    if(lon&&lat){
        request(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}&units=metric`, function (err, cityData) {
        res.send(JSON.parse(cityData.body))
    })
    }
    if(cityName){
        request(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${key}&units=metric`, function (err, cityData) {
            res.send(JSON.parse(cityData.body))
        })
    }
    
})


router.get(`/cities`, function (req, res) {
    City.find({}, function (err, cities) {
        res.send(cities)
    })
})

const addCity = function (cityName) {
    request(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${key}&units=metric`, function (err, cityData) {
        const parsedCityData = JSON.parse(cityData.body)
        const cityToDB = new City({
            name: parsedCityData.name.normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
            temp: parsedCityData.main.temp,
            condition: parsedCityData.weather[0].description,
            conditionPic: parsedCityData.weather[0].icon
        })
        cityToDB.save()
    })
}


router.post(`/city`, function (req, res) {
    const cityName = req.query.cityName
    let newCity = true
    City.find({}, function (err, cityData) {
        if (cityData.length > 0) {
            cityData.forEach(c => {
                if (c.name.toLowerCase() == cityName.toLocaleLowerCase()) {
                    newCity = false
                }})
                if (newCity) {
                    addCity(cityName)
                }         
        }

        if(cityData.length == 0) {
            addCity(cityName)
        }
    })
    res.end()
})






const capitalize = function (str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

router.delete(`/city`, function (req, res) {
    const cityToDelete = req.query.cityName
    const CityToDeleteCapFirstLetter = cityToDelete.split(' ').map(capitalize).join(' ');
    City.findOneAndRemove({ name: CityToDeleteCapFirstLetter }, function (err, cities) {
        res.end()
    })
})


module.exports = router







