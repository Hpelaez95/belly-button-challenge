url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

// default plot that will show up before a selection is made
function init() {
    let dropdownMenu = d3.select("#selDataset");

    d3.json(url).then((data)=> {
        console.log(`The data: ${data}`);

        // the array of all the ids
        let names = data.names;

        // looping and attaching to the options on the drop down list
        names.forEach((name)=>{
            
            dropdownMenu.append("option").text(name).property("value", name);

        });

        // selecting the first index to variable
        let name = names[0]

        // the base call to make the charts
        demochart(name);
        bargraph(name);
        bubblechart(name);
        gaugechart(name);
    });
}

function demochart(value) {
    d3.json(url).then((data)=>{
        console.log(`The data: ${data}`);

        let metadata = data.metadata

        let filtered = metadata.filter((meta)=> meta.id == value);

        let firstobject = filtered[0]

        d3.select("#sample-metadata").html("");

        let entries = Object.entries(firstobject);
        
        entries.forEach(([key,value])=> {

            d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);

        });
        console.log(entries);
    });
}

function bargraph(value){
    d3.json(url).then((data)=> {
        console.log(`The data: ${data}`);

        let samps = data.samples;

        let filtered = samps.filter((result) => result.id == value);

        let firstobject = filtered[0];

        // trace for the bargraph set as horizontal 
        let trace = [{
            x: firstobject.sample_values.slice(0,10).reverse(),
            y: firstobject.otu_ids.slice(0,10).map((id)=> `OTU ${id}`).reverse(),
            labels: firstobject.otu_labels.slice(0,10).reverse(),
            type: "bar",
            orientation: "h"


        }];

        Plotly.newPlot("bar", trace);

    })
}

function bubblechart(value){
    d3.json(url).then((data)=>{

        let samps = data.samples;

        let filtered = samps.filter((result)=> result.id == value);

        let firstobject = filtered[0];
        
        // trace for the bubble chart, colored purple
        let trace = [{
            x: firstobject.otu_ids,
            y: firstobject.sample_values,
            labels: firstobject.otu_labels,
            mode:"markers",
            marker: {
                size: firstobject.sample_values,
                color: firstobject.otu_ids,
                colorscale: "delta"
            }

        }];

        let layout = {
            title : "Bacteria Sample",
            xaxis: {title: "OTU ID"},
        };

        Plotly.newPlot("bubble",trace, layout);
    });

}

function gaugechart(value){
    d3.json(url).then((data)=>{
        let metadata = data.metadata;

        let filtered = metadata.filter((meta) => meta.id == value);

        let firstobject = filtered[0]

        // Trace for the gauge chart
        let trace = [{

            domain: {x: [0,1], y: [0,1]},
            value: firstobject.wfreq,
            title: { text: "Washing Frequency", font: {size: 28}},
            type: "indicator",
            mode: "gauge+number",
            gauge: {
                axis : {range: [null, 10]},
                bar: {color: "Greens(68,166,198)"},
                steps: [
                    {range: [0,1], color: "rgb(233,245,248)"},
                    {range: [1,2], color: "rgb(218,237,244)"},
                    {range: [2,3], color: "rgb(203,230,239)"},
                    {range: [3,4], color: "rgb(188,223,235)"},
                    {range: [4,5], color: "rgb(173,216,230)"},
                    {range: [5,6], color: "rgb(158,209,225)"},
                    {range: [6,7], color: "rgb(143,202,221)"},
                    {range: [7,8], color: "rgb(128,195,216)"},
                    {range: [8,9], color: "rgb(113,187,212)"},
                    {range: [9,10], color: "rgb(98,180,207)"},

                ]

            }

        }];

        Plotly.newPlot("gauge", trace);

    })
}

// when sample is changed the values change with the function.
function optionChanged(value){
    demochart(value)
    bargraph(value)
    bubblechart(value)
    gaugechart(value)
}


init()