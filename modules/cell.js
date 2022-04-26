export function createCell(svg) {

    for (var i = 1; i < 7; i++) {

        if (i % 2 == 0) {
            
        svg.append("circle")
            .attr("cx", 10)
            .attr("cy", i*10)
            .attr("r", 3)

        } else {
            console.log(i)
            console.log(false)
        }
    }
}