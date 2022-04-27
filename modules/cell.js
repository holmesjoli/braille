
// Create cell
// Creates the Braille cell with approximate real dimentions. 
// Converts takes 1 millimeter and converts it to the appropriate pixel size
export function encode(svg, spacing, position, glyph, index, addText, convert, addNumber) {

    const margin = {left: 3.1, right: 3.1, top: 3.1}
    const r = .6;

    if (glyph != null) {
        position = position.filter(function(d) {
            return d.glyph === glyph.toLowerCase();
        });
    }

    const fillScale = d3.scaleOrdinal()
        .domain([0, 1])
        .range(["#FFFFFF", "#000000"]);

    let g = svg.append("g")
        .attr("id", glyph)
        .attr("role", "list")
        .attr("aria-label", `braille cell showing the glyph ${glyph}`)

    if (addText) {
        g
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
    }

    g
        .selectAll('circle')
        .data(spacing)
        .join('circle')
        .attr("role", "listitem")
        .attr('cy',  function (d) {
            return d.y*convert + margin.top*convert;
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

    if (addNumber) {
        g.selectAll('text')
            .data(spacing)
            .join('text')
            .attr('y',  function (d) {
                return d.y*convert + margin.top*convert + r*convert/2;
            })
            .attr('x', function (d) {
                return d.x*convert + convert*margin.left/2;
            })
            .text(function (d) {
                return d.position;
            })
            .attr("text-anchor", "middle")
            .attr("font-size", convert);
    }
}

// Converts latin alphabet to braille positionings
// SVG accessibility suggestions from https://css-tricks.com/accessible-svgs/
export function spell(chart, spacing, position, params, glyph = null, addText = false, convert = 3.7795275591, addNumber = false) {

    let text = glyph;
    var svg = chart.append('svg')
        .attr("width", params.width)
        .attr("height", params.height)

    if (glyph == null) {
        text = "empty cell";
        glyph = " "
    }

    svg
        .attr("aria-labelledby","titleID")
        .append("title")
            .attr("titleID", `A visual representation of the glyph or word ${text} in Braille`);

    if (glyph.length > 0) {
        for(let i = 0; i < glyph.length; i++) {
            encode(svg, spacing, position, glyph[i], i, addText, convert, addNumber);
        }
    } else {
        encode(svg, spacing, position, glyph, 1, addText, convert, addNumber);
    }
}
