class Controller {
    static async getHotAndColdLocations(dt, count) {
        const hottest = await fetch(`query?query=SELECT country, Weather.locationId, maxTemp FROM Weather JOIN Location ON Weather.locationId = Location.locationId WHERE date = '${dt}' ORDER BY maxTemp DESC LIMIT ${count};`)
        const coldest = await fetch(`query?query=SELECT country, Weather.locationId, minTemp FROM Weather JOIN Location ON Weather.locationId = Location.locationId WHERE date = '${dt}' ORDER BY minTemp ASC LIMIT ${count};`)
        return [await hottest.json(), await coldest.json()]
    }

    static async getNearbyStationsQuery(lat, lng) {
        const nearby = await fetch(`query?query=SELECT locationId, latitude, longitude FROM Location WHERE latitude >= (${lat} - 1000) AND latitude <= (${lat} %2b 1000) AND longitude >= (${lng} - 1000) AND longitude <= (${lng} %2b 1000);`)
        return await nearby.json();
    }

    static async getStationInfo(locationId) {
        const station = await fetch(`query?query=SELECT * FROM Weather NATURAL JOIN Location WHERE Location.locationId = ${locationId} ORDER BY date ASC;`)
        return await station.json();
    }

    static async getUserCoords(location) {
        const coords = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=AIzaSyBK8yskeJGABTnzoT6Q8AVcoGuzwQ9v6nQ`)
        return await coords.json();
    }

}

export { Controller }
