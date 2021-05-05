const RenderData = function () {
    $.get(`/cities`, function (cities) {
        console.log(cities);
        $(".cities").empty()
        const source = $("#cities-template").html()
        const template = Handlebars.compile(source)
        const newHTML = template({ cities: cities })
        $(".cities").append(newHTML)

    })
}
RenderData()


const displayCityFromAPI = function (cityName) {
    $.get(`/city?cityName=${cityName}`, function (cityToDisplay) {
        const filteredCityData = [{
            name: cityToDisplay.name.normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
            temp: cityToDisplay.main.temp,
            condition: cityToDisplay.weather[0].description,
            conditionPic: cityToDisplay.weather[0].icon
        }]
        $(".cities").empty()
        const source = $("#cities-template").html()
        const template = Handlebars.compile(source)
        const newHTML = template({ cities: filteredCityData })
        $(".cities").append(newHTML)

    })

}

const currentLocation = function(){
    navigator.geolocation.getCurrentPosition(showPosition);

}

function showPosition(position) {
     const lon = position.coords.longitude
     const lat = position.coords.latitude
     $.get(`city?lat=${lat}&lon=${lon}`,function(cityToDisplay){
        const filteredCityData = [{
            name: cityToDisplay.name,
            temp: cityToDisplay.main.temp,
            condition: cityToDisplay.weather[0].description,
            conditionPic: cityToDisplay.weather[0].icon
        }]
        $(".cities").empty()
        const source = $("#cities-template").html()
        const template = Handlebars.compile(source)
        const newHTML = template({ cities: filteredCityData })
        $(".cities").append(newHTML)

     })
}

$(document).on('click', '.fa-search', function () {
    const cityName = $(".cityName").val().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
   
    $.get("/cities", function (cities) {
        if (cities.length > 0) {
            cities.forEach(c => {
                if (cityName.toLocaleLowerCase() == c.name.toLocaleLowerCase()) {
                    $(".cities").empty()
                    const source = $("#cities-template").html()
                    const template = Handlebars.compile(source)
                    const newHTML = template({ cities: cities })
                    $(".cities").append(newHTML)
                } else {
                    displayCityFromAPI(cityName)
                }
            })
        } else {
            displayCityFromAPI(cityName)
        }
    })

})


$(document).on('click', '.fa-plus-circle',  function () {
    const cityName = $(this).closest(".cityBox").find(".name").text().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    console.log(cityName);
    $.post(`city?cityName=${cityName}`,   async function (err, result) {
        console.log(result);
    })
    setTimeout(function(){
        RenderData()}, 700);

});

$(document).on('click', '.fa-minus-circle', function () {
    const cityName = $(this).closest(".cityBox").find(".name").text().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    console.log(cityName);
    $.ajax({
        url: `city?cityName=${cityName}`,
        type: 'DELETE',
        success: function (result) {
            console.log(result);
        }
    });

RenderData()

})

