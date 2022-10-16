import * as Vue from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';

class VueApp {
    static #app = null;
    static #APP_ID = 'vue-app';

    static start() {
        this.#app = Vue.createApp({
            data() {
                return {
                    state: 'demo'
                }
            }
        });
        this.#app.mount(`#${this.#APP_ID}`);
    }
}

export { VueApp }