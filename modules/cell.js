
// Create cell
// Creates the Braille cell with approximate real dimentions. 
// Converts takes 1 millimeter and converts it to the appropriate pixel size
export function create(svg, spacing, position, glyph = null, index = 1, convert = 3.7795275591, addText = false) {

    const margin = {x: 6*index, y:3.1}
    const r = .6;

    if (glyph != null) {
        position = position.filter(function(d) {
            return d.glyph === glyph.toLowerCase();
        });
    }

    const fillScale = d3.scaleOrdinal()
        .domain([0, 1])
        .range(["#FFFFFF", "#000000"]);

    svg.append("g")
        .selectAll('circle')
        .data(spacing)
        .join('circle')
        .attr('cy',  function (d) {
            return d.y*convert + margin.y*convert;
        })
        .attr('cx', function (d) {
            return d.x*convert + margin.x*convert;
        })
        .attr("fill", function(d) {
            if (glyph != null) {
                let m = position.find(el => el.position === d.position);
                return fillScale(m.value)
            } else {
                return fillScale(0);
            }
        })
        .attr("stroke", "#000000")
        .attr("stroke-width", .5)
        .attr('r', r*convert);

    if (addText) {
        svg.selectAll('text')
        .data(spacing)
        .join('text')
        .attr('y',  function (d) {
            return d.y*convert + margin.y*convert + r*convert;
        })
        .attr('x', function (d) {
            if(d.position % 2 == 0) {
                return d.x*convert + margin.x*convert*1.5;
            } else {
                return d.x*convert + margin.x*convert - margin.x*convert*.5;
            }
        })
        .text(function (d) {
            return d.position;
        })
        .attr("text-anchor", "middle")
        .attr("font-size", 2*convert)
    }
}

export function spell(chart, spacing, position, params, glyph) {

    let text;

    if (glyph != null) {
        text = glyph.join("");
    } else {
        text = "empty cell";
    }

    var svg = chart.append('svg')
        .attr("width", params.width)
        .attr("height", params.height)
        .attr("title", `A visual representation of an individual or set of braille cells representing the glyph or word: ${text}`);

    if (glyph.length > 0) {
        for(let i = 1; i < glyph.length + 1; i++) {
            console.log(glyph[i-1])
            create(svg, spacing, position, glyph[i-1], i)
        }
    } else {
        create(svg, spacing, position, glyph)
    }
}