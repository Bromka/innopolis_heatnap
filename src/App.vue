<template>
  <div>
    <yandex-map
      :coords="coords"
      class="full_height"
      @map-was-initialized="initHandler"
      :controls="[]"
      zoom="6"
    >
      <div class="map_legend" v-show="showLegend">
        <div class="single_item_wrap" v-for="(item, index) in legends" v-bind:key="index">
          <div class="map_legend_color_box" v-bind:class="item.class"></div>
          <span>{{ item.text}} {{ item.value }} ℃</span>
        </div>
      </div>
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
    legends: [
      {
        text: "Max",
        value: "",
        class: "map_legend_color_red"
      },
      {
        text: "",
        value: "",
        class: "map_legend_color_green"
      },
      {
        text: "Min",
        value: "",
        class: "map_legend_color_blue"
      }
    ],
    showLegend: false
  }),
  mounted: function() {},
  methods: {
    initHandler(map) {
      this.map = map;
      map.options.set("minZoom", 4);
      map.options.set("maxZoom", 11);
      map.options.set("restrictMapArea", [[80, -150], [-80, 180]]);

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
        this.fireevent();
      });

      map.controls.add(button, { left: 5, top: 5 });
      this.temp = new CanvasClass(map);

      this.legendInsert();
    },

    async fireevent() {
      await this.temp.showHeatMap();
      this.legends[0].value = this.temp.ValuesSort.maxValue.toFixed(2);
      this.legends[1].value = this.temp.ValuesSort.midValue.toFixed(2);
      this.legends[2].value = this.temp.ValuesSort.minValue.toFixed(2);
      this.showLegend = true;

    },

    legendInsert() {
      let legend = document.querySelector(".map_legend");
      let mapElement = document.getElementsByClassName(
        "ymaps-2-1-74-inner-panes"
      );
      mapElement[0].appendChild(legend);
      
    }
  }
};
</script>

<style>
.full_height {
  width: 100%;
  height: 600px;
}
.map_legend {
  z-index: 2600;
  background-color: #fff;
  border-radius: 3px;
  box-shadow: 0 1px 2px 1px rgba(0, 0, 0, 0.15);
  position: absolute;
  margin-left: 10px;
  margin-top: 50px;
}
.map_legend_color_box {
  height: 15px;
  width: 15px;

  display: inline-block;
  margin: 5px 10px;
}
.single_item_wrap {
  display: flex;
  align-items: center;
}
.single_item_wrap > span {
  margin-right: 10px;
  font-family: arial, helvetica;
  font-size: 13px;
}

.map_legend_color_blue {
  background-color: #63c3f1;
}
.map_legend_color_red {
  background-color: #fe7d6f;
}
.map_legend_color_green {
  background-color: #7ff97e;
}
.ymaps-2-1-74-graphics-SVG svg{
  margin-left: 7px !important;
  margin-top: 7px !important;
}
</style>
