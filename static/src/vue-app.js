import * as Vue from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';
import { Controller } from './controller.js';

class VueApp {
    static #app = null;
    static #APP_ID = 'vue-app';

    static start() {
        this.#app = Vue.createApp({
            data() {
                return {
                    state: 'real',
                    panelState: 1, // Temporarily set to 1, until nearby stations feature is implemented
                    demoCurrentStateData: [],
                    demoQueryData: [],
                    hottestLocations: [],
                    coldestLocations: [],
                    inDemoQuery: '',
                    inHCLDate: null,
                    inHCLCount: 0,
                    userLocation: '',
                    displayInfo: false
                }
            },
            methods: {
                getDemoQuery(query) {
                    Controller.getDemoQuery(query)
                    .then((data) => {
                        this.demoQueryData = data;
                    });
                },
                getHotAndColdLocations(dt, count) {
                    Controller.getHotAndColdLocations(dt, count)
                    .then((data) => {
                        this.hottestLocations = data[0];
                        this.coldestLocations = data[1];
                        this.displayInfo = true;
                    });
                },
                getNearbyStationsQuery(lat, lng) {
                    const uluru = { lat: -25.344, lng: 131.031 };
                    const map = new google.maps.Map(document.getElementById("map"), {
                      zoom: 4,
                      center: uluru,
                    });
                    Controller.getNearbyStationsQuery(lat, lng)
                    .then((data) => {
                        for (let i = 0; i < data.length; i++) {
                            new google.maps.Marker({
                                position: data[i],
                                map: map,
                            });
                        }
                    });
                }
            },
            mounted() {
                Controller.getDemoData()
                .then((data) => {
                    this.demoCurrentStateData = data;
                });
            }
        });
        this.#app.mount(`#${this.#APP_ID}`);
    }
}

export { VueApp }