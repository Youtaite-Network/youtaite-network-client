import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import Spinner from 'react-bootstrap/Spinner';
import CollabAutosuggest from './CollabAutosuggest';
import { getRangeGraphComponents, getCurrentGraphComponents } from '../utils/GraphUtils';
import './Network.css';

function Network({
  datasetProp, rangeProp, dragProp, loadMessage,
}) {
  const [removeSpinner, setRemoveSpinner] = useState(false);
  const [showSpinner, setShowSpinner] = useState(true);
  const focusedNode = useRef();
  const rangeEdges = useRef();
  const rangeCollabs = useRef();
  const edges = useRef();
  const collabs = useRef();
  const people = useRef();
  const dataset = useRef();
  const range = useRef();
  const network = useRef();
  const drag = useRef(true);

  const createNetwork = () => {
    const boundingRect = d3.select('#network').node().getBoundingClientRect();
    const w = boundingRect.width;
    const h = boundingRect.height;
    const collabW = 36;
    const collabH = 20.25;
    const personR = 20;

    // create svg
    const svg = d3.select('#network')
      .append('svg')
      .attr('width', w)
      .attr('height', h);

    const graph = svg.append('g');

    // create edges
    let edge = graph.append('g')
      .attr('stroke', 'lightgrey')
      .attr('stroke-width', 0.5)
      .selectAll('line');

    // create people (image labels)
    let person = graph.append('g')
      .selectAll('g');

    // create collab nodes
    let collab = graph.append('g')
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5)
      .selectAll('g');

    // draw edges & nodes with correct placements at each tick
    function ticked() {
      edge.attr('x1', (d) => d.source.x)
        .attr('y1', (d) => d.source.y)
        .attr('x2', (d) => d.target.x)
        .attr('y2', (d) => d.target.y);

      collab.attr('transform', (d) => `translate(${d.x},${d.y})`);

      person.attr('transform', (d) => `translate(${d.x},${d.y})`);
    }

    // define zoom function
    function zoomed({ transform }) {
      graph.attr('transform', transform);
    }

    const simulation = d3.forceSimulation()
      .force('charge', d3.forceManyBody().strength(-600))
      .force('link', d3.forceLink().id((d) => d.id).distance(50))
      .force('x', d3.forceX())
      .force('y', d3.forceY())
      .force('center', d3.forceCenter().x(w / 2).y(h / 2))
      .on('tick', ticked);

    // define node drag function
    function dragNode() {
      function dragStarted(e, d) {
        if (!e.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x; // eslint-disable-line no-param-reassign
        d.fy = d.y; // eslint-disable-line no-param-reassign
      }
      function dragging(e, d) {
        d.fx = e.x; // eslint-disable-line no-param-reassign
        d.fy = e.y; // eslint-disable-line no-param-reassign
      }
      function dragEnded(e, d) {
        if (!e.active) simulation.alphaTarget(0);
        if (!focusedNode.current || focusedNode.current.id !== d.id) {
          d.fx = null; // eslint-disable-line no-param-reassign
          d.fy = null; // eslint-disable-line no-param-reassign
        } else {
          simulation.force('center', d3.forceCenter().x(d.x).y(d.y));
        }
      }
      return d3.drag()
        .on('start', dragStarted)
        .on('drag', dragging)
        .on('end', dragEnded);
    }

    // create title label in top left
    const titleText = svg.append('text')
      .attr('id', 'title-text')
      .attr('x', 15)
      .attr('y', 26);

    const zoom = d3.zoom()
      .extent([[0, 0], [w, h]])
      .scaleExtent([0.2, 5])
      .on('zoom', zoomed);
    svg.call(zoom);

    // https://observablehq.com/@d3/modifying-a-force-directed-graph
    // NOTE: using refs to prevent stale props/state within event handlers
    return {
      ...svg.node(),
      update() {
        if (!rangeCollabs.current || !rangeEdges.current) return;
        const old = new Map(collab.data().concat(person.data()).map((d) => [d.id, d]));
        const currentGraphComponents = getCurrentGraphComponents(
          dataset.current, rangeCollabs.current, rangeEdges.current, focusedNode.current,
        );
        collabs.current = currentGraphComponents.collabs
          .map((d) => Object.assign(old.get(d.id) || {}, d));
        people.current = currentGraphComponents.people
          .map((d) => Object.assign(old.get(d.id) || {}, d));
        edges.current = currentGraphComponents.edges;
        // create new variable so that edges.current ALWAYS holds {source: nodeId, target: nodeId}
        const edgesToSimulate = edges.current.map((d) => ({ ...d }));

        collab = collab
          .data(collabs.current, (d) => d.id)
          .join((enter) => {
            enter = enter.append('g') // eslint-disable-line no-param-reassign
              .classed('collab', true)
              .attr('id', (d) => `g-${d.id}`)
              .on('mouseover', (evt, d) => {
                titleText.text(d.title)
                  .classed('active', true)
                  .append('tspan')
                  .attr('x', 15)
                  .attr('dy', '1.5em')
                  .text('Cmd/ctrl-click to open in a new tab')
                  .append('tspan')
                  .attr('x', 15)
                  .attr('dy', '1.2em')
                  .text(() => {
                    if (focusedNode.current && focusedNode.current.id === d.id) {
                      return 'Click to show entire graph';
                    }
                    return 'Click to see connected people & collabs';
                  });
                // find edges
                const filteredEdges = edges.current
                  .filter((e) => e.source === d.id || e.target === d.id);
                // find nodes
                const filteredNodeIds = filteredEdges.map((e) => {
                  if (e.source === d.id) {
                    return e.target;
                  }
                  return e.source;
                });
                filteredNodeIds.push(d.id);
                // add class active to edges & nodes
                filteredEdges.forEach((e) => {
                  svg.select(`#edge-${e.source}-${e.target}`)
                    .classed('active', true);
                });
                filteredNodeIds.forEach((nodeId) => {
                  svg.select(`#g-${nodeId}`)
                    .classed('active', true);
                });
              })
              .on('mouseout', () => {
                svg.selectAll('g.active') // nodes
                  .classed('active', false);
                svg.selectAll('line.active') // edges
                  .classed('active', false);
                titleText.classed('active', false); // title label
              })
              .on('click', (e, d) => {
                if (e.metaKey || e.ctrlKey) {
                  window.open(`https://youtube.com/watch?v=${d.yt_id}`, d.id).focus();
                  return;
                }
                if (focusedNode.current && focusedNode.current.id === d.id) {
                  network.current.unfocusNode(d);
                } else {
                  network.current.focusNode(d);
                }
                network.current.update();
              });
            enter.append('clipPath')
              .attr('id', (d) => `clip-path-${d.id}`)
              .classed('collab', true)
              .append('rect')
              .attr('width', collabW)
              .attr('height', collabH)
              .attr('x', -collabW / 2)
              .attr('y', -collabH / 2)
              .attr('rx', 5);
            enter.append('image')
              .classed('collab', true)
              .attr('clip-path', (d) => `url(#clip-path-${d.id})`)
              .attr('xlink:href', (d) => d.thumbnail)
              .attr('width', collabW)
              .attr('height', collabH)
              .attr('x', -collabW / 2)
              .attr('y', -collabH / 2);
            enter.append('rect')
              .classed('collab', true)
              .attr('width', collabW)
              .attr('height', collabH)
              .attr('x', -collabW / 2)
              .attr('y', -collabH / 2)
              .attr('rx', 5);
            return enter;
          });

        edge = edge
          .data(edgesToSimulate, (d) => [d.source, d.target])
          .join('line')
          .classed('edge', true)
          .attr('id', (d) => `edge-${d.source}-${d.target}`)
          .classed('edge', true);

        person = person
          .data(people.current, (d) => d.id)
          .join((enter) => {
            enter = enter.append('g') // eslint-disable-line no-param-reassign
              .classed('person', true)
              .attr('id', (d) => `g-${d.id}`)
              .on('mouseover', (evt, d) => {
                titleText.text(d.name)
                  .classed('active', true)
                  .append('tspan')
                  .attr('x', 15)
                  .attr('dy', '1.5em')
                  .text('Cmd/ctrl-click to open in a new tab');
                // find connected edges/nodes
                const filteredEdges = edges.current
                  .filter((e) => e.source === d.id || e.target === d.id);
                const filteredNodeIds = filteredEdges.map((e) => {
                  if (e.source === d.id) {
                    return e.target;
                  }
                  return e.source;
                });
                filteredNodeIds.push(d.id);
                // assign active class to connected edges/nodes
                filteredEdges.forEach((e) => {
                  svg.select(`#edge-${e.source}-${e.target}`)
                    .classed('active', true);
                });
                filteredNodeIds.forEach((nodeId) => {
                  svg.select(`#g-${nodeId}`)
                    .classed('active', true);
                });
              })
              .on('mouseout', () => {
                svg.selectAll('g.active')
                  .classed('active', false);
                svg.selectAll('line.active')
                  .classed('active', false);
                titleText.classed('active', false); // title label
              })
              .on('click', (e, d) => {
                if (e.metaKey || e.ctrlKey) {
                  if (d.id_type === 'yt') {
                    window.open(`https://youtube.com/channel/${d.misc_id}`, d.id).focus();
                  } else if (d.id_type === 'tw') {
                    window.open(`https://twitter.com/i/user/${d.misc_id}`, d.id).focus();
                  } else if (d.id_type !== 'no_link') { // soundcloud, ig, etc; haven't linked these APIs yet
                    window.open(d.misc_id, d.id).focus();
                  }
                }
              });
            enter.append('clipPath')
              .attr('id', (d) => `clip-path-${d.id}`)
              .classed('person', true)
              .append('circle')
              .attr('r', personR / 2)
              .attr('x', -personR / 2)
              .attr('y', -personR / 2);
            enter.append('image')
              .classed('person', true)
              .attr('width', personR)
              .attr('height', personR)
              .attr('x', -personR / 2)
              .attr('y', -personR / 2)
              .attr('xlink:href', (d) => d.thumbnail)
              .attr('clip-path', (d) => `url(#clip-path-${d.id})`);
            enter.append('circle')
              .classed('person', true)
              .attr('r', personR / 2)
              .attr('x', -personR / 2)
              .attr('y', -personR / 2);
            return enter;
          });

        simulation.nodes(collabs.current.concat(people.current));
        simulation.force('link').links(edgesToSimulate);
        simulation.alpha(1).restart();
        network.current.setDrag(drag.current);
      },

      setDrag(enabled) {
        if (enabled) {
          collab.call(dragNode(simulation));
          person.call(dragNode(simulation));
        } else {
          collab.on('mousedown.drag', null)
            .on('touchstart.drag', null);
          person.on('mousedown.drag', null)
            .on('touchstart.drag', null);
        }
      },

      focusNode(node) {
        if (focusedNode.current) {
          // unfix currently selected node
          focusedNode.current.fx = null;
          focusedNode.current.fy = null;
        }
        // focus/fix clicked node
        focusedNode.current = node;
        node.fx = node.x; // eslint-disable-line no-param-reassign
        node.fy = node.y; // eslint-disable-line no-param-reassign
        // change force center
        simulation.force('center', d3.forceCenter().x(node.fx).y(node.fy));
        network.current.update();
      },

      unfocusNode(node) {
        // defocus & unfix clicked node
        focusedNode.current = null;
        node.fx = null; // eslint-disable-line no-param-reassign
        node.fx = null; // eslint-disable-line no-param-reassign
        // change force center
        simulation.force('center', d3.forceCenter().x(w / 2).y(h / 2));
        network.current.update();
      },

      centerTo({ x, y }) {
        const currScale = d3.zoomTransform(graph.node()).k;
        const transform = d3.zoomIdentity
          .scale(currScale)
          .translate(-x + w / (2 * currScale), -y + h / (2 * currScale));
        svg.call(zoom.transform, transform);
      },
    };
  };

  useEffect(() => {
    if (datasetProp && rangeProp) {
      drag.current = dragProp;
      if (network.current) {
        if (datasetProp !== dataset.current
          || rangeProp[0] !== range.current[0]
          || rangeProp[1] !== range.current[1]) {
          dataset.current = datasetProp;
          range.current = rangeProp;
          const graphComponents = getRangeGraphComponents(dataset.current, range.current);
          rangeCollabs.current = graphComponents.collabs;
          rangeEdges.current = graphComponents.edges;
          network.current.update();
        } else if (dragProp !== drag) {
          drag.current = dragProp;
          network.current.setDrag(dragProp);
        }
      } else {
        network.current = createNetwork();
        setTimeout(() => {
          setShowSpinner(false);
          setTimeout(() => {
            setRemoveSpinner(true);
          }, 200);
        }, 500);
      }
    }
  });

  const handleSuggestionSelected = (e, { suggestion }) => {
    const node = collabs.current.find((collab) => collab.id === suggestion.id)
      || { ...suggestion, x: 0, y: 0 };
    network.current.focusNode(node);
    network.current.centerTo({ x: node.x, y: node.y });
  };

  return (
    <>
      <CollabAutosuggest
        allCollabs={dataset.current ? dataset.current.nodes : []}
        handleSuggestionSelected={handleSuggestionSelected}
      />
      <div id="network" className="d-flex justify-content-center align-items-top">
        {!removeSpinner
          && (
          <div
            id="spinner"
            className={`d-flex flex-column ${showSpinner ? 'spinning' : ''}`}
          >
            <Spinner animation="border" role="status">
              <span className="sr-only">Loading network...</span>
            </Spinner>
            <span className="ml-3">{loadMessage}</span>
          </div>
          )}
      </div>
    </>
  );
}

Network.propTypes = {
  datasetProp: PropTypes.shape({
    nodes: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      thumbnail: PropTypes.string.isRequired,
    })).isRequired,
    freqToEdges: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.shape({
      source: PropTypes.number.isRequired,
      target: PropTypes.number.isRequired,
    }))).isRequired,
    personEdges: PropTypes.arrayOf(PropTypes.shape({
      person: PropTypes.number.isRequired,
      edge: PropTypes.shape({
        source: PropTypes.number.isRequired,
        target: PropTypes.number.isRequired,
      }).isRequired,
      i: PropTypes.number.isRequired,
      l: PropTypes.number.isRequired,
    })).isRequired,
    people: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      thumbnail: PropTypes.string.isRequired,
    })),
  }),
  rangeProp: PropTypes.arrayOf(PropTypes.number),
  dragProp: PropTypes.bool.isRequired,
  loadMessage: PropTypes.string.isRequired,
};

Network.defaultProps = {
  datasetProp: null,
  rangeProp: null,
};

export default Network;
