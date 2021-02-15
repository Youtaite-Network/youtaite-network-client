import React from "react"
import * as d3 from 'd3'
import Spinner from 'react-bootstrap/Spinner'
import './Network.css'

class Network extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      removeSpinner: false,
      showSpinner: true,
    }
    this.spinner = React.createRef()
  }

  componentDidMount() {
    this.network = this.createNetwork(this.getGraphComponents())
    setTimeout(() => {
      this.setState({ showSpinner: false }, () => {
        setTimeout(() => {
          this.setState({ removeSpinner: true })
        }, 200)
      })
    }, 500)
  }

  componentDidUpdate() {
    this.network.update(this.getGraphComponents())
  }

  getGraphComponents() {
    let edges = []
    let nodeIds = []
    for (const [strength, e] of Object.entries(this.props.dataset.edgeStrength)) {
      if (strength >= this.props.range[0] && strength < this.props.range[1]) {
        edges = edges.concat(e)
      }
    }
    edges.forEach(e => {
      nodeIds.push(e.source)
      nodeIds.push(e.target)
    })
    let nodes = this.props.dataset.nodes.filter(node => {
      return nodeIds.includes(node.id)
    })
    return {nodes, edges}
  }

  createNetwork(dataset) {
    const boundingRect = d3.select('#network').node().getBoundingClientRect()
    const w = boundingRect.width
    const h = boundingRect.height
    const nodeW = 36
    const nodeH = 20.25

    // create svg
    const svg = d3.select("#network")
      .append("svg")
      .attr("width", w)
      .attr("height", h)
      .style('border', '1px solid lightgrey')

    const graph = svg.append('g')

    // create edges
    let edge = graph.append('g')
      .attr("stroke", "lightgrey")
      .attr("stroke-width", .5)
      .selectAll("line")

    // create nodes
    let node = graph.append('g')
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .selectAll('g')

    const simulation = d3.forceSimulation()
      .force("charge", d3.forceManyBody().strength(-500))
      .force("link", d3.forceLink().id(d => d.id).distance(30))
      .force("x", d3.forceX())
      .force("y", d3.forceY())
      .force("center", d3.forceCenter().x(w/2).y(h/2))
      .on("tick", ticked)

    // create title label in top left
    svg.append('text')
      .attr('id', 'title-text')
      .attr('x', 15)
      .attr('y', 26)
      .attr('font-size', 18)
      .attr('font-weight', 'bold')

    // draw edges & nodes with correct placements at each tick
    function ticked() {
      edge.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });
    
      node.attr('transform', function(d) {
        return 'translate(' + d.x + ',' + d.y + ')'
      })
    }

    // define zoom function
    svg.call(d3.zoom()
      .extent([[0, 0], [w, h]])
      .scaleExtent([.2, 5])
      .on("zoom", zoomed));

    function zoomed({transform}) {
      graph.attr('transform', transform)
    }

    // define node drag function
    function dragNode(force) {
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

    // https://observablehq.com/@d3/modifying-a-force-directed-graph
    return {...svg.node(),
      update: function({nodes, edges}) {
        if (!nodes || !edges) return
        const old = new Map(node.data().map(d => [d.id, d]))
        nodes = nodes.map(d => Object.assign(old.get(d.id) || {}, d));
        edges = edges.map(d => Object.assign({}, d));
        node = node
          .data(nodes, d => d.id)
          .join(enter => {
            enter = enter.append('g')
              .classed('node', true)
              .attr('id', d => `g-${d.id}`)
              .on('mouseover', function(evt, d) {
                let filteredEdges = edges.filter(function(e) {
                  return e.source.id === d.id || e.target.id === d.id
                })
                let filteredNodeIds = []
                filteredEdges.forEach(function(e) {
                  svg.select('#edge-' + e.source.id + '-' + e.target.id)
                    .style('stroke', 'orange')
                    .style('stroke-width', 1.5)
                  filteredNodeIds.push(e.source.id)
                  filteredNodeIds.push(e.target.id)
                })
                filteredNodeIds = [...new Set(filteredNodeIds)] // remove dupes
                filteredNodeIds.forEach(function(nodeId) {
                  svg.select(`#rect-${nodeId}`)
                    .style('stroke', 'orange')
                    .style('stroke-width', 1)
                    .attr('transform', 'scale(1.5)')
                  svg.select(`#img-${nodeId}`)
                    .attr('transform', 'scale(1.5)')
                })
                svg.select('#title-text')
                  .text(d.title)
                  .style('opacity', 1)
              })
              .on('mouseout', function(e, d) {
                svg.selectAll('rect.node')
                  .style('stroke', 'lightgrey')
                  .style('stroke-width', .5)
                  .attr('transform', 'scale(1)')
                svg.selectAll('line.edge')
                  .style('stroke-width', .5)
                  .style('stroke', 'lightgrey')
                svg.selectAll('image.node')
                  .attr('transform', 'scale(1)')
                svg.select('#title-text')
                  .style('opacity', 0)
              })
              .call(dragNode(simulation))
            enter.append('clipPath')
              .attr('id', function(d) {
                return 'clip-path-' + d.id
              })
              .classed('node', true)
              .append('rect')
              .attr('width', nodeW)
              .attr('height', nodeH)
              .attr('x', -nodeW/2)
              .attr('y', -nodeH/2)
              .attr('rx', 5)
              .attr('fill', 'white')
            enter.append('image')
              .attr('id', function(d) {
                return 'img-' + d.id
              })
              .classed('node', true)
              .attr('clip-path', function(d) {
                return 'url(#clip-path-' + d.id
              })
              .attr('xlink:href', function(d) { return d.thumbnail;})
              .attr('width', nodeW)
              .attr('height', nodeH)
              .attr('x', -nodeW/2)
              .attr('y', -nodeH/2)
            enter.append('rect')
              .attr('id', d => `rect-${d.id}`)
              .classed('node', true)
              .attr('width', nodeW)
              .attr('height', nodeH)
              .attr('x', -nodeW/2)
              .attr('y', -nodeH/2)
              .attr('rx', 5)
              .style('fill', 'none')
              .style('stroke', 'lightgrey')
              .style('stroke-width', .5)
            return enter;
          })
          
          // .on('click', function(e, d) {
          //   if (e.metaKey) {
          //     window.open('https://youtube.com/watch?v=' + d.yt_id, 'mywindow').focus()
          //   }
          // })

        edge = edge
          .data(edges, d => [d.source, d.target])
          .join("line")
          .classed('edge', true)
          .attr('id', function(d) {
            return 'edge-' + d.source + '-' + d.target
          })
          .classed('edge', true)

        simulation.nodes(nodes);
        simulation.force("link").links(edges);
        simulation.alpha(1).restart();
      }
    }
  }

  render() {
    return (
      <>
        <p>cmd/ctrl-click to open the video in a new tab</p>
        <div id="network" className="d-flex justify-content-center align-items-top" style={{width: '100%', height: '75vh'}}>
          {!this.state.removeSpinner && <div id="spinner" 
            className={'d-flex flex-column ' + (this.state.showSpinner ? 'spinning' : '')}>
            <Spinner animation="border" role="loading network">
              <span className="sr-only">Loading network...</span>
            </Spinner>
            <span className="ml-3">Loading network...</span>
          </div>}
        </div>
      </>
    );
  }
}

export default Network;
