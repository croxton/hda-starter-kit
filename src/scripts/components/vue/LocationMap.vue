<template>
  <l-map
      :zoom="zoom"
      :minZoom="3"
      :maxZoom="18"
      :zoomAnimation="true"
      :center="[latitude,longitude]"
      style="height: 500px; width: 100%"
  >
    <l-tile-layer
        :url="url"
        :attribution="attribution"
    />
    <l-marker :lat-lng="[latitude,longitude]" />
  </l-map>
  <map-caption :caption="caption"></map-caption>
</template>

<script>
import "leaflet/dist/leaflet.css";
import {
  LMap,
  LTileLayer,
  LMarker,
  LIcon
} from "@vue-leaflet/vue-leaflet";

import MapCaption from './MapCaption.vue'

export default {
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LIcon,
    MapCaption
  },
  props: {
    latitude: String,
    longitude: String,
    caption: String
  },
  data() {
    return {
      zoom: 13,
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    };
  },
};
</script>

<style></style>