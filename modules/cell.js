
// Create cell
// Creates the Braille cell with approximate real dimentions. 
// Converts takes 1 millimeter and converts it to the appropriate pixel size
export function create(svg, spacing, position, width, height, glyph = null, convert = 3.7795275591, addText = false) {

    let margin = {x: 3.1, y:3.1}
    let r = .6;

    position = position.filter(function(d) {

        if (glyph != null) {
            return d.glyph === glyph;
        }
    });

    console.log(position)

    const fillScale = d3.scaleOrdinal()
        .domain([0, 1])
        .range(["#FFFFFF", "#000000"]);

    svg
        .attr("width", width)
        .attr("height", height)
        .attr("title", "A single 3 by 2 braille cell sized to the true size.");

    svg.selectAll('circle')
        .data(spacing)
        .join('circle')
        .attr('cy',  function (d) {
            return d.y*convert + margin.y*convert;
        })
        .attr('cx', function (d) {
            return d.x*convert + margin.x*convert;
        })
        .attr("fill", function(d) {
            let m = position.find(el => el.position === d.position);
            return fillScale(m.value)
        })
        .attr("stroke", "#000000")
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