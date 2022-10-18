import * as Vue from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';
import { Controller } from './controller.js';

class VueApp {
    static #app = null;
    static #APP_ID = 'vue-app';

    static start() {
        this.#app = Vue.createApp({
            data() {
                return {
                    state: 'demo',
                    demoCurrentStateData: [],
                    demoQueryData: [],
                    inDemoQuery: '',
                }
            },
            methods: {
                getDemoQuery(query) {
                    Controller.getDemoQuery(query)
                    .then((data) => {
                        this.demoQueryData = data;
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