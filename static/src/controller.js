class Controller {
    static async getHotAndColdLocations(dt, count) {
        const hottest = await fetch(`query?query=SELECT country, Weather.locationId, maxTemp FROM Weather JOIN Location ON Weather.locationId = Location.locationId WHERE date = '${dt}' ORDER BY maxTemp DESC LIMIT ${count};`)
        const coldest = await fetch(`query?query=SELECT country, Weather.locationId, minTemp FROM Weather JOIN Location ON Weather.locationId = Location.locationId WHERE date = '${dt}' ORDER BY minTemp ASC LIMIT ${count};`)
        return [await hottest.json(), await coldest.json()]
    }

    static getNearbyStationsQuery(lat, lng) {
        // TODO: Implement query
        return Promise.resolve(
            [
                { lat: -25.344, lng: 131.031 }, // Data will also contain other station fields
                { lat: -23.344, lng: 132.031 },
                { lat: -21.344, lng: 130.031 },
                { lat: -20.344, lng: 128.031 },
                { lat: -25.944, lng: 131.931 },
            ]
        );
    }
}

export { Controller }
