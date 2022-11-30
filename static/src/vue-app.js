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
                    savedLocations: [],
                    hottestLocations: [],
                    coldestLocations: [],
                    inHCLDate: null,
                    inHCLCount: 5,
                    userLocation: '',
                    nearbyStations: [],
                    stationInfo: [], 
                    stationIndex: 0,
                    isSavedStation: false,
                    error: false
                }
            },
            methods: {
                renderMarkers(coords, markers) {
                    map = new google.maps.Map(document.getElementById("map"), {
                        zoom: 6,
                        center: coords,
                    });
                    markers.forEach(marker => {
                        const mapMarker = new google.maps.Marker({
                            position: {lat: parseInt(marker[1]), lng: parseInt(marker[2])},
                            map: map,
                            locationId: marker[0]
                        });
                        mapMarker.addListener("click", () => {
                            Controller.getStationInfo(mapMarker.locationId)
                            .then(data => {
                                this.stationInfo = data;
                                this.outputPanelState = 1;
                                this.isSavedStation = this.savedLocations.includes(mapMarker.locationId);
                                this.error = false;
                            })
                            .catch(_ => {
                                this.outputPanelState = 1;
                                this.error = true;
                            })
                        });
                    })
                },
                goToStation(lat, lng) {
                    map.setCenter({ lat: parseInt(lat), lng: parseInt(lng) });
                },
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
                                let userCoords = {}
                                if (data[0].length != 0) {
                                    userCoords = { lat: parseInt([data[0][0][3]]), lng: parseInt([data[0][0][4]])}
                                } else if (data[1].length != 0) {
                                    userCoords = { lat: parseInt([data[1][0][3]]), lng: parseInt([data[1][0][4]])}
                                }
                                if (Object.keys(userCoords).length !== 0) {
                                    const markers = data[0].map(loc => [loc[1], loc[3], loc[4]])
                                        .concat(data[1].map(loc => [loc[1], loc[3], loc[4]]))
                                    this.renderMarkers(userCoords, markers)
                                }
                                this.error = false;
                            })
                            .catch(_ => {
                                this.error = true;
                            })
                        }
                    }
                },
                async getNearbyStationsQuery() {
                    Controller.getUserCoords(this.userLocation)
                    .then(async (data) => {
                        const userCoords = data.results[0].geometry.location;
                        this.nearbyStations = await Controller.getNearbyStationsQuery(userCoords.lat, userCoords.lng)
                        this.outputPanelState = 0;
                        this.renderMarkers(userCoords, this.nearbyStations)
                    })
                    .catch(_ => {
                        alert("Please enter a valid location")
                    });
                },
                loadSavedLocations() {
                    Controller.getSavedLocations()
                    .then(data => {
                        this.savedLocations = data;
                    })
                    .catch(_ => {
                        this.savedLocations = [];
                    });
                },
                saveLocation() {

                },
                deleteSavedLocation() {
                    
                }
            },
            created() {
                loadSavedLocations();
            }
        });
        this.#app.mount(`#${this.#APP_ID}`);
    }
}

export { VueApp }