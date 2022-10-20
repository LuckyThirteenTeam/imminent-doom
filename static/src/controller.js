class Controller {
    static getDemoData() {
        return fetch('query?query=SELECT+*+FROM+t').then(response => response.json());
    }

    static getDemoQuery(query) {
        return fetch(`query?query=${query}`).then(response => response.json());
    }

    static getHotAndColdLocations(dt, count) {
        // Promise.all([fetch('http://imminent-doom.ml/query?query=SELECT * FROM Weather LIMIT 10'), fetch('http://imminent-doom.ml/query?query=SELECT * FROM Location LIMIT 10')])
        // .then((v) => {
        // })
        // TODO: Implement query
        return Promise.resolve(
            [
                [
                    ['Hell Station', 'Hell', 666], 
                    ['Me', 'CA', 80], 
                    ['Some Place', 'US', 73]
                ],
                [
                    ['Pingu House', 'CA', -30], 
                    ['My Fridge', 'CA', 5], 
                    ['Another Place', 'AU', 6]
                ]
            ]
        );
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
