import * as Helper from "./modules/helper.js"

// Scrollama globals
let container = d3.select('#scroll');
let graphic = container.select('.scroll__graphic');
let chart = graphic.select('#chart');
let text = container.select('.scroll__text');
let step = text.selectAll('.step');

// Visualization globals
let svg = chart
    .append('svg');
let chartWidth;
let chartHeight;

// Data globals
let spacing;
let position;
let glyphData = [];
let data;
let rectData;

// Grouping globals
let g;
let gCircles;
let gGlyphs;
let gNumbers;
let gRects;

// Additional globals
let glyphArray;
let grade1GlyphArray = "abcdefghij".split("");
let grade2GlyphArray = "klmnopqrst".split("");
let grade3GlyphArray = "uvxyz    w".split("");
const convertMM = 3.7795275591;
let magnify;

if (window.innerWidth < 800) {
    magnify = 5;
} else {
    magnify = 10;
}

const files = {
    spacing: {
        pth: "./data/spacing.csv",
        parse: function(j) {
            return {
                position: +j.position,
                x: +j.x,
                y: +j.y,
                xIndex: +j.index, //default index
                glyph: j.glyph //default glyph
            }
        }
    },
    position: {
        pth: "./data/position.csv",
        parse: function(j) {
            return {
                glyph: j.glyph,
                position: +j.position,
                value: +j.value,
                id: j.id,
                grade: +j.grade
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


const colorScale = d3.scaleOrdinal()
    .domain([0,1,2,3,4,5,6,7,8,9])
    .range(["#f0a96a", "#cde7b0", "#a3bfa8", "#7286a0", "#59594a", "#f0a96a", "#cde7b0", "#a3bfa8", "#7286a0", "#59594a"])


const opacityScale = d3.scaleOrdinal()
    .domain([1, 2, 3, 4, 5, 6])
    .range([.5, .5, .5, .5, 1, 1])

const r = .6;
const margin = {left: 3.1, right: 3.1, top: 3.1};


// initialize the scrollama
var scroller = scrollama();

// resize function to set dimensions on load and on page resize
function handleResize() {
    // 1. update height of step elements for breathing room between steps
    // changing the multiplier here will define how much white space between steps
    let stepHeight;

    graphic.style('height', window.innerHeight + 'px');

    // 3. update width of chart by subtracting from text width
    var chartMargin = 32;
    var textWidth = text.node().offsetWidth;

    if (window.innerWidth < 800) {
        chartWidth = graphic.node().offsetWidth;
        chartHeight = Math.floor(window.innerHeight*.5);
        stepHeight = Math.floor(window.innerHeight*.6);
    } else {
        chartWidth = graphic.node().offsetWidth - textWidth - chartMargin; // left
        chartHeight = Math.floor(window.innerHeight*.7);
        stepHeight = Math.floor(window.innerHeight *.6);
        // step.style('height', stepHeight + 'px');
    }

    // make the height 1/2 of viewport
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
        step0();
    }

    if (response.index === 1) {
        step1();
    }

    if (response.index === 2) {
        step2();
    }

    if (response.index === 3) {
        step3();
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
            offset: .55, // set the trigger to be 1/2 way down screen
            debug: false, // display the trigger offset for testing
            progress: false
        })
        // .onStepProgress(handleProgress)
        .onStepEnter(handleStepEnter);

    // setup resize event
    window.addEventListener('resize', handleResize);

    spacing = values[0];
    position = values[1];

    console.log(position)

    defaultRectData();
    initChart();
    });
}

// start it up
init();

/////////////////////////////////
// SOME D3 CODE FOR OUR GRAPHIC //
/////////////////////////////////

// Title Init Chart
// Description initiates different components of the visualization
function initChart() {

    filteredData(" ")

    svg
        .attr('width', chartWidth)
        .attr('height', chartHeight)
        .attr("role", "image")
        .attr("aria-label", "Braille cell");

    g = svg
        .append("g")
        .attr("role", "list")
        .attr("aria-label", "initialized chart")

    // Add circles
    gCircles = g
        .append("g")

    gCircles
        .attr("class", "matrix")
        .selectAll('circle')
        .data(data)
        .join('circle')
        .attr("class", "matrix-unit")
        .attr("role", "listitem")
        .attr('cy', 0)
        .attr('cx', 0)
        .attr("fill", "#FFFFFF")
        .attr('r', 0)
        .attr('opacity', 0);

    // Add Numbers
    gNumbers = g
    .append("g")

    gNumbers
        .attr("class", "cell-numbers")
        .selectAll('cell-number')
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
    gGlyphs = g
    .append("g")

    gGlyphs
        .attr("class", "cell-glyphs")
        .selectAll("cell-glyph")
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

    // Add Rect
    gRects = g
    .append("g")

    gRects
        .attr("class", "rect-groups")
        .selectAll("rect-groups")
        .data(rectData)
        .join('rect')
        .attr("class", "dashed")
        .attr('y', margin.top)
        .attr('x', margin.left)
        .attr("width", 0)
        .attr("height", 0)
        .attr("opacity", 0)
}

// Filtered Data
// Filters the data for each step given a glyph
function filteredData(glyph) {

    glyphArray = glyph.split("");

    data = position.filter(function(d) {

        d.xIndex = glyphArray.indexOf(d.glyph);

        if (d.xIndex < 10) {
            d.yIndex = 0;
        } else if (d.xIndex >= 10 & d.xIndex <=19) {
            d.yIndex = 1;
            d.xIndex = d.xIndex - 10;
        } else {
            d.yIndex = 2;
            d.xIndex = d.xIndex - 20;
        }

        return glyph.includes(d.glyph);
    });

    let glyphDataNew = [];
    glyphArray.forEach(function(d) {

        let xIndex = glyphArray.indexOf(d);
        let yIndex;

        if (xIndex < 10) {
            yIndex = 0;
        } else if (xIndex >= 10 & xIndex <=19) {
            yIndex = 1;
            xIndex = xIndex - 10;
        } else {
            yIndex = 2;
            xIndex = xIndex - 20;
        }

        glyphDataNew.push({
                        glyph: d,
                        x: 0,
                        y: 0,
                        xIndex: xIndex,
                        yIndex: yIndex})
    })

    glyphData = glyphDataNew;
}

// Title y Position
function yPos(d, convert) {
    let m = spacing.find(el => el.position === d.position);
    return m.y*convert + margin.top*convert + 14*convert*d.yIndex;
}

// Title x Position
function xPos(d, convert) {
    let m = spacing.find(el => el.position === d.position);
    return m.x*convert + margin.left*convert/2 + margin.left*convert*d.xIndex + margin.right*convert*d.xIndex;
}

// Title Update the cell circle attributes
// Description transitions the cells between steps using entry and exit pattern of update
function updateCellCircle(convert) {

    let c = gCircles.selectAll("circle")
    .data(data, function(d) {return d.id;});

    c
    .enter()
    .append("circle")
        .attr("r", r*convert)
        .attr("stroke", "#000000")
        .attr("fill", "#FFFFFF")
    .merge(c)
        .transition()
        .duration(1000)
        .attr('cy',  function (d) { return yPos(d, convert); })
        .attr('cx', function (d) { return xPos(d, convert); })
        .attr("fill", function(d) {
            if (d.value === 1) {
                return colorScale(d.xIndex);
            } else {
                return "#FFFFFF";
            }
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
    let data = [];

    if (addNumber) {
        opacity = 1;
        data = spacing;
    } else {
        opacity = 0;
    }

    let t = gNumbers.selectAll("text")
    .data(data, function(d) {return d.position;});

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
                return d.x*convert + margin.left*convert/2 + margin.left*convert*d.xIndex + margin.right*convert*d.xIndex;
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
        .attr("font-size", 0)
        .attr("opacity", 0)
        .remove();
}

// Adds glyphs below Braille Cells
function updateCellGlyph(convert, addGlyph) {

    let opacity;
    let data = [];

    if (addGlyph) {
        opacity = 1;
        data = glyphData;
    } else {
        opacity = 0;
    }

    let t = gGlyphs.selectAll("text")
    .data(data, function(d) {return d.glyph;});
    console.log(data)

    t
        .enter()
        .append("text")
        .merge(t)
            .transition()
            .duration(1000)
            .attr('y',  function (d) {
                return 14*convert*(d.yIndex +1)
            })
            .attr('x', function (d) {
                return 2*convert + margin.left*convert/2 + margin.left*convert*d.xIndex + margin.right*convert*d.xIndex;
            })
            .text(function (d) {return d.glyph; })
            .attr("text-anchor", "middle")
            .attr("font-size", convert*5)
            .attr("fill", "grey")
            .attr("opacity", opacity);

    t.exit()
        .transition()
        .duration(1000)
        .attr("font-size", 0)
        .attr("opacity", 0)
        .remove();
}

// Update rects
function updateRect(addRect) {
    let opacity;

    if (addRect) {
        opacity = 1;
    } else {
        opacity = 0;
    }

    let c = gRects.selectAll("rect")
    .data(rectData, function(d) {return d.id;});

    c
    .append("rect")
    .merge(c)
        .transition()
        .duration(1000)
        .attr('y', function(d) {return d.yMin; })
        .attr('x',  function(d) {return d.xMin; })
        .attr("width",  function(d) {return d.xMax; })
        .attr("height",  function(d) {return d.yMax; })
        .attr("stroke", "#000000")
        .attr("fill", "none")
        .attr("opacity", opacity);
}

function defaultRectData() {
    rectData = [{"xMin": 0, "xMax": 0, "yMin": 0, "yMax": 0, "id": 0}];
}

function step2RectData(convert) { 
    
    let yMinData = data.filter((d) => d.glyph === "a" & d.position === 1);
    let yMin = yPos(yMinData[0], convert) - convert;

    let xMinData = data.filter((d) => d.glyph === "a" & d.position === 1);
    let xMin = xPos(xMinData[0], convert) - convert;

    let yMaxData = data.filter((d) => d.glyph === "j" & d.position === 3);
    let yMax = yPos(yMaxData[0], convert) - convert;

    let xMaxData = data.filter((d) => d.glyph === "j" & d.position === 4);
    let xMax = xPos(xMaxData[0], convert) + convert;

    rectData = [{"xMin": xMin, "xMax": xMax, "yMin": yMin, "yMax": yMax, "id": 0}];
}

function step3RectData(convert) { 

    let yMinData = data.filter((d) => d.glyph === "a" & d.position === 1);
    let yMin = yPos(yMinData[0], convert) - convert;

    let yMaxData = data.filter((d) => d.glyph === "u" & d.position === 5);
    let yMax = yPos(yMaxData[0], convert) + 7*convert;

    let xMinData = data.filter((d) => d.glyph === "a" & d.position === 1);
    let xMin = xPos(xMinData[0], convert) - convert;

    let xMaxData = data.filter((d) => d.glyph === "a" & d.position === 2);
    let xMax = xPos(xMaxData[0], convert) + convert;

    rectData = [{"xMin": xMin, "xMax": xMax, "yMin": yMin, "yMax": yMax, "id": 0}];
}

// Title Highlight top four
// Description Highlights the top four dots in red
function highlightTopFour(convert) {

    let c = gCircles.selectAll("circle")
    .data(data, function(d) {return d.id;});

    c
    .enter()
    .append("circle")
        .attr("r", r*convert)
        .attr("stroke", "#000000")
        .attr("fill", "#FFFFFF")
    .merge(c)
        .transition()
        .duration(1000)
        .attr("r", function(d) {
            if (d.value === 0) {
                return r*convert;
            } else {
                return r*convert*1.5;
            }
        });
}

// Title Highlight fifth dot
// Description Highlights the fifth dot
function highlightDotFive(convert) {

    let c = gCircles.selectAll("circle")
    .data(data, function(d) {return d.id;});

    c
    .enter()
    .append("circle")
        .attr("stroke", "#000000")
        .attr("fill", "#FFFFFF")
        .attr("fill-opacity", 0)
        .attr("stroke-opacity", 0)
        .attr("r", 0)
    .merge(c)
        .transition()
        .duration(1000)
        .attr('cy',  function (d) { return yPos(d, convert); })
        .attr('cx', function (d) { return xPos(d, convert); })
        .attr("fill", function(d) {
            if (d.value === 1) {
                return colorScale(d.xIndex);
            } else {
                return "#FFFFFF"
            }
        })
        .attr("r", function(d) {
            console.log(d)
            if (d.grade === 3 && (d.position === 5 || d.position === 6)) {
                return r*convert*1.5;
            } if(d.grade === 2 && d.position === 5) {
                return r*convert*1.5;
            } else {
                return r*convert;
            }
        })
        .attr("fill-opacity", function(d) {
            return opacityScale(d.position);
        })
        .attr("stroke-opacity", 1);

    c.exit()
        .transition()
        .duration(1000)
        .attr("r", 0)
        .attr("opacity", 0)
        .remove();
}


// Title Step 0
// Description filters data, updates circles, number and glyphs
function step0(convert = 30) {

    // Update data steps
    filteredData(" ");
    defaultRectData();

    // Update visual attributes
    updateCellCircle(convert);
    updateCellText(convert, true);
    updateCellGlyph(convert, false);
    updateRect(false);

    svg
        .attr("aria-label","Image shows an enlarged 2 by 3 Braille cell. The cells are numbered 1 through 6.");
}

// Title Step 1
// Description filters data, updates circles, number and glyphs
function step1(convert = magnify) {

    // Update data steps
    filteredData("abcdefghij");
    defaultRectData();

    // Update visual attributes
    updateCellCircle(convert);
    updateCellText(convert, false);
    updateCellGlyph(convert, true);
    updateRect(false);

    svg
        .attr("aria-label","The image transitions from a single Braille cell to a set of 10 Braille representing A-J. The numbers have been removed and there is text below each cell that labels the cell A through J.");
}

// Title Step 2
// Description highlighs circles in red
function step2(convert = magnify) {

    // Update data steps
    filteredData("abcdefghij");
    step2RectData(convert);

    // Update visual attributes
    highlightTopFour(convert);
    updateRect(true);

    svg
        .attr("aria-label","The image transitions to highlight the top four dots in each of the ten Braille cells. A red stroke appears around each of the top four cells and the dot radius is enlarged for emphasis.");
}

// Title Step 3
// Description filters data, updates circles, number and glyphs
function step3(convert = magnify) {

    // Update data steps
    filteredData("abcdefghijklmnopqrstuvxyz    w");
    step3RectData(convert);

    // Update visual attributes
    highlightDotFive(convert);
    updateCellText(convert, false);
    updateCellGlyph(convert, true);
    updateRect(true);

    // g.attr("transform", `translate(0,0)`)

    svg
        .attr("aria-label","The image transitions to show 20 Braille cells representing A through T. There are now two rows of Braille cells to show how the grades are related. ");
}
