import React from "react";
import * as d3 from 'd3';
import axios from 'axios';

class Network extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.createNetwork = this.createNetwork.bind(this);
  }

  componentDidMount() {
    let dataset = {}
    axios('https://youtaite-network-api.herokuapp.com/collabs')
      .then(function(response) {
        dataset.nodes = response.data
      })
      .then(axios('https://youtaite-network-api.herokuapp.com/edges')
        .then(function(response) {
          dataset.edges = response.data
        })
        .then(() => {
          this.createNetwork(dataset)
        }))
  }

  createNetwork(dataset) {
    let w = 1000;
    let h = 600;
    //Initialize a simple force layout, using the nodes and edges in dataset
    var force = d3.forceSimulation(dataset.nodes)
            .force("charge", d3.forceManyBody())
            .force("link", d3.forceLink(dataset.edges).id(d => d.id))
            .force("center", d3.forceCenter().x(w/2).y(h/2));

    var colors = d3.scaleOrdinal(d3.schemeCategory10);

    //Create SVG element
    var svg = d3.select("div.network")
          .append("svg")
          .attr("width", w)
          .attr("height", h);
    
    //Create edges as lines
    var edges = svg.selectAll("line")
      .data(dataset.edges)
      .enter()
      .append("line")
      .style("stroke", "#ccc")
      .style("stroke-width", 1);
    
    //Create nodes as circles
    var nodes = svg.selectAll("circle")
      .data(dataset.nodes)
      .enter()
      .append("circle")
      .attr("r", 10)
      .style("fill", function(d, i) {
        return colors(i);
      })
      .call(drag(force));

    //Add a simple tooltip
    nodes.append("title")
       .text(function(d) {
        return d.yt_id;
       });
    
    //Every time the simulation "ticks", this will be called
    force.on("tick", function() {

      edges.attr("x1", function(d) { return d.source.x; })
         .attr("y1", function(d) { return d.source.y; })
         .attr("x2", function(d) { return d.target.x; })
         .attr("y2", function(d) { return d.target.y; });
    
      nodes.attr("cx", function(d) { return d.x; })
         .attr("cy", function(d) { return d.y; });

    });

    //Define drag event functions
    function drag(force) {
      function dragStarted(e, d) {
        if (!e.active) force.alphaTarget(.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      }

      function dragging(e, d) {
        d.fx = e.x;
        d.fy = e.y;
      }

      function dragEnded(e, d) {
        if (!e.active) force.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      }
      return d3.drag()
        .on('start', dragStarted)
        .on('drag', dragging)
        .on('end', dragEnded)
    }
  }

  render() {
    return (
      <div className="network" style={{border: '1px solid gray'}}>
      </div>
    );
  }
}

export default Network;
