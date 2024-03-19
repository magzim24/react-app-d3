import React, { Component } from "react";
import * as d3 from "d3";
import * as topojson from "topojson";


class Map extends Component{
    render(){
        const width = 500;
        const height = width * 0.5;
        const projection = d3.geoAlbers()
        const path = d3.geoPath().projection(projection);
        return (
            <svg>
                {
                    d3.json("mapAll.json").then(topology=> function(){
                        let geojson = topojson.feature(topology, topology.objects.mapAll).features;
                        geojson.map(d => (
                            <path
                            d={path(d)}
                            fill="#eee"
                            stroke="#0e1724"
                            strokeWidth="1"
                            strokeOpacity="0.5"
                            onMouseEnter={(e) => {
                            d3.select(e.target)
                                .attr('fill', '#000')
                            }}
                            onMouseOut={(e) => {
                            d3.select(e.target)
                                .attr('fill', '#eee')
                            }}
                        />
                        ))
                    }
                        
                    )                   
                }
            </svg>
        );
    }
}
export default Map;