"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Perceptron {
    constructor(inputDemension, outputDemension) {
        this.h = 0;
        this.inputDemension = 0;
        this.outputDemension = 0;
        this.trainingSet = [];
        this.layers = [];
        this.psi = (h) => h;
        this.dpsi = (h) => h;
        this.weights = [];
        this.inputDemension = inputDemension;
        this.outputDemension = outputDemension;
        this.layers.push(new Layer(inputDemension));
        this.h = 1;
    }
    addHiddenLayer(dimension) {
        this.layers.push(new Layer(dimension));
        this.h++;
    }
    setPSI(psi, dpsi) {
        this.psi = (value) => psi(value);
        this.dpsi = (value) => dpsi(value);
    }
    init() {
        this.layers.push(new Layer(this.outputDemension));
        this.h++;
        this.resetWeights();
    }
    train(eta) {
        let trainingSetError = 0;
        for (let t = 0, len = this.trainingSet.length; t < len; t++) {
            let te = this.trainingSet[t], x = te.in, y = te.out, actual = this.classify(x);
            // calc global error
            let err = 0;
            for (let i = 0, subLen = actual.length; i < subLen; i++) {
                err += Math.pow(y[i] - actual[i], 2);
            }
            trainingSetError += err * err;
            // calc error for output layer
            for (let i = 0; i < this.layers[this.h - 1].dim; i++) {
                this.layers[this.h - 1].err[i] = y[i] - actual[i];
            }
            // backpropogate error
            for (let h = this.h - 2; h >= 0; h--) {
                this.calcLayerError(h);
            }
            // update weights
            for (let h = 1; h < this.h; h++) {
                this.updateWeights(h, eta);
            }
        }
        return Math.sqrt(trainingSetError);
    }
    calcLayerError(h) {
        let w = this.weights[h], inputDim = w.inputDim, weights = w.w, layer = this.layers[h], layerError = layer.err, layerInput = layer.in;
        for (let i = 0, len = layer.dim; i < len; i++) {
            let sum = 0, nextLayer = this.layers[h + 1], nextLayerErrors = nextLayer.err;
            for (let j = 0, jLen = nextLayer.dim; j < jLen; j++) {
                sum += weights[j * inputDim + i] * nextLayerErrors[j];
            }
            layerError[i] = this.dpsi(layerInput[i]) * sum;
        }
    }
    updateWeights(h, eta) {
        let w = this.weights[h - 1], inputDim = w.inputDim, weights = w.w, layerError = this.layers[h].err, prevLayerOutput = this.layers[h - 1].out;
        for (let i = 0, len = w.outputDim; i < len; i++) {
            for (let j = 0, jLen = inputDim; j < jLen; j++) {
                let dw = eta * (layerError[i] * prevLayerOutput[j]);
                weights[i * inputDim + j] += dw;
            }
        }
    }
    setTrainingSet(trainingSet) {
        this.trainingSet = trainingSet;
    }
    resetWeights() {
        this.weights = [];
        for (let h = 0; h < this.h - 1; h++) {
            let dim0 = this.layers[h].dim, dim1 = this.layers[h + 1].dim;
            this.weights.push(new WeightMatrix(dim0, dim1, 1.0));
        }
    }
    classify(x) {
        let h;
        if (x.length === this.inputDemension) {
            let layer = this.layers[0].out;
            for (let i = 0; i < this.inputDemension; i++) {
                layer[i] = x[i];
            }
            for (let i = 1; i < this.h; i++) {
                this.calcLayerInput(i);
                this.calcLayerOutput(i);
            }
            return this.layers[this.h - 1].out;
        }
        return x;
    }
    calcLayerInput(h) {
        if (h > 0 && h < this.h) {
            let w = this.weights[h - 1].w, wInputDim = this.weights[h - 1].inputDim, layer = this.layers[h], layerInput = layer.in;
            for (let i = 0, len = layer.dim; i < len; i++) {
                layerInput[i] = 0;
                let prevLayer = this.layers[h - 1], prevLayerOutput = prevLayer.out;
                for (let j = 0, jLen = prevLayer.dim; j < jLen; j++) {
                    layerInput[i] += prevLayerOutput[j] * w[i * wInputDim + j];
                }
            }
        }
    }
    calcLayerOutput(h) {
        let layer = this.layers[h], output = layer.out, inpit = layer.in;
        for (let i = 0, len = layer.dim; i < len; i++) {
            output[i] = this.psi(inpit[i]);
        }
    }
}
exports.default = Perceptron;
class WeightMatrix {
    constructor(inputDim, outputDim, widthScale) {
        this.inputDim = 0;
        this.outputDim = 0;
        this.w = [];
        this.w = [];
        this.inputDim = inputDim;
        this.outputDim = outputDim;
        for (let i = 0, len = inputDim * outputDim; i < len; i++) {
            this.w.push(2 * widthScale * Math.random() - widthScale);
        }
    }
}
class Layer {
    constructor(count) {
        this.count = 0;
        this.input = [];
        this.output = [];
        this.error = [];
        this.count = count;
        for (let i = 0; i < count; i++) {
            this.input.push(0);
            this.output.push(0);
            this.error.push(0);
        }
    }
    get dim() {
        return this.count;
    }
    get in() {
        return this.input;
    }
    get out() {
        return this.output;
    }
    get err() {
        return this.error;
    }
}
class TrainingElement {
    constructor(input, output) {
        this.input = input.slice(0);
        this.output = output.slice(0);
    }
    get in() {
        return this.input;
    }
    get out() {
        return this.output;
    }
}
exports.TrainingElement = TrainingElement;
