import * as Helper from "./modules/helper.js"

// using d3 for convenience, and storing a selected elements
let container = d3.select('#scroll');
let graphic = container.select('.scroll__graphic');
let chart = graphic.select('#chart');
let text = container.select('.scroll__text');
let step = text.selectAll('.step');

// define some global vars
let chartWidth;
let chartHeight;

let data = [];
function updateData() {
    data = [];
    for (let i = 0; i < 5; i++) {
        data.push(Math.random() * 800);
    }
}
let svg = chart
    .append('svg')
let spacing;
let position;
let circles;
const convertMM = 3.7795275591;


const newData = [
    { x: 4, size: 9 },
    { x: 1, size: 8 },
    { x: 2, size: 1 },
    { x: 9, size: 3 },
    { x: 2, size: 2 }
]


const files = {
    spacing: {
        pth: "./data/spacing.csv",
        parse: function(j) {
            return {
                position: +j.position,
                x: +j.x,
                y: +j.y
            }
        }
    },
    position: {
        pth: "./data/position.csv",
        parse: function(j) {
            return {
                glyph: j.glyph,
                position: +j.position,
                value: +j.value
            }
        }
    }
}

let promises = [];

for (let key of Object.keys(files)) {
    let fl = files[key];
    Helper.read(fl.pth, fl.parse, promises);
}


const fillScale = d3.scaleOrdinal()
    .domain([0, 1])
    .range(["#FFFFFF", "#000000"]);

const r = .6;
const margin = {left: 3.1, right: 3.1, top: 3.1};


// initialize the scrollama
var scroller = scrollama();

// resize function to set dimensions on load and on page resize
function handleResize() {
    // 1. update height of step elements for breathing room between steps
    // changing the multiplier here will define how much white space between steps
    var stepHeight = Math.floor(window.innerHeight * 0.7);
    step.style('height', stepHeight + 'px');

    // 2. update height of graphic element
    var bodyWidth = d3.select('body').node().offsetWidth;
    graphic.style('height', window.innerHeight + 'px');

    // 3. update width of chart by subtracting from text width
    var chartMargin = 32;
    var textWidth = text.node().offsetWidth;

    chartWidth = graphic.node().offsetWidth - textWidth - chartMargin; // left

    // make the height 1/2 of viewport
    chartHeight = Math.floor(window.innerHeight / 2);

    chart
        .style('width', chartWidth + 'px')
        .style('height', chartHeight + 'px');

    // 4. tell scrollama to update new element dimensions
    scroller.resize();
}

// scrollama event handlers
function handleStepEnter(response) {
    // sticky the graphic
    graphic.classed('is-fixed', true);
    graphic.classed('is-bottom', false);

    // fade in current step
    step.classed('is-active', function (d, i) {
        return i === response.index;
    })

    if (response.index === 0) {
        updateChart(20);
    }

    if (response.index === 1) {
        updateChart(convertMM);
    }

    console.log(response)
}

// optional to view precise percent progress on callback
function handleProgress(response) {
    console.log(response)
}

// kick-off code to run once on load
function init() {

    Promise.all(promises).then(function (values) {

    // 1. call a resize on load to update width/height/position of elements
    handleResize();

    // 2. setup the scrollama instance
    // 3. bind scrollama event handlers (this can be chained like below)
    scroller
        .setup({
            container: '#scroll', // our outermost scrollytelling element
            graphic: '.scroll__graphic', // the graphic
            text: '.scroll__text', // the step container
            step: '.scroll__text .step', // the step elements
            offset: 0.5, // set the trigger to be 1/2 way down screen
            debug: false, // display the trigger offset for testing
            progress: false
        })
        // .onStepProgress(handleProgress)
        .onStepEnter(handleStepEnter);

    // setup resize event
    window.addEventListener('resize', handleResize);

    spacing = values[0];
    position = values[1];

    console.log(spacing)
    console.log(position)

    // updateData();
    initChart();

    });
}

// start it up
init();

/////////////////////////////////
// SOME D3 CODE FOR OUR GRAPHIC //
/////////////////////////////////


function drawCell(convert) {
    circles = svg.selectAll('circle')
        .data(spacing)
        .join('circle')
        .attr("role", "listitem")
        .attr('cy',  function (d) {
            return d.y*convert + margin.top*convert;
        })
        .attr('cx', function (d) {
            return d.x*convert + margin.left*convert/2 + margin.left*convert + margin.right*convert;
        })
        .attr('r', r*convert)
        .attr('fill', '#FFFFFF')
        .attr('stroke', "#000000");
}

function initChart(convert = 1) {

    svg
        .attr('width', chartWidth)
        .attr('height', chartHeight);

    circles = svg.selectAll('circle')
        .data(spacing)
        .join('circle')
        .attr("role", "listitem")
        .attr('cy',  function (d) {
            return d.y*convert + margin.top*convert;
        })
        .attr('cx', function (d) {
            return d.x*convert + margin.left*convert/2 + margin.left*convert + margin.right*convert;
        })
        .attr('r', 0)
        .attr('fill', '#FFFFFF')
        .attr('stroke', "#000000")
        .attr('opacity', 0);
}

function updateChart(convert) {


    let c = svg.selectAll("circle")
    .data(spacing, function(d) {return d.position;});

    c
    .enter()
    .append("circle")
        .attr('cy',  function (d) {
            return d.y*convert + margin.top*convert;
        })
        .attr('cx', function (d) {
            return d.x*convert + margin.left*convert/2 + margin.left*convert + margin.right*convert;
        })
        .attr("r", r*convert)
        .attr("opacity", 1)
    .merge(c)
        .transition()
        .duration(1000)
        .attr('cy',  function (d) {
            return d.y*convert + margin.top*convert;
        })
        .attr('cx', function (d) {
            return d.x*convert + margin.left*convert/2 + margin.left*convert + margin.right*convert;
        })
        .attr("r", r*convert)
        .attr("opacity", 1);

    c.exit()
        .transition()
        .duration(1000)
        .delay(1000)
        .attr("r", 0)
        .remove();
}


