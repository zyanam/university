import { ui as lab2UI } from "./lab2/mainUi";
import { ui as lab3UI } from "./lab3/ui";

let buttonId = "modButtonId1",
    chartId = "modChart1Id",
    formDataId = "formDataId",
    formOutputDataId = "formOutputDataId",
    tabbarId = "modLabsSegmentedId",
    modLab1Id = "modLab1Id",
    modLab2Id = "modLab2Id",
    modLab3Id = "modLab3Id",
    ui = {
        id: "modId",
        css: "bg_panel_raised",
        type: "space",
        autoheight: true,
        rows: [
            {
                view: "toolbar",
                cols: [
                    {
                        view: "segmented", id: tabbarId, value: modLab1Id, multiview: true, options: [
                            { value: "Lab 1", id: modLab1Id },
                            { value: "Lab 2", id: modLab2Id },
                            { value: "Lab 3", id: modLab3Id }
                        ]
                    },
                    {}
                ]
            },
            {
                cells: [
                    {
                        id: modLab1Id,
                        rows: [
                            {
                                type: "toolbar",
                                css: "bg_panel",
                                cols: [
                                    { template: "MOD", type: "header", width: 100, borderless: true },
                                    <webix.ui.buttonConfig>{
                                        view: "button",
                                        css: "button_primary button_raised",
                                        id: buttonId,
                                        width: 100,
                                        value: "Run"
                                    },
                                    <webix.ui.formConfig>{
                                        view: "form",
                                        id: formDataId,
                                        gravity: 1.3,
                                        cols: [
                                            <webix.ui.textConfig>{
                                                view: "text",
                                                value: "",
                                                name: "a",
                                                label: "A:",
                                                labelAlign: "left"
                                            },
                                            <webix.ui.textConfig>{
                                                view: "text",
                                                value: "",
                                                name: "m",
                                                label: "M:",
                                                labelAlign: "left"
                                            },
                                            <webix.ui.textConfig>{
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
                            <webix.ui.formConfig>{
                                view: "form",
                                id: formOutputDataId,
                                disabled: true,
                                cols: [
                                    <webix.ui.textConfig>{
                                        view: "text",
                                        value: "",
                                        name: "period",
                                        label: "Period:",
                                        labelAlign: "left"
                                    },
                                    <webix.ui.textConfig>{
                                        view: "text",
                                        value: "",
                                        name: "aPeriod",
                                        label: "Aperiod:",
                                        labelAlign: "left"
                                    },
                                    <webix.ui.textConfig>{
                                        view: "text",
                                        value: "",
                                        name: "mX",
                                        label: "Mx:",
                                        labelAlign: "left"
                                    },
                                    <webix.ui.textConfig>{
                                        view: "text",
                                        value: "",
                                        name: "dX",
                                        label: "Dx:",
                                        labelAlign: "left"
                                    },
                                    <webix.ui.textConfig>{
                                        view: "text",
                                        value: "",
                                        name: "uniformity",
                                        label: "Uniformity:",
                                        labelAlign: "left"
                                    }
                                ]
                            },
                            <webix.ui.chartConfig>{
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
                    },
                    {
                        id: modLab2Id,
                        rows: [
                            lab2UI
                        ]
                    },
                    {
                        id: modLab3Id,
                        rows: [
                            lab3UI
                        ]
                    }
                ]
            }
        ]
    };

export { ui as UI, buttonId, chartId, formDataId, formOutputDataId };