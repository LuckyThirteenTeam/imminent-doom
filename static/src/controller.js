class Controller {
    static async getHotAndColdLocations(dt, count) {
        const hottest = await fetch(`query?query=SELECT country, Weather.locationId, maxTemp, latitude, longitude FROM Weather JOIN Location ON Weather.locationId = Location.locationId WHERE date = '${dt}' AND maxTemp != 9999.9 ORDER BY maxTemp DESC LIMIT ${count};`)
        const coldest = await fetch(`query?query=SELECT country, Weather.locationId, minTemp, latitude, longitude FROM Weather JOIN Location ON Weather.locationId = Location.locationId WHERE date = '${dt}' AND minTemp != 9999.9 ORDER BY minTemp ASC LIMIT ${count};`)
        return [await hottest.json(), await coldest.json()]
    }

    static async getNearbyStationsQuery(lat, lng) {
        const nearby = await fetch(`query?query=SELECT locationId, latitude, longitude, haversine(latitude, ${lat}, longitude, ${lng}) AS distance FROM Location WHERE haversine(latitude, ${lat}, longitude, ${lng}) IS NOT NULL ORDER BY distance ASC LIMIT 10;`)
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

    static async getAnomalies(dt, count) {
        const anomalies = await fetch(`query?query=SELECT l.country, w.locationId, l.latitude, l.longitude, w.meanTemp, AvgTemps.avgTemp, ABS(w.meanTemp - AvgTemps.avgTemp) AS diffTemps FROM (SELECT sum(meanTemp)/count(*) as avgTemp, locationId FROM Weather WHERE date LIKE '%25${dt.substring(5)}' GROUP BY locationId) as AvgTemps JOIN Location as l ON AvgTemps.locationId = l.locationId JOIN Weather as w ON w.locationId = AvgTemps.locationId WHERE date = '${dt}' ORDER BY diffTemps DESC LIMIT ${count};`)
        return await anomalies.json()
    }

    static async login(username, password) {
        const login = await fetch(`login?username=${username}&password=${password}`, { method: 'POST' })
        return login
    }

    static async signup(username, password) {
        const signup = await fetch(`signup?username=${username}&password=${password}`, { method: 'POST' })
        return signup
    }

    static async getUsername() {
        const username = await fetch(`username`)
        return username
    }

    static async logout() {
        const logout = await fetch(`logout`, { method: 'POST' })
        return logout
    }
}

export { Controller }
