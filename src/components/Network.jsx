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
      .force("charge", d3.forceManyBody().strength(-1500))
      .force("link", d3.forceLink(dataset.edges).id(d => d.id).distance(30))
      .force("center", d3.forceCenter().x(w/2).y(h/2));

    // create svg
    let svg = d3.select("div.network")
      .append("svg")
      .attr("width", w)
      .attr("height", h)
      .style('border', '1px solid lightgrey')

    // create title label in top left
    svg.append('text')
      .attr('id', 'title-text')
      .attr('x', 15)
      .attr('y', 26)
      .attr('font-size', 18)
      .attr('font-weight', 'bold')
    
    // create edges
    let edges = svg.selectAll("line")
      .data(dataset.edges)
      .enter()
      .append("line")
      .attr('id', function(d) {
        return 'edge-' + d.source.id + '-' + d.target.id
      })
      .classed('edge', true)
      .attr("stroke", "lightgrey")
      .attr("stroke-width", .5);

    // create nodes
    let nodes = svg.selectAll('g')
      .data(dataset.nodes)
      .enter()
      .append('g')
      .classed('node', true)
      .attr('id', function(d) {
        return 'g-' + d.id
      })
      .attr('transform', function(d) { return 'translate(' + d.x + ',' + d.y + ')'; })
      .on('mouseover', function(evt, d) {
        let filtered_edges = dataset.edges.filter(function(edge) {
          return edge.source.id === d.id || edge.target.id === d.id
        })
        let filtered_node_ids = []
        filtered_edges.forEach(function(edge) {
          svg.select('#edge-' + edge.source.id + '-' + edge.target.id)
            .attr('stroke', 'orange')
            .attr('stroke-width', 2)
          filtered_node_ids.push(edge.source.id)
          filtered_node_ids.push(edge.target.id)
        })
        filtered_node_ids = [...new Set(filtered_node_ids)] // remove dupes
        filtered_node_ids.forEach(function(node_id) {
          svg.select('#rect-' + node_id)
            .attr('stroke', 'orange')
            .attr('stroke-width', 1.5)
            .attr('transform', 'scale(1.25,1.25)')
          svg.select('#img-' + node_id)
            .attr('transform', 'scale(1.25,1.25)')
        })
        svg.select('#title-text')
          .text(d.title)
      })
      .on('mouseout', function(e, d) {
        svg.selectAll('rect.node-rect')
          .attr('stroke', 'lightgrey')
          .attr('stroke-width', .5)
          .attr('transform', 'scale(1,1)')
        svg.selectAll('line.edge')
          .attr('stroke-width', .5)
          .attr('stroke', 'lightgrey')
        svg.selectAll('image.node-img')
          .attr('transform', 'scale(1,1)')
        svg.select('#title-text')
          .text('')
      })
      .on('click', function(e, d) {
        if (e.metaKey) {
          window.open('https://youtube.com/watch?v=' + d.yt_id, 'mywindow').focus()
        }
      })
      .call(drag(force))
    nodes.append('clipPath')
      .attr('id', function(d) {
        return 'clip-path-' + d.id
      })
      .classed('node-clip-path', true)
      .append('rect')
      .attr('width', 72)
      .attr('height', 40.5)
      .attr('x', -36)
      .attr('y', -20.25)
      .attr('rx', 5)
      .attr('fill', 'white')
    nodes.append('image')
      .attr('id', function(d) {
        return 'img-' + d.id
      })
      .classed('node-img', true)
      .attr('clip-path', function(d) {
        return 'url(#clip-path-' + d.id
      })
      .attr('xlink:href', function(d) { return d.thumbnail;})
      .attr('height', 40.5)
      .attr('x', function() {
        return -d3.select(this).node().getBBox().width/2
      })
      .attr('y', function() {
        return -d3.select(this).node().getBBox().height/2
      })
    nodes.append('rect')
      .attr('id', function(d) {
        return 'rect-' + d.id
      })
      .classed('node-rect', true)
      .attr('width', 72)
      .attr('height', 40.5)
      .attr('x', -36)
      .attr('y', -20.25)
      .attr('rx', 5)
      .attr('fill', 'none')
      .attr('stroke', 'lightgrey')
      .attr('stroke-width', .5)

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
      <div className="network">
        <p>cmd/ctrl-click to open the video in a new tab</p>
      </div>
    );
  }
}

export default Network;
