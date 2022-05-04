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

let svg = chart
    .append('svg');

let g;
let spacing;
let position;
let positionFiltered;
let circles;
let glyphData = [];
const convertMM = 3.7795275591;


const files = {
    spacing: {
        pth: "./data/spacing.csv",
        parse: function(j) {
            return {
                position: +j.position,
                x: +j.x,
                y: +j.y,
                index: +j.index, //default index
                glypth: j.index //default glyph
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
        updateCell(30, null, true, false);
    }

    if (response.index === 1) {
        updateCell(convertMM, "abcdefghij", false, true);
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

    initChart();

    });
}

// start it up
init();

/////////////////////////////////
// SOME D3 CODE FOR OUR GRAPHIC //
/////////////////////////////////

function initChart(convert = 1, glyph = " ") {


    filterPositionData(glyph);

    svg
        .attr('width', chartWidth)
        .attr('height', chartHeight)
        .attr("role", "image")
        .attr("aria-labelledby","titleID")
        .append("title")
            .attr("id", "titleID")
            .text("Braille cell");

    g = svg.append("g")
        .attr("id", glyph)
        .attr("role", "list")
        .attr("aria-label", `braille cell showing the glyph ${glyph}`)

    // Add circles
    circles = g.selectAll('circle')
        .data(spacing)
        .join('circle')
        .attr("role", "listitem")
        .attr('cy', 0)
        .attr('cx', 0)
        .attr("fill", "#FFFFFF")
        .attr('r', 0)
        .attr('opacity', 0);

    // Add Numbers
    g.selectAll('text')
        .data(spacing)
        .join('text')
        .attr("role", "listitem")
        .attr("class", "cell-number")
        .attr('y', 0)
        .attr('x', 0)
        .attr('opacity', 0)
        .attr("text-anchor", "middle")
        .attr("font-size", 0)
        .text("");

    // Add Glyph
    g.selectAll("text")
        .data(glyphData)
        .join('text')
        .attr("role", "listitem")
        .attr("class", "cell-glyph")
        .attr('y', 0)
        .attr('x', 0)
        .attr("text-anchor", "middle")
        .attr("font-size", 0)
        .attr('opacity', 0)
        .text("");


    // g.selectAll('text')
    //     .data(glyphArray)
    //     .join('text')
    //     .attr("role", "listitem")
    //     .attr("class", "cell-number")
    //     .attr('y',  function (d) {
    //         return d.y*convert + margin.top*convert + r*convert/2;
    //     })
    //     .attr('x', function (d) {
    //         return d.x*convert + convert*margin.left/2*d.index;
    //     })
    //     .attr("text-anchor", "middle")
    //     .attr("font-size", convert)
    //     .attr('opacity', 0)
    //     .text(function (d) {
    //         return d.position;
    //     });
}

// Filter position data
function filterPositionData(glyph) {

    let glyphArray;
    let glyphDataNew = [];

    if (glyph != null) {
        glyphArray = glyph.split("");

        positionFiltered = position.filter(function(d) {

            d.index = glyphArray.indexOf(d.glyph);
            return glyph.includes(d.glyph);
        });

        glyphArray.forEach(function(d) {
            glyphDataNew.push({
                            glyph: d,
                            x: 0,
                            y: 0,
                            index: glyphArray.indexOf(d)})
        })

        glyphData = glyphDataNew;

    } else {
        positionFiltered = spacing;
    }
}


// Title Update the cell circle attributes
// Description transitions the cells between steps using entry and exit pattern of update
function updateCellCircle(convert, glyph) {

    filterPositionData(glyph);

    let c = g.selectAll("circle")
    .data(positionFiltered, function(d) {return d.position;});

    circles = c
    .enter()
    .append("circle")
    .merge(c)
        .transition()
        .duration(1000)
        .delay(function(d) {return 500*d.index})
        .attr('cy',  function (d) {
            let m = spacing.find(el => el.position === d.position);
            return m.y*convert + margin.top*convert;
        })
        .attr('cx', function (d) {
            let m = spacing.find(el => el.position === d.position);
            return m.x*convert + margin.left*convert/2 + margin.left*convert*d.index + margin.right*convert*d.index;
        })
        .attr("fill", function(d) {
            return fillScale(d.value);
        })
        .attr("stroke", "#000000")
        .attr("r", r*convert)
        .attr("opacity", 1);

    c.exit()
        .transition()
        .duration(1000)
        .attr("r", 0)
        .attr("opacity", 0)
        .remove();
}

// Update the number text attributes in the cell
// Description transitions the text between steps using entry and exit pattern of update
function updateCellText(convert, addNumber) {

    let opacity;

    if (addNumber) {
        opacity = 1;
    } else {
        opacity = 0;
    }

    let t = g.selectAll(".cell-number")
    .data(spacing, function(d) {return d.position;});

    t
        .enter()
        .append("text")
        .merge(t)
            .transition()
            .duration(1000)
            .attr('y',  function (d) {
                return d.y*convert + margin.top*convert + r*convert/2;
            })
            .attr('x', function (d) {
                return d.x*convert + margin.left*convert/2 + margin.left*convert*d.index + margin.right*convert*d.index;
            })
            .text(function (d) {
                return d.position;
            })
            .attr("text-anchor", "middle")
            .attr("font-size", convert)
            .attr("opacity", opacity);

        t.exit()
            .transition()
            .duration(1000)
            .attr("opacity", 0)
            .remove();
}

function updateCellGlyph(convert, addGlyph) {
    console.log(addGlyph)
    let opacity;

    if (addGlyph) {
        opacity = .6;
    } else {
        opacity = 0;
    }

    let t = g.select(".cell-glyph")

    var bb = circles.node().getBBox();
    var centery = bb.y + bb.height/2;
    var centerx = bb.x + bb.width/2;
    console.log(bb)


    t
        .transition()
        .duration(1000)
        .attr('y', 3*convert + margin.top*convert + r*convert)
        .attr('x', 2*convert + margin.left*convert + margin.right*convert)
        .attr("font-size", convert*5)
        .attr("opacity", opacity);
}

function updateCell(convert, glyph, addNumber, addGlyph) {

    updateCellCircle(convert, glyph);
    updateCellText(convert, addNumber);
    // updateCellGlyph(convert, addGlyph);
}
