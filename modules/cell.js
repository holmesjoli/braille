
// Create cell
// Creates the Braille cell with approximate real dimentions. 
// Converts takes 1 millimeter and converts it to the appropriate pixel size
export function createCell(svg, spacing, width, height) {

    const convert = 3.7795275591;
    const margin = {left: 10, right: 10, top:10, bottom: 10}

    svg
        .attr("width", width)
        .attr("height", height)
        .attr("title", "A single 3 by 2 braille cell sized to the true size.");

    svg.selectAll('circle')
        .data(spacing)
        .join('circle')
        .attr('cy',  function (d) {
            return d.y*convert + margin.top;
        })
        .attr('cx', function (d) {
            return d.x*convert + margin.bottom;
        })
        .attr("fill", "#FFFFFF")
        .attr("stroke", "#000000")
        .attr('r', .6*convert);
}