import React, { useState, useRef, useEffect } from "react"
import * as d3 from 'd3'
import Spinner from 'react-bootstrap/Spinner'
import './Network.css'
import { getRangeGraphComponents, getCurrentGraphComponents } from '../utils/GraphUtils'

function Network({datasetProp, rangeProp, loadMessage}) {
  const [removeSpinner, setRemoveSpinner] = useState(false)
  const [showSpinner, setShowSpinner] = useState(true)
  const focusedNode = useRef(null)
  const rangeEdges = useRef()
  const rangeCollabs = useRef()
  const edges = useRef()
  const collabs = useRef()
  const people = useRef()
  const dataset = useRef()
  const range = useRef()
  const network = useRef()

  useEffect(() => {
    if (datasetProp && rangeProp) {
      if (network.current) {
        dataset.current = datasetProp
        range.current = rangeProp
        const graphComponents = getRangeGraphComponents(dataset.current, range.current)
        rangeCollabs.current = graphComponents.collabs
        rangeEdges.current = graphComponents.edges
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
    const collabW = 36
    const collabH = 20.25
    const personR = 20

    // create svg
    const svg = d3.select("#network")
      .append("svg")
      .attr("width", w)
      .attr("height", h)

    const graph = svg.append('g')

    // create edges
    let edge = graph.append('g')
      .attr("stroke", "lightgrey")
      .attr("stroke-width", .5)
      .selectAll("line")

    // create people (image labels)
    let person = graph.append('g')
      .selectAll('g')

    // create collab nodes
    let collab = graph.append('g')
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

    // create title label in top left
    const titleText = svg.append('text')
      .attr('id', 'title-text')
      .attr('x', 15)
      .attr('y', 26)

    // draw edges & nodes with correct placements at each tick
    function ticked() {
      edge.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });
    
      collab.attr('transform', d => `translate(${d.x},${d.y})`)

      person.attr('transform', d => `translate(${d.x},${d.y})`)
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
        if (!rangeCollabs.current || !rangeEdges.current) return
        const old = new Map(collab.data().map(d => [d.id, d])); // change? must concat with people nodes
        const currentGraphComponents = getCurrentGraphComponents(dataset.current, rangeCollabs.current, rangeEdges.current, focusedNode.current)
        collabs.current = currentGraphComponents.collabs.map(d => Object.assign(old.get(d.id) || {}, d));
        people.current = currentGraphComponents.people.map(d => Object.assign(old.get(d.id) || {}, d));
        edges.current = currentGraphComponents.edges;
        // create new variable so that edges.current ALWAYS holds {source: nodeId, target: nodeId}
        let edgesToSimulate = edges.current.map(d => Object.assign({}, d));

        collab = collab
          .data(collabs.current, d => d.id)
          .join(enter => {
            enter = enter.append('g')
              .classed('collab', true)
              .attr('id', d => `g-${d.id}`)
              .on('mouseover', function(evt, d) {
                const filteredEdges = edges.current.filter(function(e) {
                  return e.source === d.id || e.target === d.id
                })
                let filteredNodeIds = []
                filteredEdges.forEach(function(e) {
                  svg.select('#edge-' + e.source + '-' + e.target)
                    .classed('active', true)
                  filteredNodeIds.push(e.source)
                  filteredNodeIds.push(e.target)
                })
                filteredNodeIds = [...new Set(filteredNodeIds)] // remove dupes
                filteredNodeIds.forEach(function(nodeId) {
                  svg.select(`#image-${nodeId}`)
                    .classed('active', true)
                  // for collab nodes
                  svg.select(`#rect-${nodeId}`)
                    .classed('active', true)
                  // for person nodes
                  svg.select(`#circle-${nodeId}`)
                    .classed('active', true)
                })
                titleText.text(d.title)
                  .classed('active', true)
              })
              .on('mouseout', function(e, d) {
                svg.selectAll('rect.collab')
                  .classed('active', false)
                svg.selectAll('line.edge')
                  .classed('active', false)
                svg.selectAll('image.collab')
                  .classed('active', false)
                svg.selectAll('image.person')
                  .classed('active', false)
                svg.selectAll('circle.person')
                  .classed('active', false)
                titleText.classed('active', false)
              })
              .on('click', function(e, d) {
                if (e.metaKey || e.ctrlKey) {
                  window.open('https://youtube.com/watch?v=' + d.yt_id, 'mywindow').focus()
                  return
                }
                if (focusedNode.current && focusedNode.current.id === d.id) {
                  console.log('deselect')
                  // defocus clicked node
                  focusedNode.current = null
                  // unfix clicked node
                  d.fx = null
                  d.fx = null
                  // change force center
                  simulation.force('center', d3.forceCenter().x(w/2).y(h/2))
                } else {
                  if (focusedNode.current) {
                    console.log('change select')
                    // unfix currently selected node
                    focusedNode.current.fx = null
                    focusedNode.current.fy = null
                  } else {
                    console.log('new select')
                  }
                  // focus clicked node
                  focusedNode.current = d
                  // fix clicked node
                  d.fx = d.x
                  d.fy = d.y
                  // change force center
                  simulation.force('center', d3.forceCenter().x(d.fx).y(d.fy))
                }
                network.current.update()
              })
              .call(dragNode(simulation))
            enter.append('clipPath')
              .attr('id', function(d) {
                return 'clip-path-' + d.id
              })
              .classed('collab', true)
              .append('rect')
              .attr('width', collabW)
              .attr('height', collabH)
              .attr('x', -collabW/2)
              .attr('y', -collabH/2)
              .attr('rx', 5)
            enter.append('image')
              .attr('id', function(d) {
                return 'image-' + d.id
              })
              .classed('collab', true)
              .attr('clip-path', d => `url(#clip-path-${d.id})`)
              .attr('xlink:href', function(d) { return d.thumbnail;})
              .attr('width', collabW)
              .attr('height', collabH)
              .attr('x', -collabW/2)
              .attr('y', -collabH/2)
            enter.append('rect')
              .attr('id', d => `rect-${d.id}`)
              .classed('collab', true)
              .attr('width', collabW)
              .attr('height', collabH)
              .attr('x', -collabW/2)
              .attr('y', -collabH/2)
              .attr('rx', 5)
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

        person = person
          .data(people.current, d => d.id)
          .join(enter => {
            enter = enter.append('g')
              .classed('person', true)
            enter.append('clipPath')
              .attr('id', d => `clip-path-${d.id}`)
              .classed('person', true)
              .append('circle')
              .attr('r', personR/2)
              .attr('x', -personR/2)
              .attr('y', -personR/2)
            enter.append('image')
              .attr('id', d => `image-${d.id}`)
              .classed('person', true)
              .attr('width', personR)
              .attr('height', personR)
              .attr('x', -personR/2)
              .attr('y', -personR/2)
              .attr('xlink:href', d => d.thumbnail)
              .attr('clip-path', d => `url(#clip-path-${d.id})`)
            enter.append('circle')
              .attr('id', d => `circle-${d.id}`)
              .classed('person', true)
              .attr('r', personR/2)
              .attr('x', -personR/2)
              .attr('y', -personR/2)
            return enter
          })

        simulation.nodes(collabs.current.concat(people.current));
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
