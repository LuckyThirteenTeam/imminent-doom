import { VueApp } from './src/vue-app.js';

function initMap() {
  const uwaterloo = { lat: 43.47013, lng: -80.535771 };
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 6,
    center: uwaterloo,
  });
}
window.initMap = initMap;

VueApp.start();