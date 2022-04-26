// Title Read path
// param pth str. The path or url to read the data from
// param parse func. A parsing function specific to that data
// param promises array. Empty array
export function read(pth, parse, promises) {
    let ext = pth.split(".").pop();

    if (ext === "csv") {
        promises.push(d3.csv(pth, parse));
    } else if (ext === "json" || ext === "geojson") {
        promises.push(d3.json(pth, parse));
    } else {
        console.error("unknown file extension");
    }
}
