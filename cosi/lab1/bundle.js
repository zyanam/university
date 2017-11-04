(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ui_1 = require("./ui");
class UiLogic {
    constructor() {
        let canvas = document.querySelector(`#${ui_1.canvasId}`), context;
        if (canvas === null) {
            throw new Error(`Cannot find canvas element with ID: ${ui_1.canvasId}`);
        }
        context = canvas.getContext("2d");
        if (context === null) {
            throw new Error("Cannot get context of canvas");
        }
        this.canvas = canvas;
        this.context = context;
        $$(ui_1.uploaderId).attachEvent("onAfterFileAdd", (e) => {
            this.loadFile(e.file).then(data => this.insertImageToCanvas(data)).then(() => {
                debugger;
            }).catch(reason => {
                new webix.message(reason.message || reason.text || "Error was happened");
            });
        });
        $$(ui_1.buttonId).attachEvent("onItemClick", () => {
            let data = this.getInfoFromContext();
            this.drawChartData(ui_1.redChartId, data.red.map);
            this.drawChartData(ui_1.greenChartId, data.green.map);
            this.drawChartData(ui_1.blueChartId, data.blue.map);
        });
    }
    drawChartData(chartId, data) {
        let chart = $$(chartId);
        chart.clearAll();
        chart.parse(this.getChartData(data), "json");
    }
    getChartData(data) {
        let result = [], keys = Object.keys(data);
        for (let i = 0, len = keys.length; i < len; i++) {
            let key = keys[i], item = data[key];
            result.push({
                pixel: parseInt(key),
                value: data[key]
            });
        }
        return result;
    }
    clearCanvas() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    insertImageToCanvas(urlData) {
        return new Promise((resolve, reject) => {
            let image = new Image();
            image.src = urlData;
            image.onload = () => {
                this.clearCanvas();
                this.context.drawImage(image, 0, 0, 1000, 500);
                resolve({});
            };
            image.onerror = e => {
                reject(e);
            };
        });
    }
    loadFile(file) {
        if (file instanceof File) {
            return new Promise((resolve, reject) => {
                if (FileReader) {
                    let loader = new FileReader();
                    loader.onload = () => {
                        resolve(loader.result);
                    };
                    loader.onerror = (e) => {
                        reject(e);
                    };
                    loader.readAsDataURL(file);
                }
                else {
                    reject(new Error("The browser doesn't support FileReader"));
                }
            });
        }
        return Promise.reject(new Error("File not found"));
    }
    getChannels(data) {
        let res = { red: [], green: [], blue: [] };
        for (let i = 0, len = data.length; i < len; i += 4) {
            res.red.push(data[i]);
            res.green.push(data[i + 1]);
            res.blue.push(data[i + 2]);
        }
        return res;
    }
    getInfoFromContext() {
        let imageData = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height), channels = this.getChannels(imageData.data);
        return {
            red: this.getPixelColorfull(channels.red),
            green: this.getPixelColorfull(channels.green),
            blue: this.getPixelColorfull(channels.blue)
        };
    }
    getPixelColorfull(colorsChannel) {
        let reduceFunc = (result, current) => {
            let value = result.map[current];
            if (value === undefined) {
                result.map[current] = 1;
            }
            else {
                result.map[current] = value + 1;
            }
            if (result.maxValue < current) {
                result.maxValue = current;
            }
            return result;
        };
        return colorsChannel.reduce(reduceFunc, {
            maxValue: 0,
            map: {}
        });
    }
}
exports.default = UiLogic;

},{"./ui":2}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let uploaderId = "imageUploader", canvasTemplate = (canvasID) => {
    return `<div style="text-align: center;">
            <canvas id="${canvasID}" width="1000" height="500"></canvas>
        </div>`;
}, canvasId = "canvasImage1", buttonId = "buttonId", redChartId = "redChart", greenChartId = "greenChart", blueChartId = "blueChart", ui = {
    id: "lab5",
    type: "space",
    rows: [
        {
            type: "toolbar",
            height: 50,
            cols: [
                { template: "Functions", type: "header", width: 100, borderless: true },
                {
                    view: "uploader",
                    value: "Load file",
                    id: uploaderId,
                    width: 100,
                    autosend: false,
                    multiple: false
                },
                {
                    view: "button",
                    width: 100,
                    id: buttonId,
                    value: "Click me"
                },
                {}
            ]
        },
        {
            rows: [
                {
                    view: "scrollview",
                    height: 1000,
                    scroll: "auto",
                    type: "space",
                    body: {
                        type: "space",
                        rows: [
                            {
                                template: canvasTemplate(canvasId)
                            },
                            { type: "header", template: "Charts", height: 50 },
                            {
                                type: "space",
                                height: 250,
                                align: "center",
                                cols: [
                                    {
                                        id: redChartId,
                                        view: "chart",
                                        type: "bar",
                                        preset: "stick",
                                        value: "#value#",
                                        color: "red",
                                        width: 300,
                                        xAxis: {
                                            template: function (value) {
                                                return value.pixel % 32 === 0 ? value.pixel : "";
                                            }
                                        }
                                    },
                                    {
                                        id: greenChartId,
                                        view: "chart",
                                        type: "bar",
                                        preset: "stick",
                                        value: "#value#",
                                        color: "green",
                                        width: 300,
                                        xAxis: {
                                            template: function (value) {
                                                return value.pixel % 32 === 0 ? value.pixel : "";
                                            }
                                        }
                                    },
                                    {
                                        id: blueChartId,
                                        view: "chart",
                                        type: "bar",
                                        preset: "stick",
                                        value: "#value#",
                                        color: "blue",
                                        width: 300,
                                        xAxis: {
                                            template: function (value) {
                                                return value.pixel % 32 === 0 ? value.pixel : "";
                                            }
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                }
            ]
        }
    ]
};
exports.uploaderId = uploaderId;
exports.canvasId = canvasId;
exports.buttonId = buttonId;
exports.redChartId = redChartId;
exports.greenChartId = greenChartId;
exports.blueChartId = blueChartId;
exports.ui = ui;

},{}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DataWorker {
    constructor(a, m, r0) {
        this.a = a;
        this.m = m;
        this.r0 = r0;
        this.rPrev = r0;
    }
    next() {
        this.rPrev = (this.a * this.rPrev) % this.m;
        return this.rPrev / this.m;
    }
    current() {
        return this.rPrev / this.m;
    }
    currentR() {
        return this.rPrev;
    }
    getM() {
        return this.m;
    }
}
exports.default = DataWorker;

},{}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ui_1 = require("./ui");
const dataWorker_1 = require("./dataWorker");
const modTest_1 = require("./modTest");
class ModLab {
    constructor() {
        $$(ui_1.buttonId).attachEvent("onItemClick", () => {
            let startData = this.validateForm(this.formData.getValues());
            if (!startData) {
                webix.message("Start data is not valid");
                return;
            }
            let worker = new dataWorker_1.default(startData["a"], startData["m"], startData["r0"]), data = this.utils.getData(worker, 200000), current = worker.current(), period = this.utils.findPeriod(data, current), chartData = this.utils.getChartData(period.data), mX = this.utils.getMx(period.data), dX = this.utils.getDx(period.data, mX);
            this.formOutputData.setValues({
                period: period.period || "Invalid",
                aPeriod: period.aPeriod || "Invalid",
                mX: mX || "Invalid",
                dX: dX || "Invalid",
                uniformity: this.utils.checkUniformity(period.data) || "Invalid"
            });
            this.chart.config.yAxis.start = this.utils.getMin(period.data);
            this.chart.config.yAxis.end = this.utils.getMax(period.data);
            this.chart.show();
            this.updateChart(chartData);
        });
        this.formData = $$(ui_1.formDataId);
        this.formOutputData = $$(ui_1.formOutputDataId);
        this.utils = new modTest_1.default();
        this.chart = $$(ui_1.chartId);
        this.chart.hide();
    }
    validateForm(data) {
        let a = parseInt(data["a"]) || 0, m = parseInt(data["m"]) || 0, r0 = parseInt(data["r0"]) || 0;
        if (!a || a === 0) {
            webix.message("Property A cannot be '0' or empty");
            return false;
        }
        if (!m || m === 0) {
            webix.message("Property M cannot be '0' or empty");
            return false;
        }
        if (!r0 || r0 === 0) {
            webix.message("Property R0 cannot be '0' or empty");
            return false;
        }
        return {
            a: a,
            m: m,
            r0: r0
        };
    }
    updateChart(data) {
        this.chart.clearAll();
        this.chart.parse(data, "json");
    }
}
exports.default = ModLab;

},{"./dataWorker":3,"./modTest":5,"./ui":6}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let mult = (a, b) => a * b, div = (a, b) => a / b, mod = (a, b) => a % b, makeStep = (index, prevResult, a, m) => {
    let multRes = mult(a, prevResult), rN = mod(multRes, m), xN = div(rN, m);
    return {
        index: index,
        prevR: prevResult,
        mult: multRes,
        rN: rN,
        xN: xN
    };
}, getData = (count, a, m, startR) => {
    let result = [], prevR = undefined;
    for (let i = 0; i < count; i++) {
        let dataItem = makeStep(i, prevR === undefined ? startR : prevR, a, m);
        prevR = dataItem.rN;
        result.push(dataItem);
    }
};
class ModLabUtils {
    getData(worker, count) {
        let result = [];
        for (let i = 0; i < count; i++) {
            result.push(worker.next());
        }
        return result;
    }
    findPeriod(data, currentX) {
        let i1 = -1, i2 = -1, i3 = 0, isFirstPointFound = false, period, aPeriod;
        for (let i = 0, len = data.length; i < len; i++) {
            if (data[i] === currentX) {
                if (!isFirstPointFound) {
                    isFirstPointFound = true;
                    i1 = i;
                    continue;
                }
                else {
                    i2 = i;
                    break;
                }
            }
        }
        period = i2 - i1;
        while (data[i3] !== data[i3 + period]) {
            i3++;
        }
        aPeriod = i3 + period;
        if (i1 === -1 || i2 === -1) {
            return {
                period: undefined,
                aPeriod: undefined,
                data: data
            };
        }
        else {
            return {
                period: period,
                aPeriod: aPeriod,
                data: data.slice(i1, i2)
            };
        }
    }
    getMx(data) {
        return data.reduce((result, current) => result + current, 0) / data.length;
    }
    getDx(data, mX) {
        let dX = 0;
        for (let i = 0, len = data.length; i < len; i++) {
            let value = data[i] - mX;
            dX += mult(value, value);
        }
        dX /= (data.length - 1);
        return dX;
    }
    checkUniformity(data) {
        let result = 0, len = data.length;
        for (let i = 0; i < len; i += 2) {
            if (i + 1 >= len) {
                break;
            }
            let curr = data[i], next = data[i + 1];
            if (curr * curr + next * next < 1.0) {
                result++;
            }
        }
        return 2 * result / len;
    }
    getMin(data) {
        let reduceFunc = (res, curr) => curr < res ? curr : res;
        return data.reduce(reduceFunc, Infinity);
    }
    getMax(data) {
        let reduceFunc = (res, curr) => curr > res ? curr : res;
        return data.reduce(reduceFunc, -Infinity);
    }
    getChartData(data) {
        let partsCount = 20, partLength = (this.getMax(data) - this.getMin(data)) / partsCount, frequency = [], dataLength = data.length, xValues = [this.getMin(data)], result = [];
        for (let i = 1; i <= partsCount; i++) {
            xValues[i] = xValues[i - 1] + partLength;
        }
        for (let i = 0; i < partsCount; i++) {
            frequency[i] = 0;
            for (let j = 0; j < dataLength; j++) {
                let dataItem = data[j];
                if (dataItem >= xValues[i] && dataItem < (xValues[i + 1])) {
                    frequency[i]++;
                }
            }
            frequency[i] /= dataLength;
        }
        for (let i = 0; i < partsCount; i++) {
            result.push({ x: xValues[i], y: frequency[i] });
        }
        return result;
    }
    getRandom() {
        return Math.random();
    }
    uniformDistribution(a, b, count) {
        let result = [];
        for (let i = 0; i < count; i++) {
            result.push(a + (b - a) * this.getRandom());
        }
        result;
    }
    gaussDistribution(m, sko, count, n) {
        let result = [], getSumOfRandom = (len) => {
            let temp = 0;
            for (let i = 0; i < len; i++) {
                temp += this.getRandom();
            }
            return temp;
        };
        for (let i = 0; i < count; i++) {
            result.push(m + sko * Math.sqrt(12.0 / n) * (getSumOfRandom(n) - n / 2));
        }
        return result;
    }
    exponentialDistribution(alpha, count) {
        let result = [];
        for (let i = 0; i < count; i++) {
            result.push(-Math.log(this.getRandom()) / alpha);
        }
        return result;
    }
    gammaDistribution(alpha, ny, count) {
        let result = [], getMultOfRandom = (len) => {
            let temp = 1;
            for (let i = 0; i < len; i++) {
                temp *= this.getRandom();
            }
            return temp;
        };
        for (let i = 0; i < count; i++) {
            result.push(-Math.log(getMultOfRandom(ny)) / alpha);
        }
        return result;
    }
    triangleDistribution(a, b, count) {
        let result = [];
        for (let i = 0; i < count; i++) {
            result.push(a + (b - a) * Math.max(this.getRandom(), this.getRandom()));
        }
    }
    simpsonDistribution(a, b, count) {
        let result = [], getValue = (a1, b1) => a1 / 2 + (b1 / 2 - a1 / 2) * this.getRandom();
        for (let i = 0; i < count; i++) {
            result.push(getValue(a, b) + getValue(a, b));
        }
        return result;
    }
}
exports.default = ModLabUtils;

},{}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let buttonId = "modButtonId1", chartId = "modChart1Id", formDataId = "formDataId", formOutputDataId = "formOutputDataId", ui = {
    id: "modId",
    css: "bg_panel_raised",
    type: "space",
    autoheight: true,
    rows: [
        {
            type: "toolbar",
            css: "bg_panel",
            cols: [
                { template: "MOD", type: "header", width: 100, borderless: true },
                {
                    view: "button",
                    css: "button_primary button_raised",
                    id: buttonId,
                    width: 100,
                    value: "Run"
                },
                {
                    view: "form",
                    id: formDataId,
                    gravity: 1.3,
                    cols: [
                        {
                            view: "text",
                            value: "",
                            name: "a",
                            label: "A:",
                            labelAlign: "left"
                        },
                        {
                            view: "text",
                            value: "",
                            name: "m",
                            label: "M:",
                            labelAlign: "left"
                        },
                        {
                            view: "text",
                            value: "",
                            name: "r0",
                            label: "R0:",
                            labelAlign: "left"
                        },
                        {}
                    ]
                },
                {}
            ]
        },
        {
            view: "form",
            id: formOutputDataId,
            disabled: true,
            cols: [
                {
                    view: "text",
                    value: "",
                    name: "period",
                    label: "Period:",
                    labelAlign: "left"
                },
                {
                    view: "text",
                    value: "",
                    name: "aPeriod",
                    label: "Aperiod:",
                    labelAlign: "left"
                },
                {
                    view: "text",
                    value: "",
                    name: "mX",
                    label: "Mx:",
                    labelAlign: "left"
                },
                {
                    view: "text",
                    value: "",
                    name: "dX",
                    label: "Dx:",
                    labelAlign: "left"
                },
                {
                    view: "text",
                    value: "",
                    name: "uniformity",
                    label: "Uniformity:",
                    labelAlign: "left"
                }
            ]
        },
        {
            view: "chart",
            css: "bg_panel",
            id: chartId,
            type: "bar",
            label: function (value) {
                return parseFloat(value.y).toFixed(4);
            },
            value: "#y#",
            barWidth: 35,
            radius: 0,
            gradient: "falling",
            xAxis: {
                template: function (data) {
                    return parseFloat(data.x).toFixed(4);
                }
            },
            yAxis: {
                template: function (data) {
                    return data;
                }
            }
        },
        {}
    ]
};
exports.buttonId = buttonId;
exports.chartId = chartId;
exports.formDataId = formDataId;
exports.formOutputDataId = formOutputDataId;
exports.UI = ui;

},{}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Complex {
    constructor(re, im = 0.0) {
        this.re = re;
        this.im = im;
    }
    mult(comp) {
        return new Complex(this.re * comp.re - this.im * comp.im, this.re * comp.im + this.im * comp.re);
    }
    divNumber(value) {
        return new Complex(this.re / value, this.im / value);
    }
    add(comp) {
        return new Complex(this.re + comp.re, this.im + comp.im);
    }
    sub(comp) {
        return new Complex(this.re - comp.re, this.im - comp.im);
    }
    get conjugate() {
        return new Complex(this.re, -1 * this.im);
    }
    get magnitude() {
        return Math.sqrt(this.re * this.re + this.im * this.im);
    }
    get phase() {
        return Math.atan2(this.im, this.re);
    }
}
exports.Complex = Complex;
let dft = (arr, n, reverse, iterations) => {
    let tmp = [];
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            let calc = (2.0 * Math.PI / n) * j * i, w = new Complex(Math.cos(calc), reverse ? -Math.sin(calc) : Math.sin(calc));
            if (!tmp[i]) {
                tmp[i] = new Complex(0.0);
            }
            tmp[i] = tmp[i].add(w.mult(arr[j]));
            //update counter
            iterations.count++;
        }
    }
    return tmp;
}, fft = (arr, n, direction, iterations) => {
    if (arr.length === 1) {
        return arr;
    }
    let arg = 2.0 * Math.PI / n, wn = new Complex(Math.cos(arg), direction * Math.sin(arg)), w = new Complex(1.0), len = arr.length, halfOfLen = len >> 1, first = [], second = [], result = [];
    for (let i = 0; i < halfOfLen; i++) {
        result[i] = arr[i].add(arr[i + halfOfLen]);
        result[i + halfOfLen] = arr[i].sub(arr[i + halfOfLen]).mult(w);
        w = w.mult(wn);
        // update counter
        iterations.count++;
    }
    for (let i = 0; i < halfOfLen; i++) {
        first[i] = result[i];
        second[i] = result[i + halfOfLen];
    }
    let firstFFT = fft(first, halfOfLen, direction, iterations), secondFFT = fft(second, halfOfLen, direction, iterations);
    for (let i = 0; i < halfOfLen; i++) {
        let j = i << 1;
        result[j] = firstFFT[i];
        result[j + 1] = secondFFT[i];
    }
    return result;
}, getSample = (length, rate, frequency, func) => {
    let res = [];
    for (let i = 0; i < length; i++) {
        res[i] = new Complex(func(i * 2 * Math.PI / length));
    }
    return res;
}, createSamples = (length, rate, frequency, func) => getSample(length, rate, frequency, func), dftFunc = (array, n, reverse) => {
    console.time("DFT time: ");
    let counter = { count: 0 }, arrRes = dft(array, n, reverse, counter);
    console.timeEnd("DFT time: ");
    return {
        count: counter.count,
        result: arrRes
    };
}, fftFunc = (array, n, reverse) => {
    console.time("FFT time: ");
    let counter = { count: 0 }, arrRes = fft(array, n, reverse ? -1 : 1, counter);
    console.timeEnd("FFT time: ");
    return {
        count: counter.count,
        result: arrRes
    };
}, correlation = (signal1, signal2) => {
    let len = signal1.length, result = [];
    for (let m = 0; m < len - 1; m++) {
        if (!result[m]) {
            result[m] = new Complex(0.0);
        }
        for (let h = 0; h < len; h++) {
            if (m + h < len) {
                result[m] = result[m].add(signal1[h].mult(signal2[m + h]));
            }
            else {
                result[m] = result[m].add(signal1[h].mult(signal2[m + h - len]));
            }
        }
        result[m] = result[m].divNumber(len / 2);
    }
    return result;
}, convolution = (signal1, signal2) => {
    let len = signal1.length, result = [];
    for (let m = 0; m < len; m++) {
        if (!result[m]) {
            result[m] = new Complex(0.0);
        }
        for (let h = 0; h < len; h++) {
            if (m - h >= 0) {
                result[m] = result[m].add(signal1[h].mult(signal2[m - h]));
            }
            else {
                result[m] = result[m].add(signal1[h].mult(signal2[m - h + len]));
            }
        }
        result[m] = result[m].divNumber(len);
    }
    return result;
}, convolutionFourier = (signal1, signal2) => {
    let len = signal1.length, firstImage = fft(signal1, len, 1, { count: 0 }), secondImage = fft(signal2, len, 1, { count: 0 }), result = [];
    for (let i = 0; i < len; i++) {
        result[i] = firstImage[i].mult(secondImage[i]);
    }
    return fft(result, len, -1, { count: 0 });
}, correlationFourier = (firstSignal, secondSignal) => {
    let len = firstSignal.length, firstImage = fft(firstSignal, len, 1, { count: 0 }), secondImage = fft(secondSignal, len, 1, { count: 0 }), result = [];
    for (let i = 0; i < len; i++) {
        result[i] = firstImage[i].conjugate.mult(secondImage[i]);
    }
    return fft(result, len, -1, { count: 0 });
}, fwht = (data, length) => {
    if (length === 1) {
        return data;
    }
    let half = length / 2, firstHalf = [], secondHalf = [], result = [], i, firstPart, secondPart;
    for (i = 0; i < half; i++) {
        firstHalf[i] = data[i] + data[i + half];
        secondHalf[i] = -1 * data[i + half] + data[i];
    }
    firstPart = fwht(firstHalf, half);
    secondPart = fwht(secondHalf, half);
    for (i = 0; i < half; i++) {
        result[i] = firstPart[i];
        result[i + half] = secondPart[i];
    }
    return result;
}, getPhaseAndAmplitude = (mas, len) => {
    let amplitude = [mas[0] * mas[0]], phase = [0], i = 1;
    for (; i < len / 2 - 1; i++) {
        amplitude[i] = mas[2 * i - 1] * mas[2 * i - 1] + mas[2 * i] * mas[2 * i];
        phase[i] = (amplitude[i] > 0.001) ? Math.atan2(mas[2 * i - 1], mas[2 * i]) : 0.0;
    }
    amplitude[len / 2 - 1] = mas[len - 1] * mas[len - 1];
    phase[len / 2 - 1] = 0;
    return { phase, amplitude };
};
exports.CreateSamples = createSamples;
exports.DFT = dftFunc;
exports.FFT = fftFunc;
exports.Correlation = correlation;
exports.Convolution = convolution;
exports.ConvolutionFourier = convolutionFourier;
exports.CorrelationFourier = correlationFourier;
exports.FWHT = fwht;
exports.GetPhaseAndAmplitude = getPhaseAndAmplitude;

},{}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("./test");
const ui_1 = require("./lab1/ui");
const logic_1 = require("./lab1/logic");
const ui_2 = require("./mod/ui");
const madLab_1 = require("./mod/madLab");
let getXData = (count) => {
    let i = 0, res = [];
    for (i; i < count; i++) {
        res.push(i);
    }
    return res;
}, getXDataComplex = (count) => {
    let i = 0, res = [];
    for (i; i < count; i++) {
        res.push(new test_1.Complex(0.0, 0.0));
    }
    return res;
}, getMagnitudeFromComplex = (data) => data.map(complex => complex.magnitude), getPhaseFromComplex = (data) => {
    return data.map(complex => complex.magnitude > 0.3 ? complex.phase : 0);
}, getRealFromComplex = (data) => data.map(complex => complex.re), getHalfData = (data) => {
    let newData = data.slice(0);
    newData.length = newData.length / 2;
    return newData;
}, bih = (noise, grade) => {
    let result = [], temp = [], acc = 0;
    for (let t = grade / 2; t < noise.length; t++) {
        temp[t] = noise[t];
    }
    for (let i = 0; i < grade / 2; i++) {
        acc += noise[i] + noise[noise.length - i - 1];
    }
    for (let i = 0; i < noise.length - grade; i++) {
        acc = acc + temp[i + grade / 2] - temp[i + grade];
        result[i] = acc / grade * (-1);
    }
    return result;
}, kih = (nF, x, grade, N) => {
    let blackman = [], result = [];
    // for (let i = 0; i < grade; i++) {
    //     if (i - grade / 2 !== 0) {
    //         blackman[i] = Math.sin(2 * Math.PI * nF * (i - grade / 2)) * (0.54 - 0.46 * Math.cos(2 * Math.PI * i / grade)) / (i - grade / 2);
    //     } else {
    //         blackman[i] = 2 * Math.PI * nF * (0.54 - 0.46 * Math.cos(2 * Math.PI * i / grade));
    //     }
    // }
    for (let i = 0; i < grade; i++) {
        if (i - grade / 2 !== 0) {
            blackman[i] = Math.sin(2 * Math.PI * nF * (i - grade / 2)) * (0.42 - 0.5 * Math.cos(2 * Math.PI * i / grade) + 0.08 * Math.cos(4 * Math.PI / grade)) / (i - grade / 2);
        }
        else {
            blackman[i] = 2 * Math.PI * nF * (0.42 - 0.5 * Math.cos(2 * Math.PI * i / grade) + 0.08 * Math.cos(4 * Math.PI / grade));
        }
    }
    let dSum = 0;
    for (let i = 0; i < grade; i++) {
        dSum += blackman[i];
    }
    for (let i = 0; i < grade; i++) {
        blackman[i] /= dSum * (-1);
    }
    for (let i = grade; i < N; i++) {
        result[i - grade] = 0;
        for (let t = 0; t < grade; t++) {
            result[i - grade] = result[i - grade] + x[i - t] * blackman[t];
        }
        result[i - grade] *= -1;
    }
    return result;
}, addNoise = (y) => {
    let temp = [], len = y.length, getRandomArbitrary = (min, max) => (Math.random() * (max - min) + min);
    for (let i = 0; i < len; i++) {
        temp[i] = y[i] + Math.sin(getRandomArbitrary(0, 360)) / 8;
    }
    return temp;
}, runLab4 = () => {
    let amount = 1024, grade = 64, nF = 0.015, createData = (length, getSignal) => {
        let step = 2 * Math.PI / length, curStep = 0.0, arr = [], i = 0;
        for (; curStep < 2 * Math.PI; curStep += step, i++) {
            arr[i] = getSignal(curStep);
        }
        arr[length - 1] = getSignal(2 * Math.PI);
        return arr;
    }, data = createData(amount, value => Math.cos(3.0 * value) + Math.sin(2.0 * value)), withNoise = addNoise(data), kihData = kih(nF, withNoise, grade, amount), bihData = bih(withNoise, grade), xData = getXData(amount);
    drawChart(xData, data, $$(lab4Data1));
    drawChart(xData, withNoise, $$(lab4Data2));
    drawChart(getXData(kihData.length), kihData, $$(lab4Data3));
    drawChart(getXData(bihData.length), bihData, $$(lab4Data4));
}, runLab = () => {
    let amount = 1024, data = test_1.CreateSamples(amount, 8000, 187.5, (value) => {
        return Math.sin(3.0 * value) + Math.cos(value);
    }), xData = getXData(amount), dftData = test_1.DFT(data, amount, false), dftDataReverse = test_1.DFT(dftData.result, amount, true), fftData = test_1.FFT(data, amount, false), fftReverse = test_1.FFT(fftData.result, amount, true);
    drawChart(xData, getRealFromComplex(data), $$(firstChartId));
    console.log(`DFT iterations: ${dftData.count}`);
    console.log(`FFT iterations: ${fftData.count}`);
    // DFT
    drawChart(getHalfData(xData), getHalfData(getPhaseFromComplex(dftData.result)), $$(dftPhaseId));
    drawChart(getHalfData(xData), getHalfData(getMagnitudeFromComplex(dftData.result)), $$(dftMagnitudeId));
    drawChart(xData, getRealFromComplex(dftDataReverse.result), $$(dftId));
    // FFT
    drawChart(getHalfData(xData), getHalfData(getPhaseFromComplex(fftData.result)), $$(fftPhaseId));
    drawChart(getHalfData(xData), getHalfData(getMagnitudeFromComplex(fftData.result)), $$(fftMagnitudeId));
    drawChart(xData, getRealFromComplex(fftReverse.result), $$(fftId));
}, runLab2 = () => {
    let amount = 512, xData = getXData(amount * 2), dataLab1 = test_1.CreateSamples(amount, 8000, 187.5, (value) => {
        return Math.cos(3.0 * value) /* + Math.cos(value)*/;
    }).concat(getXDataComplex(amount)), dataLab2 = test_1.CreateSamples(amount, 8000, 187.5, (value) => {
        return Math.cos(3.0 * value) + Math.sin(2.0 * value);
    }).concat(getXDataComplex(amount)), convolutionRezult = test_1.Convolution(dataLab1, dataLab2), correlationRezult = test_1.Correlation(dataLab1, dataLab2), correlationFourier = test_1.CorrelationFourier(dataLab1, dataLab2), convolutionFourier = test_1.ConvolutionFourier(dataLab1, dataLab2);
    drawChart(getHalfData(xData), getHalfData(getRealFromComplex(dataLab1)), $$(lab2Data1Id));
    drawChart(getHalfData(xData), getHalfData(getRealFromComplex(dataLab2)), $$(lab2Data2Id));
    drawChart(getHalfData(xData), getRealFromComplex(convolutionRezult), $$(lab2Conv1Id));
    drawChart(getHalfData(xData), getRealFromComplex(convolutionFourier), $$(lab2Conv2Id));
    drawChart(getHalfData(xData), getRealFromComplex(correlationRezult), $$(lab2Corr1Id));
    drawChart(getHalfData(xData), getRealFromComplex(correlationFourier), $$(lab2Corr2Id));
}, runLab3 = () => {
    const N = 8, size = 64, len = N * size;
    let createData = (length, getSignal) => {
        let step = 2 * Math.PI / length, curStep = 0.0, arr = [], i = 0;
        for (; curStep < 2 * Math.PI; curStep += step, i++) {
            arr[i] = getSignal(curStep);
        }
        arr[length - 1] = getSignal(2 * Math.PI);
        return arr;
    }, xData = getXData(len), data = createData(len, value => Math.cos(3.0 * value) + Math.sin(2.0 * value)), fwhtData = test_1.FWHT(data, len), i = 0;
    for (; i < len; i++) {
        fwhtData[i] /= len; // this for normalisation
    }
    let extraData = test_1.GetPhaseAndAmplitude(fwhtData, len);
    drawChart(xData, data, $$(lab3Data1Id));
    drawChart(getHalfData(xData), extraData.phase, $$(lab3Data2Id));
    drawChart(getHalfData(xData), extraData.amplitude, $$(lab3Data3Id));
    drawChart(xData, test_1.FWHT(fwhtData, len), $$(lab3Data4Id));
}, lab4Data1 = "lab4Data1", lab4Data2 = "lab4Data2", lab4Data3 = "lab4Data3", lab4Data4 = "lab4Data4", lab3Data1Id = "lab3Data1Id", lab3Data2Id = "lab3Data2Id", lab3Data3Id = "lab3Data3Id", lab3Data4Id = "lab3Data4Id", lab2Data1Id = "lab2Data1Id", lab2Data2Id = "lab2Data2Id", lab2Conv1Id = "lab2Conv1Id", lab2Conv2Id = "lab2Conv2Id", lab2Corr1Id = "lab2Corr1Id", lab2Corr2Id = "lab2Corr2Id", firstChartId = "firstChart", dftId = "dftREverse", dftPhaseId = "dftPhase", dftMagnitudeId = "dftMagnitude", fftId = "fftREverse", fftPhaseId = "fftPhase", fftMagnitudeId = "fftMagnitude", getData = (x, y) => {
    let len = x.length, res = [];
    for (let i = 0; i < len; i++) {
        res.push({
            x: x[i],
            y: y[i]
        });
    }
    return res;
}, drawChart = (x, y, chartContainer) => {
    let cartData = getData(x, y);
    chartContainer.clearAll();
    chartContainer.parse(cartData, "json");
}, getChartObject = (id) => {
    return {
        view: "chart",
        type: "line",
        height: 300,
        width: 800,
        id: id,
        value: "#y#",
        line: {
            color: "#8ecf03",
            width: 1,
            shadow: false
        },
        item: {
            radius: 0
        },
        xAxis: {
            template: function (inedx) {
                return $$(id).getIndexById(inedx.id) % 100 ? "" : inedx.x;
            },
            lines: function (index) {
                return this.getIndexById(index.id) % 100 ? false : true;
            }
        },
        yAxis: {
            template: function (index) {
                return index;
            },
            lines: function (index) {
                return this.getIndexById(index.id) % 100 ? false : true;
            }
        }
    };
};
window["lab"] = {
    run: () => {
        runLab();
    }
};
let cosiUi = {
    id: "cosiId",
    rows: [
        {
            view: "toolbar",
            cols: [
                { template: "Transform", type: "header", width: 100, borderless: true },
                { view: "button", id: "runId", value: "Run", width: 100, align: "left" },
                {
                    view: "segmented", id: "tabbar", value: "lab1", multiview: true, options: [
                        { value: "Lab 1", id: "lab1" },
                        { value: "Lab 2", id: "lab2" },
                        { value: "Lab 3", id: "lab3" },
                        { value: "Lab 4", id: "lab4" },
                        { value: "Lab 1 gen.2", id: "lab5" }
                    ]
                },
                {}
            ]
        },
        {
            view: "scrollview",
            scroll: "y",
            body: {
                id: "mymultiview",
                cells: [
                    {
                        id: "lab1",
                        rows: [
                            { type: "header", template: "Start state", height: 50 },
                            getChartObject(firstChartId),
                            { template: "FFT reverse", height: 30 },
                            getChartObject(fftId),
                            { template: "DFT reverse", height: 30 },
                            getChartObject(dftId),
                            { type: "header", template: "Phase", height: 50 },
                            { template: "FFT phase", height: 30 },
                            getChartObject(fftPhaseId),
                            { template: "DFT phase", height: 30 },
                            getChartObject(dftPhaseId),
                            { type: "header", template: "Magnitude", height: 50 },
                            { template: "DFT magnitude", height: 30 },
                            getChartObject(dftMagnitudeId),
                            { template: "FFT magnitude", height: 30 },
                            getChartObject(fftMagnitudeId)
                        ]
                    },
                    {
                        id: "lab2",
                        rows: [
                            { type: "header", template: "Functions", height: 50 },
                            { template: "y = cos(3x) + sin(2x)", height: 30 },
                            getChartObject(lab2Data1Id),
                            { template: "y =cos(5x)", height: 30 },
                            getChartObject(lab2Data2Id),
                            //  Convolution
                            { type: "header", template: "Convolution", height: 50 },
                            { template: "Using formula", height: 30 },
                            getChartObject(lab2Conv1Id),
                            { template: "Using FFT", height: 30 },
                            getChartObject(lab2Conv2Id),
                            //  Correlation
                            { type: "header", template: "Correlation", height: 50 },
                            { template: "Using formula", height: 30 },
                            getChartObject(lab2Corr1Id),
                            { template: "Using FFT", height: 30 },
                            getChartObject(lab2Corr2Id)
                        ]
                    },
                    {
                        id: "lab3",
                        rows: [
                            { type: "header", template: "Function", height: 50 },
                            { template: "y = cos(3x) + sin(2x)", height: 30 },
                            getChartObject(lab3Data1Id),
                            { template: "Revert function", height: 30 },
                            getChartObject(lab3Data4Id),
                            { type: "header", template: "Phase", height: 50 },
                            getChartObject(lab3Data2Id),
                            { type: "header", template: "Magnitude", height: 50 },
                            getChartObject(lab3Data3Id)
                        ]
                    },
                    {
                        id: "lab4",
                        rows: [
                            { type: "header", template: "Function", height: 50 },
                            { template: "y = cos(3x) + sin(2x)", height: 30 },
                            getChartObject(lab4Data1),
                            { template: "With noise", height: 30 },
                            getChartObject(lab4Data2),
                            { type: "header", template: "KIH filter", height: 50 },
                            getChartObject(lab4Data3),
                            { type: "header", template: "BIH filter", height: 50 },
                            getChartObject(lab4Data4)
                        ]
                    },
                    ui_1.ui
                ]
            }
        }
    ]
}, testUi = {
    type: "space",
    rows: [
        {
            view: "toolbar",
            cols: [
                {
                    view: "segmented", id: "subjectsId", value: "cosiId", multiview: true, options: [
                        { value: "COSI", id: "cosiId" },
                        { value: "MOD", id: "modId" }
                    ]
                }
            ]
        },
        {
            view: "scrollview",
            scroll: "y",
            body: {
                id: "subjectId",
                cells: [
                    cosiUi,
                    ui_2.UI
                ]
            }
        }
    ]
};
webix.ready(() => {
    webix.ui(testUi);
    let uiLogic, modLab;
    $$("tabbar").attachEvent("onAfterTabClick", (e) => {
        if (uiLogic === undefined) {
            uiLogic = new logic_1.default();
        }
    });
    $$("subjectsId").attachEvent("onAfterTabClick", (e) => {
        if (modLab === undefined) {
            modLab = new madLab_1.default();
        }
    });
    $$("runId").attachEvent("onItemClick", () => {
        switch ($$("tabbar").getValue()) {
            case "lab1":
                runLab();
                return;
            case "lab2":
                runLab2();
                return;
            case "lab3":
                runLab3();
                return;
            case "lab4":
                runLab4();
                return;
            default: break;
        }
    });
});

},{"./lab1/logic":1,"./lab1/ui":2,"./mod/madLab":4,"./mod/ui":6,"./test":7}]},{},[8]);
