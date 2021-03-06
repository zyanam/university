"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ui_1 = require("./ui");
const lab2Func_1 = require("./lab2Func");
class UiLogic {
    constructor() {
        let canvas = document.querySelector(`#${ui_1.canvasId}`), context, logToolbar = $$(ui_1.logToolbarId), logToolbarForm = $$(ui_1.logToolbarFormId), extraUtils = new lab2Func_1.default(), resetState = () => {
            if (!this.firstData) {
                return;
            }
            let data = this.getContextData();
            this.updateContextData(data.data, this.firstData);
            this.putContextData(data);
            let info = this.getInfoFromContext(this.getContextData());
            this.drawChartData(ui_1.redChartId, info.red.map);
            this.drawChartData(ui_1.greenChartId, info.green.map);
            this.drawChartData(ui_1.blueChartId, info.blue.map);
        };
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
            this.loadFile(e.file).then(data => this.insertImageToCanvas(data)).catch(reason => {
                new webix.message(reason.message || reason.text || "Error was happened");
            });
        });
        $$(ui_1.buttonId).attachEvent("onItemClick", () => {
            let data = this.getInfoFromContext(this.getContextData());
            this.drawChartData(ui_1.redChartId, data.red.map);
            this.drawChartData(ui_1.greenChartId, data.green.map);
            this.drawChartData(ui_1.blueChartId, data.blue.map);
        });
        $$(ui_1.buttonResetId).attachEvent("onItemClick", () => {
            resetState();
        });
        $$(ui_1.buttonRobertsId).attachEvent("onItemClick", () => {
            let data = this.getContextData(), newData = this.runRobertsTransform(data.data);
            this.updateContextData(data.data, newData);
            this.putContextData(data);
            let info = this.getInfoFromContext(this.getContextData());
            this.drawChartData(ui_1.redChartId, info.red.map);
            this.drawChartData(ui_1.greenChartId, info.green.map);
            this.drawChartData(ui_1.blueChartId, info.blue.map);
        });
        $$(ui_1.buttonLab2Id).attachEvent("onItemClick", () => {
            if (!this.firstData) {
                webix.message({ type: "error", text: "There is no loaded picture" });
                return;
            }
            resetState();
            let data = this.getContextData(), newData = extraUtils.toGrayscale(data.data);
            this.updateContextData(data.data, newData);
            this.putContextData(data);
            let median = this.gaussFilter(newData);
            this.updateContextData(data.data, this.toFlatArray(median));
            this.putContextData(data);
            let blackWhite = extraUtils.toBlackAndWhite(median, 180);
            this.updateContextData(data.data, this.toFlatArray(blackWhite.data));
            this.putContextData(data);
            let erosion = this.erosion(blackWhite.data);
            this.updateContextData(data.data, this.toFlatArray(erosion));
            this.putContextData(data);
            let dilatation = this.dilatation(erosion);
            this.updateContextData(data.data, this.toFlatArray(dilatation));
            this.putContextData(data);
            let connectedData = extraUtils.connectedComponents(this.toBitMap(dilatation));
            this.updateContextData(data.data, this.toFlatArrayItems(connectedData));
            this.putContextData(data);
            let signs = extraUtils.getSigns(connectedData);
            let vectors = extraUtils.getVectors(signs);
            if (vectors.length < 2) {
                webix.message({ type: "error", text: "Cannot find any vector in the pucture" });
                return;
            }
            let colors = extraUtils.kMedoids(vectors, vectors.length, 2, 150);
            let vectorsObject = {};
            vectors.forEach(vector => {
                vectorsObject[vector.id] = vector;
            });
            let realData = this.flatArrayToMatrix(this.firstData.slice(0));
            for (let i = 0, rows = realData.length; i < rows; i++) {
                for (let j = 0, cols = realData[0].length; j < cols; j++) {
                    let key = connectedData[i][j];
                    if (key && vectorsObject[key] && vectorsObject[key].cluster !== -1) {
                        let color = colors[vectorsObject[key].cluster];
                        realData[i][j] = color;
                    }
                }
            }
            this.updateContextData(data.data, this.toFlatArray(realData));
            this.putContextData(data);
        });
        $$(ui_1.buttonLogParseId).attachEvent("onItemClick", () => {
            if (!logToolbar.isVisible()) {
                logToolbar.show();
                return;
            }
            let formData = logToolbarForm.getValues(), data = this.getContextData();
            this.logCorrection(data.data, parseFloat(formData.c));
            this.putContextData(data);
            let info = this.getInfoFromContext(this.getContextData());
            this.drawChartData(ui_1.redChartId, info.red.map);
            this.drawChartData(ui_1.greenChartId, info.green.map);
            this.drawChartData(ui_1.blueChartId, info.blue.map);
        });
    }
    toBitMap(data) {
        let res = [];
        for (let i = 0, len = data.length; i < len; i++) {
            let rowData = data[i], temp = [];
            for (let j = 0, subLen = rowData.length; j < subLen; j++) {
                let pixel = rowData[j];
                temp.push(pixel[0] ? 1 : 0);
            }
            res[i] = temp;
        }
        return res;
    }
    updateContextData(data, newData) {
        for (let i = 0, len = data.length; i < len; i += 4) {
            data[i] = newData[i];
            data[i + 1] = newData[i + 1];
            data[i + 2] = newData[i + 2];
            data[i + 3] = newData[i + 3];
        }
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
                this.canvas.width = image.width;
                this.canvas.height = image.height;
                this.context.drawImage(image, 0, 0, this.canvas.width, this.canvas.height);
                this.firstData = this.getContextData().data.slice(0);
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
    logCorrection(data, c) {
        let getValue = (value, cVal) => cVal * Math.log(1 + value);
        for (let i = 0, len = data.length; i < len; i += 4) {
            data[i] = getValue(data[i], c);
            data[i + 1] = getValue(data[i + 1], c);
            data[i + 2] = getValue(data[i + 2], c);
        }
        return data;
    }
    flatArrayToMatrix(data) {
        let itemsInRow = this.canvas.width * 4, rows = this.canvas.height, yIndex = 0, rowIndex = 0, result = [];
        while (rowIndex < rows) {
            let maxIndex = itemsInRow * rowIndex + itemsInRow, tempArr = [];
            while (yIndex < maxIndex) {
                tempArr.push([data[yIndex], data[yIndex + 1], data[yIndex + 2], data[yIndex + 3]]);
                yIndex += 4;
            }
            result[rowIndex] = tempArr;
            rowIndex++;
        }
        return result;
    }
    runRobertsTransform(data) {
        let arr = this.flatArrayToMatrix(data), result = [], calcNewValue = (xCurr, x1y1, xy1, x1y) => Math.sqrt(Math.pow(xy1 - x1y, 2) + Math.pow(xCurr - x1y1, 2)), culcLayers = (xy, xy1, x1y, x1y1) => {
            for (let i = 0; i < 3; i++) {
                result.push(calcNewValue(xy[i], x1y1[i], xy1[i], x1y[i]));
            }
            result.push(xy[3]);
        }, runCircle = (subArr, nextArr) => {
            for (let i = 0, subLen = subArr.length - 1; i < subLen; i++) {
                culcLayers(subArr[i], subArr[i + 1], nextArr[i], nextArr[i + 1]);
            }
            let lastIndex = subArr.length - 1;
            culcLayers(subArr[lastIndex], subArr[lastIndex], nextArr[lastIndex], nextArr[lastIndex]);
        };
        for (let i = 0, len = arr.length - 1; i < len; i++) {
            runCircle(arr[i], arr[i + 1]);
        }
        runCircle(arr[arr.length - 1], arr[arr.length - 1]);
        return result;
    }
    getContextData() {
        return this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
    }
    putContextData(data) {
        this.context.putImageData(data, 0, 0);
    }
    getInfoFromContext(imageData) {
        let channels = this.getChannels(imageData.data);
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
    toFlatArray(data) {
        let res = [];
        for (let i = 0, len = data.length; i < len; i++) {
            let row = data[i];
            for (let j = 0, subLen = row.length; j < subLen; j++) {
                let pixel = row[j];
                res.push(pixel[0]);
                res.push(pixel[1]);
                res.push(pixel[2]);
                res.push(pixel[3]);
            }
        }
        return res;
    }
    toFlatArrayItems(data) {
        let res = [];
        for (let i = 0, len = data.length; i < len; i++) {
            let row = data[i];
            for (let j = 0, subLen = row.length; j < subLen; j++) {
                let pixel = row[j];
                res.push(100);
                res.push(pixel);
                res.push(100);
                res.push(255);
            }
        }
        return res;
    }
    getPixelsAround(data, i, j, size) {
        let currentRow = data[i], prevJ = j - 1, nextJ = j + 1, nextRow = data[i + 1], prevRow = data[i - 1], current = currentRow[j], left = currentRow[prevJ], right = currentRow[nextJ], isNotUndefined = (value) => value !== undefined, isHasInTop = isNotUndefined(prevRow), isHasInBottom = isNotUndefined(nextRow), top = isHasInTop ? prevRow[j] : undefined, bottom = isHasInBottom ? nextRow[j] : undefined, getValue = (value, reserve) => value === undefined ? reserve : value;
        left = getValue(left, current);
        right = getValue(right, current);
        top = getValue(top, current);
        bottom = getValue(bottom, current);
        let topLeft = isHasInTop ? getValue(prevRow[prevJ], top) : left, topRight = isHasInTop ? getValue(prevRow[nextJ], top) : right, bottomLeft = isHasInBottom ? getValue(nextRow[prevJ], bottom) : left, bottomRight = isHasInBottom ? getValue(nextRow[nextJ], bottom) : right;
        if (size === "3") {
            return [
                [topLeft, top, topRight],
                [left, current, right],
                [bottomLeft, bottom, bottomRight]
            ];
        }
        else {
            let nextNextRow = isHasInBottom ? data[i + 2] || nextRow : currentRow, prevPrevRow = isHasInTop ? data[i - 2] || prevRow : currentRow, prevPrevJ = j - 2, nextNextJ = j + 2;
            prevRow = isHasInTop ? prevRow : currentRow;
            nextRow = isHasInBottom ? nextRow : currentRow;
            return [
                [getValue(prevPrevRow[prevPrevJ], topLeft), getValue(prevPrevRow[prevJ], topLeft), getValue(prevPrevRow[j], top), getValue(prevPrevRow[nextJ], topRight), getValue(prevPrevRow[nextNextJ], topRight)],
                [getValue(prevRow[prevPrevJ], topLeft), topLeft, top, topRight, getValue(prevRow[nextNextJ], topRight)],
                [getValue(currentRow[prevPrevJ], left), left, current, right, getValue(currentRow[nextNextJ], right)],
                [getValue(nextRow[prevPrevJ], bottomLeft), bottomLeft, bottom, bottomRight, getValue(nextRow[nextNextJ], bottomRight)],
                [getValue(nextNextRow[prevPrevJ], bottomLeft), getValue(nextNextRow[prevJ], bottomLeft), getValue(nextNextRow[j], bottom), getValue(nextNextRow[nextJ], bottomRight), getValue(nextNextRow[nextNextJ], bottomRight)]
            ];
        }
    }
    calcMedium(pixels) {
        let red = [], green = [], blue = [];
        for (let i = 0, len = pixels.length; i < len; i++) {
            let row = pixels[i];
            for (let j = 0, subLen = row.length; j < subLen; j++) {
                let pixel = row[j];
                red.push(pixel[0]);
                green.push(pixel[1]);
                blue.push(pixel[2]);
            }
        }
        red.sort();
        green.sort();
        blue.sort();
        let determinate = Math.round(red.length / 2) - 1;
        return [red[determinate], green[determinate], blue[determinate]];
    }
    getNewPixel(matrix, pixels, isCommutative) {
        let rows = pixels.length, cols = pixels[0].length;
        if (rows !== matrix.length || cols !== matrix[0].length) {
            throw new Error("An array and matrix should have equal sizes");
        }
        for (let i = 0, len = pixels.length; i < len; i++) {
            let row = pixels[i];
            for (let j = 0, subLen = row.length; j < subLen; j++) {
                let pixel = row[j], matrixValue = matrix[i][j];
                if (isCommutative) {
                    if (pixel[0] * matrixValue > 0 || pixel[1] * matrixValue > 0 || pixel[2] * matrixValue > 0) {
                        return [255, 255, 255, 255];
                    }
                }
                else {
                    if (pixel[0] * matrixValue === 0 || pixel[1] * matrixValue === 0 || pixel[2] * matrixValue === 0) {
                        return [0, 0, 0, 255];
                    }
                }
            }
        }
        return isCommutative ? [0, 0, 0, 255] : [255, 255, 255, 255];
    }
    erosion(arr) {
        let result = [], matrix = [
            [1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1]
        ];
        for (let i = 0, len = arr.length; i < len; i++) {
            let item = arr[i], rowItems = [];
            for (let j = 0, subLen = item.length; j < subLen; j++) {
                let pixel = item[j], newPixel = this.getNewPixel(matrix, this.getPixelsAround(arr, i, j, "5"), false);
                rowItems.push([newPixel[0], newPixel[1], newPixel[2], pixel[3]]);
            }
            result[i] = rowItems;
        }
        return result;
    }
    dilatation(arr) {
        let result = [], matrix = [
            [1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1]
        ];
        for (let i = 0, len = arr.length; i < len; i++) {
            let item = arr[i], rowItems = [];
            for (let j = 0, subLen = item.length; j < subLen; j++) {
                let pixel = item[j], newPixel = this.getNewPixel(matrix, this.getPixelsAround(arr, i, j, "5"), true);
                rowItems.push([newPixel[0], newPixel[1], newPixel[2], pixel[3]]);
            }
            result[i] = rowItems;
        }
        return result;
    }
    gaussFilter(data) {
        let arr = this.flatArrayToMatrix(data), result = [], matrix = [
            [0.000789, 0.006581, 0.013347, 0.006581, 0.000789],
            [0.006581, 0.054901, 0.111345, 0.054901, 0.006581],
            [0.013347, 0.111345, 0.225821, 0.111345, 0.013347],
            [0.006581, 0.054901, 0.111345, 0.054901, 0.006581],
            [0.000789, 0.006581, 0.013347, 0.006581, 0.000789]
        ];
        for (let i = 0, len = arr.length; i < len; i++) {
            let item = arr[i], rowItems = [];
            for (let j = 0, subLen = item.length; j < subLen; j++) {
                let pixel = item[j], newPixel = this.applyMatrix(this.getPixelsAround(arr, i, j, "5"), matrix);
                rowItems.push([newPixel[0], newPixel[1], newPixel[2], pixel[3]]);
            }
            result[i] = rowItems;
        }
        return result;
    }
    applyMatrix(pixels, matrix) {
        let rows = pixels.length, cols = pixels[0].length;
        if (rows !== matrix.length || cols !== matrix[0].length) {
            throw new Error("An array and matrix should have equal sizes");
        }
        let red = 0, green = 0, blue = 0;
        for (let i = 0, len = pixels.length; i < len; i++) {
            let row = pixels[i];
            for (let j = 0, subLen = row.length; j < subLen; j++) {
                let pixel = row[j], matrixValue = matrix[i][j];
                red += pixel[0] * matrixValue;
                green += pixel[1] * matrixValue;
                blue += pixel[2] * matrixValue;
            }
        }
        red = red > 255 ? 255 : red < 0 ? 0 : red;
        green = green > 255 ? 255 : green < 0 ? 0 : green;
        red = blue > 255 ? 255 : blue < 0 ? 0 : blue;
        return [Math.round(red), Math.round(green), Math.round(blue), 255];
    }
    medianFilter(data) {
        let arr = this.flatArrayToMatrix(data), result = [];
        for (let i = 0, len = arr.length; i < len; i++) {
            let item = arr[i], rowItems = [];
            for (let j = 0, subLen = item.length; j < subLen; j++) {
                let pixel = item[j], mediumValue = this.calcMedium(this.getPixelsAround(arr, i, j, "3"));
                rowItems.push([mediumValue[0], mediumValue[1], mediumValue[2], pixel[3]]);
            }
            result[i] = rowItems;
        }
        return result;
    }
}
exports.default = UiLogic;
