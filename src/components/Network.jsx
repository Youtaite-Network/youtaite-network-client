import React, { useState, useRef, useEffect } from "react"
import * as d3 from 'd3'
import Spinner from 'react-bootstrap/Spinner'
import './Network.css'
import { getGraphComponents, getSubgraphFromNode } from '../Utils/GraphUtils'

function Network({datasetProp, rangeProp, loadMessage}) {
  const [removeSpinner, setRemoveSpinner] = useState(false)
  const [showSpinner, setShowSpinner] = useState(true)
  const focusedNode = useRef(null)
  const edges = useRef()
  const nodes = useRef()
  const dataset = useRef()
  const range = useRef()
  const network = useRef()

  useEffect(() => {
    if (datasetProp && rangeProp) {
      if (network.current) {
        dataset.current = datasetProp
        range.current = rangeProp
        const graphComponents = getGraphComponents(dataset.current, range.current)
        if (focusedNode.current) {
          const subgraphComponents = getSubgraphFromNode(graphComponents.nodes, graphComponents.edges, focusedNode.current)
          nodes.current = subgraphComponents.nodes
          edges.current = subgraphComponents.edges
        } else {
          nodes.current = graphComponents.nodes
          edges.current = graphComponents.edges
        }
        network.current.update()
      } else {
        network.current = createNetwork()
        setTimeout(() => {
          setShowSpinner(false)
          setTimeout(() => {
            setRemoveSpinner(true)
          }, 200)
        }, 500)
      }
    }
  })

  const createNetwork = () => {
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
      .force("charge", d3.forceManyBody().strength(-1000))
      .force("link", d3.forceLink().id(d => d.id).distance(50))
      .force("x", d3.forceX())
      .force("y", d3.forceY())
      .force("center", d3.forceCenter().x(w/2).y(h/2))
      .on("tick", ticked)

    const defaultForceLinkStrength = simulation.force('link').strength()

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
        if (!focusedNode.current || (focusedNode.current && focusedNode.current.id !== d.id)) {
          d.fx = null;
          d.fy = null;
        } else if (focusedNode.current && focusedNode.current.id === d.id) {
          simulation.force('center', d3.forceCenter().x(d.x).y(d.y))
        }
      }
      return d3.drag()
        .on('start', dragStarted)
        .on('drag', dragging)
        .on('end', dragEnded)
    }

    // https://observablehq.com/@d3/modifying-a-force-directed-graph
    // NOTE: using refs to prevent stale props/state within event handlers
    return {...svg.node(),
      update: function() {
        if (!nodes.current || !edges.current) return
        const old = new Map(node.data().map(d => [d.id, d]))
        nodes.current = nodes.current.map(d => Object.assign(old.get(d.id) || {}, d));
        // create new variable so that edges.current ALWAYS holds {source: nodeId, target: nodeId}
        let edgesToSimulate = edges.current.map(d => Object.assign({}, d));
        node = node
          .data(nodes.current, d => d.id)
          .join(enter => {
            enter = enter.append('g')
              .classed('node', true)
              .attr('id', d => `g-${d.id}`)
              .on('mouseover', function(evt, d) {
                const filteredEdges = edges.current.filter(function(e) {
                  return e.source === d.id || e.target === d.id
                })
                let filteredNodeIds = []
                filteredEdges.forEach(function(e) {
                  svg.select('#edge-' + e.source + '-' + e.target)
                    .style('stroke', 'orange')
                    .style('stroke-width', 1.5)
                  filteredNodeIds.push(e.source)
                  filteredNodeIds.push(e.target)
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
              .on('click', function(e, d) {
                if (e.metaKey || e.ctrlKey) {
                  window.open('https://youtube.com/watch?v=' + d.yt_id, 'mywindow').focus()
                  return
                }
                let graphComponents = null
                if (focusedNode.current && focusedNode.current.id === d.id) {
                  console.log('deselect')
                  // defocus clicked node
                  focusedNode.current = null
                  // unfix clicked node
                  d.fx = null
                  d.fx = null
                  // change force center
                  simulation.force('center', d3.forceCenter().x(w/2).y(h/2))
                  simulation.force("link").strength(defaultForceLinkStrength)
                  graphComponents = getGraphComponents(dataset.current, range.current)
                } else {
                  if (focusedNode.current) {
                    console.log('change select')
                    // unfix currently selected node
                    focusedNode.current.fx = null
                    focusedNode.current.fy = null
                    // update with clicked node + directly linked collabs
                    const mainComponents = getGraphComponents(dataset.current, range.current)
                    graphComponents = getSubgraphFromNode(mainComponents.nodes, mainComponents.edges, d)
                    // display people
                  } else {
                    console.log('new select')
                    // update with clicked node + directly linked collabs
                    graphComponents = getSubgraphFromNode(nodes.current, edges.current, d)
                    // display people
                  }
                  // focus clicked node
                  focusedNode.current = d
                  // fix clicked node
                  d.fx = d.x
                  d.fy = d.y
                  // change force center
                  simulation.force('center', d3.forceCenter().x(d.fx).y(d.fy))
                  simulation.force("link").strength(0)
                }
                nodes.current = graphComponents.nodes
                edges.current = graphComponents.edges
                network.current.update()
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

        edge = edge
          .data(edgesToSimulate, d => [d.source, d.target])
          .join("line")
          .classed('edge', true)
          .attr('id', function(d) {
            return 'edge-' + d.source + '-' + d.target
          })
          .classed('edge', true)
        simulation.nodes(nodes.current);
        simulation.force("link").links(edgesToSimulate);
        simulation.alpha(1).restart();
      }
    }
  }

  return (
    <>
      <p className="mb-1">Cmd/ctrl-click to open the collab in a new tab. Click a collab to see collabs it is connected to. Zoom, pan, drag enabled.</p>
      <div id="network" className="d-flex justify-content-center align-items-top">
        {!removeSpinner && <div id="spinner" 
          className={'d-flex flex-column ' + (showSpinner ? 'spinning' : '')}>
          <Spinner animation="border" role="loading network">
            <span className="sr-only">Loading network...</span>
          </Spinner>
          <span className="ml-3">{loadMessage}</span>
        </div>}
      </div>
    </>
  );
}

export default Network;
