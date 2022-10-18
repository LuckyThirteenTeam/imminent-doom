class Controller {
    static getDemoData() {
        return fetch('query?query=SELECT+*+FROM+t').then(response => response.json());
    }

    static getDemoQuery(query) {
        return fetch(`query?query=${query}`).then(response => response.json());
    }
}

export { Controller }
