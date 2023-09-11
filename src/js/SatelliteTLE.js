
import {twoline2satrec, propagate} from 'satellite.js';

class SatelliteTLE {

    constructor(tle, option) {
        this.tle = tle;
        let now = Cesium.JulianDate.fromDate(new Date());
        this.start = option.start || now;
        this.stop = option.stop || Cesium.JulianDate.addDays(now, 1, new Cesium.JulianDate());
        this.currentTime = option.currentTime || this.start.clone();
        this.multiplier = option.multiplier || 60;
        this.step = option.step || 100;
        this.billboardImage = option.billboard || "image/jidi.png";
    }

    analyTleFile() {
        let czmlStrArr = [];
        let linesArr = this.tle.split("\n");
        linesArr = linesArr.filter((line) => {
            return line.trim() != '';
        });
        for (let i = 0, len = linesArr.length; i < len; i += 3) {
            this.tleName = linesArr[i].trim();
            let tleLine1 = linesArr[i + 1].trim();
            let tleLine2 = linesArr[i + 2].trim();
            let satrec = twoline2satrec(tleLine1, tleLine2);

            //卫星每天绕地球公转的圈数
/*            let day_obrit = tleLine2.slice(52, 63);
            //卫星回归周期
            let minsPerTurn = (24 * 60) / day_obrit;*/

            // minsPerTurn: 卫星转一圈花费的分钟。satrec.no: 卫星每分钟运动经过的轨道弧度。
            let minsPerTurn = 2 * Math.PI / (satrec.no);

            let totalMins = parseInt(Cesium.JulianDate.secondsDifference(this.stop, this.start)) / 60;
            let remaindMinutes = totalMins % minsPerTurn;
            let numberFullTurn = Math.floor(totalMins / minsPerTurn);
            let intervalStart = this.start.clone();
            let intervalStop = Cesium.JulianDate.addMinutes(intervalStart, remaindMinutes, new Cesium.JulianDate());
            let intervalStr = intervalStart + "/" + intervalStop;

            let leadIntervalArray = [];
            let trailIntervalArray = [];
            for (let k = 0; k < numberFullTurn; k++) {
                let orbitalInterval = {
                    "interval": intervalStr,
                    "epoch": Cesium.JulianDate.toIso8601(intervalStart),
                    "number": [0, minsPerTurn * 60, minsPerTurn * 60, 0]
                };
                let trailInterval = {
                    "interval": intervalStr,
                    "epoch": Cesium.JulianDate.toIso8601(intervalStart),
                    "number": [0, 0, minsPerTurn * 60, minsPerTurn * 60]
                };
                leadIntervalArray.push(orbitalInterval);
                trailIntervalArray.push(trailInterval);
                intervalStart = intervalStop.clone();
                intervalStop = Cesium.JulianDate.addMinutes(intervalStart, minsPerTurn, new Cesium.JulianDate());
                intervalStr = intervalStart + "/" + intervalStop;
            }

            let res = [];
            let current = this.start.clone();
            for (let k = 0; Cesium.JulianDate.lessThanOrEquals(current, this.stop); k+=this.step) {
                current = Cesium.JulianDate.addSeconds(this.start, k, new Cesium.JulianDate());
                let positionAndVelocity = propagate(satrec, Cesium.JulianDate.toDate(current));
                let positionEci = positionAndVelocity.position;
                positionEci.x = positionEci.x * 1000;
                positionEci.y = positionEci.y * 1000;
                positionEci.z = positionEci.z * 1000;
                res.push(k, positionEci.x, positionEci.y, positionEci.z);
            }

            czmlStrArr.push(this.createCZML(this.tleName, leadIntervalArray, trailIntervalArray, res));
            console.log("第"+((i/3)+1)+"个卫星CZML文件生成成功！");
        }
        return czmlStrArr;
    }

    createCZML(sat_name, leadIntervalArray, trailIntervalArray, res) {
        let initialCZMLProps = [
            {
                "id": "document",
                "name": "CZML Point - Time Dynamic",
                "version": "1.0",
                "clock": {
                    "currentTime": Cesium.JulianDate.toIso8601(this.currentTime),
                    "interval": `${this.start}/${this.stop}`,
                    "multiplier": this.multiplier,
                    "range": "LOOP_STOP",
                    "step": "SYSTEM_CLOCK_DEPENDENT"
                }
            }, {
                "id": `${sat_name}`,
                "name": `${sat_name}`,
                "availability": `${this.start}/${this.stop}`,
                "description": "Insert the altitude here??",
                "label": {
                    "fillColor": {
                        "rgba": [
                            255, 0, 0, 255
                        ]
                    },
                    "font": "11pt Lucida Console",
                    "horizontalOrigin": "LEFT",
                    "outlineColor": {
                        "rgba": [
                            0, 0, 0, 255
                        ]
                    },
                    "outlineWidth": 2,
                    "pixelOffset": {
                        "cartesian2": [
                            12, 0
                        ]
                    },
                    "show": true,
                    "style": "FILL_AND_OUTLINE",
                    "text": `${sat_name}`,
                    "verticalOrigin": "CENTER"
                },
                "path": {
                    "show": [
                        {
                            "interval": `${this.start}/${this.stop}`,
                            "boolean": true
                        }
                    ],
                    "width": 1,
                    "material": {
                        "solidColor": {
                            "color": {
                                "rgba": [
                                    255, 0, 0, 255
                                ]
                            }
                        }
                    },
                    "resolution": 60,
                    "leadTime": leadIntervalArray,
                    "trailTime": trailIntervalArray
                },
                "billboard": {
                    "image": this.billboardImage
                },
                "position": {
                    "interpolationAlgorithm": "LAGRANGE",
                    "interpolationDegree": 2,
                    "referenceFrame": "INERTIAL",
                    "epoch": `${this.start}`,
                    "cartesian": res
                }
            }
        ];
        return initialCZMLProps;
    }
}

export default SatelliteTLE;