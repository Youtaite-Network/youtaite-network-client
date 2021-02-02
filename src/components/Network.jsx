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
      .then(response => {
        dataset.nodes = response.data
        axios('https://youtaite-network-api.herokuapp.com/edges')
          .then(response => {
            dataset.edges = response.data
            this.createNetwork(dataset)
          })
          .catch(function(error) {
            console.log(error)
          })
      })
  }

  createNetwork(dataset) {
    let w = 1000;
    let h = 600;
    //Initialize a simple force layout, using the nodes and edges in dataset
    var force = d3.forceSimulation(dataset.nodes)
      .force("charge", d3.forceManyBody())
      .force("link", d3.forceLink(dataset.edges).id(d => d.id).distance(200))
      .force("center", d3.forceCenter().x(w/2).y(h/2));

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

    //Create nodes
    // var nodes = svg.selectAll("image")
    //   .data(dataset.nodes)
    //   .enter()
    //   // .append("rect")
    //   // .attr('width', 250)
    //   // .attr('height', 145)
    //   // .attr('stroke', 'red')
    //   // .attr('fill', 'rgba(0,0,0,0)')
    //   .append('image')
    //   .attr('width', 240)
    //   .attr('height', 135)
    //   .attr('href', d => d.thumbnail)
    //   .call(drag(force));

  // Enter any new nodes.
    let nodes = svg.selectAll('g')
      .data(dataset.nodes)
      .enter()
      .append('g')
      .classed('node', true)
      .attr('transform', function(d) { return 'translate(' + d.x + ',' + d.y + ')'; })
      .call(drag(force))
    nodes.append('rect')
      .attr('width', 154)
      .attr('height', 91)
      .attr('x', -77)
      .attr('y', -45.5)
      .attr('stroke', 'firebrick')
      .attr('fill', 'white')
      .attr('rx', 10)
    nodes.append('image')
      .attr('xlink:href', function(d) { return d.thumbnail;})
      .attr('height', 81)
      .attr('x', function() {
        return -d3.select(this).node().getBBox().width/2
      })
      .attr('y', function() {
        return -d3.select(this).node().getBBox().height/2
      })
    
    //Every time the simulation "ticks", this will be called
    force.on("tick", function() {
      edges.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });
    
      nodes.attr('transform', function(d) {
        return 'translate(' + d.x + ',' + d.y + ')'
      })
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
