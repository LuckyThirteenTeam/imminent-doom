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
                    demoCurrentStateData: [],
                    demoQueryData: [],
                    hottestLocations: [],
                    coldestLocations: [],
                    inDemoQuery: '',
                    inHCLDate: null,
                    inHCLCount: 0,
                    showHCLocations: false
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
                        this.showHCLocations = true;
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