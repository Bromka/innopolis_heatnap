<template>
  <div>
    <yandex-map
      :coords="[55.674, 37.601]"
      class="full_height"
      @map-was-initialized="initHandler"
      :controls="[]"
      zoom="6"
    >
      <!--    <ymap-marker :coords="topleft" marker-id="123" /> -->
    </yandex-map>
  </div>
</template>


<script>
/*eslint no-console: */
/*eslint no-undef: */
/*eslint no-redeclare: */
/*eslint no-unused-vars: */
/* global wat */

import { CanvasClass } from "./heatmap.js";

export default {
  data: () => ({
    coords: [55.674, 37.601],
    map: {},
    temp: {},

  }),
  methods: {
    initHandler(map) {
      this.map = map;
      map.options.set("minZoom", 4);
      map.options.set("maxZoom", 11);
      map.options.set('restrictMapArea', [[80, -150], [-80, 180]])

      let buttoncontent = {
        data: {
          content: "Температурная карта"
        },
        options: {
          maxWidth: [0, 180, 180],
          selectOnClick: false
        }
      };
      let button = new ymaps.control.Button(buttoncontent);
      button.events.add("click", () => {
        this.fireevent(map);
      });

      map.controls.add(button, { left: 5, top: 5 });
      this.temp = new CanvasClass(map);
    },
    fireevent(map) {
      this.temp.showHeatMap();
    }
  }
};
</script>

<style>
.full_height {
  width: 100%;
  height: 600px;
}
</style>
