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

    // initialize force layout
    let force = d3.forceSimulation(dataset.nodes)
      .force("charge", d3.forceManyBody())
      .force("link", d3.forceLink(dataset.edges).id(d => d.id).distance(200))
      .force("center", d3.forceCenter().x(w/2).y(h/2));

    // create svg
    let svg = d3.select("div.network")
      .append("svg")
      .attr("width", w)
      .attr("height", h);
    
    // create edges
    let edges = svg.selectAll("line")
      .data(dataset.edges)
      .enter()
      .append("line")
      .style("stroke", "firebrick")
      .style("stroke-width", 1);

    // create nodes
    let nodes = svg.selectAll('g')
      .data(dataset.nodes)
      .enter()
      .append('g')
      .classed('node', true)
      .attr('transform', function(d) { return 'translate(' + d.x + ',' + d.y + ')'; })
      .call(drag(force))
    nodes.append('clipPath')
      .attr('id', function(d) {
        return 'clip-path-' + d.id
      })
      .append('rect')
      .attr('width', 144)
      .attr('height', 81)
      .attr('x', -72)
      .attr('y', -40.5)
      .attr('fill', 'white')
      .attr('rx', 5)
    nodes.append('image')
      .attr('clip-path', function(d) {
        return 'url(#clip-path-' + d.id
      })
      .attr('xlink:href', function(d) { return d.thumbnail;})
      .attr('height', 81)
      .attr('x', function() {
        return -d3.select(this).node().getBBox().width/2
      })
      .attr('y', function() {
        return -d3.select(this).node().getBBox().height/2
      })
    
    // draw edges & nodes with correct placements at each tick
    force.on("tick", function() {
      edges.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });
    
      nodes.attr('transform', function(d) {
        return 'translate(' + d.x + ',' + d.y + ')'
      })
    });

    // define drag function
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
