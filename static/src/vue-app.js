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
     *    3 = Anomalies
     *    4 = Saved locations
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
                    anomalies: [],
                    date: null,
                    displayedDate: null,
                    count: 5,
                    userLocation: '',
                    nearbyStations: [],
                    stationInfo: [], 
                    stationIndex: 0,
                    isSavedStation: false,
                    error: false,
                    loggedIn: false,
                    signupPage: false,
                    username: '',
                    password: ''
                }
            },
            methods: {
                startLocationPanel() {
                    this.panelState = 0;
                    this.outputPanelState = -1;
                },
                startHotColdPanel() {
                    this.panelState = 1;
                    this.outputPanelState = -1;
                },
                startAnomaliesPanel() {
                    this.panelState = 2;
                    this.outputPanelState = -1;
                },
                startAccountPanel() {
                    this.panelState = 3;
                    if (this.loggedIn) {
                        this.getSavedLocations();
                        this.outputPanelState = 4;
                    } else {
                        this.outputPanelState = -1;
                    }
                },
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
                                this.isSavedStation = this.savedLocations.some((elem) => (elem[1] === mapMarker.locationId));
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
                        alert("Please enter a valid date between 1900-01-01 and 2022-10-17")
                    } else if (count < 5 || count > 100) {
                        alert("Count must be less than 100 and greater than 5")
                    } else {
                        this.displayedDate = dt
                        const [year, month, day] = dt.split("-").map(v => parseInt(v))
                        if (year > 2022 || year < 1900 || month > 12 || month === 0 || day > 31 || day === 0 || 
                            (year === 2022 && month === 10 && day > 17)) {
                            alert("Please enter a valid date between 1900-01-01 and 2022-10-17")
                        } else {
                            this.outputPanelState = 2;
                            Controller.getHotAndColdLocations(dt, count)
                            .then(data => {
                                this.hottestLocations = data[0];
                                this.coldestLocations = data[1];
                                let userCoords = {}
                                if (data[0].length !== 0) {
                                    userCoords = { lat: parseInt([data[0][0][3]]), lng: parseInt([data[0][0][4]])}
                                } else if (data[1].length !== 0) {
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
                // Load saved location data from database to JS, but don't do anything else.
                async loadSavedLocations() {
                    await Controller.getSavedLocations()
                    .then(data => {
                        this.savedLocations = data;
                    })
                    .catch(_ => {
                        this.savedLocations = [];
                    });
                },
                // Load saved location data and set up corresponding map markers.
                getSavedLocations() {
                    this.loadSavedLocations()
                    .then(_ => {
                        let userCoords = {}
                        if (this.savedLocations.length !== 0) {
                            userCoords = { lat: parseInt([this.savedLocations[0][2]]), lng: parseInt([this.savedLocations[0][3]])}
                        }
                        if (Object.keys(userCoords).length !== 0) {
                            const markers = this.savedLocations.map(loc => [loc[1], loc[2], loc[3]])
                            this.renderMarkers(userCoords, markers)
                        }
                        this.error = false;
                    })
                    .catch(_ => {
                        this.error = true;
                    })
                },
                saveLocation(locationId) {
                    Controller.saveLocation(locationId)
                    .then((data) => {
                        if (data.status === 200) {
                            this.loadSavedLocations();
                            this.isSavedStation = true;
                        } else if (data.status === 401) {
                            alert('You must be logged in to save a location.');
                        } else {
                            alert('Action unsuccessful - please try again.');
                        }
                    })
                    .catch(_ => {
                        alert('Action unsuccessful - please try again.');
                    });
                },
                deleteSavedLocation(locationId) {
                    Controller.deleteSavedLocation(locationId)
                    .then(async data => {
                        if (data.status === 200) {
                            this.loadSavedLocations();
                            this.isSavedStation = false;
                        } else {
                            alert('Action unsuccessful - please try again.');
                        }
                    })
                    .catch(_ => {
                        alert('Action unsuccessful - please try again.')
                    });
                },
                // Either save or unsave the specified location, depending on the save state.
                saveButtonClicked(locationId) {
                    if (this.isSavedStation) {
                        this.deleteSavedLocation(locationId);
                    } else {
                        this.saveLocation(locationId);
                    }
                },
                async getAnomalies(dt, count) {
                    if (dt === null) {
                        alert("Please enter a valid date between 1900-01-01 and 2022-10-17")
                    } else if (count < 5 || count > 100) {
                        alert("Count must be less than 100 and greater than 5")
                    } else {
                        this.displayedDate = dt
                        const [year, month, day] = dt.split("-").map(v => parseInt(v))
                        if (year > 2022 || year < 1900 || month > 12 || month === 0 || day > 31 || day === 0 || 
                            (year === 2022 && month === 10 && day > 17)) {
                            alert("Please enter a valid date between 1900-01-01 and 2022-10-17")
                        } else {
                            this.outputPanelState = 3;
                            Controller.getAnomalies(dt, count)
                            .then(data => {
                                this.anomalies = data;
                                let userCoords = {}
                                if (data.length !== 0) {
                                    userCoords = { lat: parseInt([data[0][2]]), lng: parseInt([data[0][3]])}
                                }
                                if (Object.keys(userCoords).length !== 0) {
                                    const markers = data.map(loc => [loc[1], loc[2], loc[3]])
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
                async login(username, password) {
                    Controller.login(username, password)
                    .then(async data => {
                        let res = await data.text()
                        if (res === "User Not Found") {
                            alert("Login unsuccessful - username does not exist.")
                        } else if (res === "Incorrect Password") {
                            alert("Login unsuccessful - incorrect password.")
                        } else if (data.status === 401) {
                            alert("Login unsuccessful - please try again.")
                        } else {
                            this.loggedIn = true;
                            this.getSavedLocations();
                            this.outputPanelState = 4;
                        }
                    })
                    .catch(_ => {
                        alert("Login unsuccessful - please try again.")
                    });
                },
                async signup(username, password) {
                    Controller.signup(username, password)
                    .then(async data => {
                        let res = await data.text()
                        if (res === "User Already Exists") {
                            alert("Sign up unsuccessful - username is already in use.")
                        } else if (data.status === 401) {
                            alert("Sign up unsuccessful - please try again.")
                        } else {
                            this.getSavedLocations();
                            this.loggedIn = true
                            this.outputPanelState = 4
                        }
                    })
                    .catch(_ => {
                        alert("Sign up unsuccessful - please try again.")
                    });
                },
                async logout() {
                    Controller.logout()
                    .then(_ => {
                        this.loggedIn = false
                        this.savedLocations = [];
                        this.panelState = 3
                        this.outputPanelState = -1
                    })
                    .catch(_ => {
                        alert("Logout unsuccessful - please try again.")
                    });
                }
            },
            created() {
                this.loadSavedLocations();
            },
            async mounted() {
                Controller.getUsername()
                    .then(async data => {
                        let user = await data.text()
                        if (user !== "") {
                            this.username = user
                            this.loggedIn = true
                        }
                    })
            }
        });
        this.#app.mount(`#${this.#APP_ID}`);
    }
}

export { VueApp }