/*eslint no-console: */
/*eslint no-undef: */
/*eslint no-redeclare: */
/*eslint no-unused-vars: */
import axios from "axios";
import {
    TemperatureMap
} from "./temperatureMap.js";


export class CanvasClass {
    constructor(map) {
        this.map = map;
        this.xyArray = [];
        
        this.con_height = parseInt(map.container.getElement().style.height, 10);
        this.con_width = parseInt(map.container.getElement().style.width, 10);

        let coords = map.getBounds();
        this.bottomLeft = {
            lat: coords[0][0],
            lon: coords[0][1]
        }
        this.topRight = {
            lat: coords[1][0],
            lon: coords[1][1]
        }
    }

    resizeValuesForMinMax() {
        let newValues = []
        for (let value of this.xyArray) {
            newValues.push(value.value);
        }

        newValues.sort((a, b) => a - b);
        let maxValue = Math.max.apply(null, newValues);
        let minValue = Math.min.apply(null, newValues);
        let midValue = (maxValue + minValue) / 2;
        let koef = 50 / (maxValue - midValue);
        for (let i = 0; i < this.xyArray.length; i++) {
            this.xyArray[i].realValue = this.xyArray[i].value;
            this.xyArray[i].value = (this.xyArray[i].value - midValue) * koef;
        }
        this.ValuesSort = {
            maxValue: maxValue,
            minValue: minValue,
            midValue: midValue,
            koef: koef
        }

    }

    async showHeatMap() {
        this.getPointsTemperature(5);

       await this.getAllValuesForPointsTemperature(this.xyArray);
    }

    drawCanvas() {

        if (this.geoObjects) {
            this.map.geoObjects.remove(this.geoObjects);
        }
        // добавляем канвас в нужное место
        var element = document.createElement('canvas');
        element.id = "heatmap_canvas";
        element.width = this.con_width;
        element.height = this.con_height;
        element.style.position = "absolute";
        element.style.zIndex = "151";
        element.style.height = this.con_height + 'px';
        element.style.width = this.con_width + 'px';
        let first = document.getElementsByClassName("ymaps-2-1-74-ground-pane");
        first[0].appendChild(element)
        var canvas = document.getElementById('heatmap_canvas');




        var ctx0 = canvas.getContext("2d");
        var drw0 = new TemperatureMap(ctx0);
        drw0.setPoints(this.xyArray, this.con_width, this.con_height);
        drw0.drawLow(10, 30, true, function () {
            drw0.drawPoints();
        });

        let oGrayImg = canvas.toDataURL('image/png');

        let myGeoObject = new ymaps.GeoObject({
            geometry: {
                type: 'Rectangle',
                coordinates: [

                    [this.xyArray[this.xyArray.length - 1].coords[0], this.xyArray[this.xyArray.length - 1].coords[1]],
                    [this.xyArray[0].coords[0], this.xyArray[0].coords[1]]
                ]
            },
            // Свойства.
            properties: {}
        }, {
            draggable: false,
            fillImageHref: oGrayImg,
            fillMethod: 'stretch',
            stroke: false
        });

        this.map.geoObjects.add(myGeoObject);
        this.geoObjects = myGeoObject;

        element.style.display = 'none';


    }




    async getAllValuesForPointsTemperature(arr) {
        let tempCoords = {}
        for (let i = 0; i < arr.length; i++) {
            tempCoords.lat = arr[i].coords[0];
            tempCoords.lon = arr[i].coords[1];
            this.xyArray[i].value = await this.getTemperature(tempCoords);
        }
        this.resizeValuesForMinMax();
        this.drawCanvas();
    }


    getPointsTemperature(quality = 2) {
        if (quality < 2) quality = 2;
        let yQuality = quality;
        let xQuality = quality;

        let xyArray = [];
        let yAxis, tempPoindsCoords;
        let projection = this.map.options.get('projection');
        for (let i = 0; i < yQuality; i++) {
            yAxis = (i / (yQuality - 1) * this.con_width);
            let xAxis = 0;
            for (let j = 0; j < xQuality; j++) {
                xAxis = (j / (xQuality - 1) * this.con_height);
                tempPoindsCoords = projection.fromGlobalPixels(this.map.converter.pageToGlobal([yAxis, xAxis]), this.map.getZoom())
                xyArray.push({
                    x: yAxis,
                    y: xAxis,
                    value: '',
                    coords: tempPoindsCoords
                });
            }
        }
        this.xyArray = xyArray;

    }
    async getTemperature(coords) {
        try {
            const response = await axios({
                method: "post",
                url: "https://api.openweathermap.org/data/2.5/weather?lat=" +
                    coords.lat +
                    "&lon=" +
                    coords.lon +
                    "&APPID=4948cb20a2c1dc1ad64207c47452c740&units=metric",
                crossDomain: true
            });
            let temp = response.data.main.temp;
            /*             if (temp > -30 && temp < 70){
                            temp *= 2; 
                        }
                        if (temp < -30) return -30;
                        if (temp > 70) return 70; */
            return temp;
        } catch (error) {
            console.error(error);
        }
    }

}