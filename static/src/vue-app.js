import * as Vue from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';
import { Controller } from './controller.js';

class VueApp {
    static #app = null;
    static #APP_ID = 'vue-app';

    static start() {
        this.#app = Vue.createApp({
            data() {
                return {
                    panelState: 1, // Temporarily set to 1, until nearby stations feature is implemented
                    hottestLocations: [],
                    coldestLocations: [],
                    inHCLDate: null,
                    inHCLCount: 5,
                    userLocation: '',
                    displayInfo: false,
                }
            },
            methods: {
                async getHotAndColdLocations(dt, count) {
                    if (dt === null) {
                        alert("Please enter a valid date between 1900-01-01 and 2022-10-16")
                    } else if (count < 5 || count > 100) {
                        alert("Count must be less than 100 and greater than 5")
                    } else {
                        const [year, month, day] = dt.split("-").map(v => parseInt(v))
                        if (year > 2022 || year < 1900 || month > 12 || month === 0 || day > 31 || day === 0) {
                            alert("Please enter a valid date between 1900-01-01 and 2022-10-16")
                        } else {
                            Controller.getHotAndColdLocations(dt, count)
                            .then(data => {
                                this.hottestLocations = data[0];
                                this.coldestLocations = data[1];
                                this.displayInfo = true;
                            })
                        }
                    }
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
            }
        });
        this.#app.mount(`#${this.#APP_ID}`);
    }
}

export { VueApp }