class Controller {
    static getDemoData() {
        return fetch('http://127.0.0.1:5000/query?query=SELECT+*+FROM+t').then(response => response.json());
    }

    static getDemoQuery(query) {
        return fetch(`http://127.0.0.1:5000/query?query=${query}`).then(response => response.json());
    }
}

export { Controller }