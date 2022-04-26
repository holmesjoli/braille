
// Create cell
// Creates the Braille cell with approximate real dimentions. 
// Converts takes 1 millimeter and converts it to the appropriate pixel size
export function encode(svg, spacing, position, glyph = null, index = 0, addText = false, convert = 3.7795275591) {

    const margin = {left: 3.1, right: 3.1, y: 3.1}
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
        .attr("id", glyph)
        .selectAll('circle')
        .data(spacing)
        .join('circle')
        .attr('cy',  function (d) {
            return d.y*convert + margin.y*convert;
        })
        .attr('cx', function (d) {
            if (index === 0) {
                return d.x*convert + margin.left*convert/2;
            } else {
                return d.x*convert + margin.left*convert/2 + margin.left*convert*index + margin.right*convert*index;
            }
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

        svg
            .append("text")
            .attr("x", function (d) {
                if (index === 0) {
                    return margin.left*convert/2 - r*convert;
                } else {
                    return margin.left*convert/2 + margin.left*convert*index + margin.right*convert*index - r*convert;
                }
            })
            .attr("y", 60)
            .text(glyph)
    //     svg.selectAll('text')
    //     .data(spacing)
    //     .join('text')
    //     .attr('y',  function (d) {
    //         return d.y*convert + margin.y*convert + r*convert;
    //     })
    //     .attr('x', function (d) {
    //         if(d.position % 2 == 0) {
    //             return d.x*convert + margin.left*convert*1.5;
    //         } else {
    //             return d.x*convert + margin.left*convert - margin.left*convert*.5;
    //         }
    //     })
    //     .text(function (d) {
    //         return d.position;
    //     })
    //     .attr("text-anchor", "middle")
    //     .attr("font-size", 2*convert)
    }
}

// Converts latin alphabet to braille positionings
export function spell(chart, spacing, position, params, glyph, addText) {

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
        for(let i = 0; i < glyph.length; i++) {
            encode(svg, spacing, position, glyph[i], i, addText);
        }
    } else {
        encode(svg, spacing, position, glyph, 1, addText);
    }
}

// Creates the title
export function createTitle(spacing, position) {
    let paramsC = {
        width: 300,
        height: 75
    }

    let string = "BRAILLE".split("");

    spell(d3.select("#title"), spacing, position, paramsC, string, true);
}