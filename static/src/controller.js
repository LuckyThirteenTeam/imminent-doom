class Controller {
    static getDemoData() {
        return fetch('query?query=SELECT+*+FROM+t').then(response => response.json());
    }

    static getDemoQuery(query) {
        return fetch(`query?query=${query}`).then(response => response.json());
    }

    static getHotAndColdLocations(dt, count) {
        // TODO: Implement query
        return [
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
        ];
    }
}

export { Controller }
