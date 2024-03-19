import React, { useState, useEffect } from "react";
import * as d3 from 'd3'
import * as topojson from "topojson";
import geojson from './mapAll.json'


let width = window.innerWidth;
let height = window.innerHeight;
const projection = d3.geoAlbers()
    .rotate([-100, 0])
    .parallels([52, 64])
    .scale(1000)
    .translate([width/2, height]);
let zoom = d3.zoom()
  .scaleExtent([1, 20]);
let path = d3.geoPath()
  .projection(projection);
let states;
let svg;
let data;
const Map = ()=>{
    const [geographies, setGeographies] = useState([]);
    function zoomed(event){
        const {transform} = event;
        let g = d3.select(".map-paths-cont");
        g.attr("transform", transform);
        g.attr("stroke-width", 1 / transform.k);
      }
    function reset(event) {
        states.transition().style("fill", null);
        svg.transition().duration(750).call(
            zoom.transform,
            d3.zoomIdentity,
            d3.zoomTransform(svg.node()).invert([width / 2, height / 2])
        );
    }
    function clicked(event, d) {
        const [[x0, y0], [x1, y1]] = path.bounds(d);
        event.stopPropagation();
        states.transition().style("fill", null);
        d3.select(event.target)
        .transition()
        .style("fill", "red");
        svg.transition().duration(750).call(
            zoom.transform,
            d3.zoomIdentity
            .translate(width / 2, height / 2)
            .scale(Math.min(20, 0.9 / Math.max((x1 - x0) / width, (y1 - y0) / height)))
            .translate(-(x0 + x1) / 2, -(y0 + y1) / 2),
            d3.pointer(event, svg.node())
        );
    }
    useEffect(() => {
        data = topojson.feature(geojson, geojson.objects.mapAll).features;
        setGeographies(data);
        svg = d3.select("svg");
        svg.attr("viewBox", [0, 0, width, height]).attr("width", width).attr("height", height).on("click", reset);
        console.log(d3.select("#states"))
        states = d3.select("#states").attr("fill", "rgba(38,50,56,1)").selectAll("path")
                .data(data)
                .join("path")
                .on("click", clicked)
                .attr("d", path);   
        zoom.on("zoom", zoomed);
        svg.call(zoom);
      }, []);
     return (           
            
            <g id="states"></g>            
    ); 

}
export default Map;