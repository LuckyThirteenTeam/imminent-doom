import * as Vue from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';
import { Controller } from './controller.js';

var map;

class VueApp {
    static #app = null;
    static #APP_ID = 'vue-app';

    /**
     * outputPanelState:
     *   -1 = No panel
     *    0 = Nearby stations
     *    1 = Station info
     *    2 = Hottest/coldest locations
     */

    static start() {
        this.#app = Vue.createApp({
            data() {
                return {
                    panelState: 0,
                    outputPanelState: -1,
                    hottestLocations: [],
                    coldestLocations: [],
                    inHCLDate: null,
                    inHCLCount: 5,
                    userLocation: '',
                    nearbyStations: [],
                    stationInfo: [],
                    stationIndex: 0,
                    error: false
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
                            this.outputPanelState = 2;
                            Controller.getHotAndColdLocations(dt, count)
                            .then(data => {
                                this.hottestLocations = data[0];
                                this.coldestLocations = data[1];
                                this.error = false;
                            })
                            .catch(_ => {
                                this.error = true;
                            })
                        }
                    }
                },
                async getNearbyStationsQuery(lat, lng) {
                    Controller.getUserCoords(this.userLocation)
                    .then((data) => {
                        const userCoords = data.results[0].geometry.location;
                        map = new google.maps.Map(document.getElementById("map"), {
                            zoom: 6,
                            center: userCoords,
                        });
                        
                        Controller.getNearbyStationsQuery(lat, lng)
                        .then((data) => {
                            this.outputPanelState = 0;
                            this.nearbyStations = data;

                            for (let i = 0; i < data.length; i++) {
                                const marker = new google.maps.Marker({
                                    position: {lat: parseInt([data[i][1]]), lng: parseInt([data[i][2]])},
                                    map: map,
                                    locationId: data[i][0]
                                });
                                marker.addListener("click", () => {
                                    Controller.getStationInfo(marker.locationId)
                                    .then(data => {
                                        this.stationInfo = data;
                                        this.outputPanelState = 1;
                                        this.error = false;
                                    })
                                    .catch(_ => {
                                        this.outputPanelState = 1;
                                        this.error = true;
                                    })
                                });
                            }
                        });
                    })
                    .catch(_ => {
                        alert("Please enter a valid location")
                    });
                },
                goToStation(lat, lng) {
                    map.setCenter({ lat: parseInt(lat), lng: parseInt(lng) });
                }
            }
        });
        this.#app.mount(`#${this.#APP_ID}`);
    }
}

export { VueApp }