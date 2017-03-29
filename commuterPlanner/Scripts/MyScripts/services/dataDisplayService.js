app.factory('DataDisplayService', function () {
    return {
        getCities: function (stops, citieslist) {
            var cities = stops['busStops'];
            for (var i = 0; i < cities.length; i++) {
                citieslist.push(Object.keys(cities[i])[0]);
            }
            return cities;
        },

        getStops: function (cities, cityNo, selectedCity) {

            var stopList = new Array();
            var cityStops = cities[cityNo][selectedCity];

            for (var i = 0; i < cityStops.length; i++) {
                var busStop = cityStops[i]['tags']['name'];

                //avoids printing duplicates in bus stop list
                if (!stopList.includes(busStop)) {
                    stopList.push(busStop);
                }
            }
            return stopList;
        },

        getRefs: function (cities, cityNo, selectedCity, selectedName) {

            var stopRefs = new Array();
            var cityStops = cities[cityNo][selectedCity];

            for (var i = 0; i < cityStops.length; i++) {

                var stopName = cityStops[i]['tags']['name'];
                if (stopName == selectedName) {
                    stopRefs.push(cityStops[i]['tags']['ref']);
                }
            }
            console.log(stopRefs);
            return stopRefs;
        }
    }
});