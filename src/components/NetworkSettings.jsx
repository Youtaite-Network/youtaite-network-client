import React, { useEffect, useState } from 'react'
import * as d3 from 'd3'
import Button from 'react-bootstrap/Button'
import Tooltip from 'react-bootstrap/Tooltip'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Form from 'react-bootstrap/Form'
import Table from 'react-bootstrap/Table'
import { MdInfo } from 'react-icons/md'
import './NetworkSettings.css'

function NetworkSettings({initialRange, setRange, initialDrag, setDrag}) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (!initialRange) return
    // create slider
    const w = 200
    const h = 40
    const padX = 15
    const padY = 5
    const svg = d3.select('#slider')
      .append('svg')
      .attr('width', w)
      .attr('height', h)
    // https://observablehq.com/@sarah37/snapping-range-slider-with-d3-brush
    sliderSnap(svg, [1, initialRange[1], initialRange[0]], {x: padX, y: padY, width: w - padX*2, height: h - padY*2})
    d3.select('#slider-event-handler')
      .on('change', function(event) {
        setRange(event.detail.range)
      })
  }, [initialRange, setRange])

  const sliderSnap = (svg, [min, max, start], {x, y, width, height}) => {
    const range = [min, max]

    // create x scale
    const xScale = d3.scaleLinear()
      .domain(range)  // data space
      .range([x, x + width])  // display space
      .clamp(true); // clamp to range
    
    // create svg and translated g
    const g = svg.append('g').classed('slider', true)
    
    // draw background lines
    g.append('g').selectAll('line')
      .data(d3.range(range[0], range[1]))
      .enter()
      .append('line')
      .attr('x1', d => xScale(d)).attr('x2', d => xScale(d))
      .attr('y1', y).attr('y2', y+height)
      .style('stroke', '#ccc')

    let selection = null

    // define brush
    const brush = d3.brushX()
      .extent([[x,y], [x+width, y+height]])
      .on('brush', function(event) {
        if (event.sourceEvent && event.sourceEvent.type === "brush") return
        selection = event.selection;
        // update and move labels
        labelL.attr('x', selection[0])
          .text(Math.round(xScale.invert(selection[0])))
        labelR.attr('x', selection[1])
          .text(Math.round(xScale.invert(selection[1])))
        // move brush handles      
        handle.attr("display", null)
          .attr("transform", function(d, i) { 
            return `translate(${[selection[i], y - height / 4]})`; 
          });
      })
      .on('end', function(event) {
        if (!event.sourceEvent) return;
        const s = selection ? selection : [event.sourceEvent.offsetX, event.sourceEvent.offsetX];
        const d0 = s.map(xScale.invert);
        const d1 = d0.map(Math.round)
        d3.select(this).transition().call(event.target.move, d1.map(xScale))
        // update view
        d3.select('#slider-event-handler').dispatch('change', {detail: {range: d1}});
      })

    // append brush to g
    const gBrush = g.append("g")
        .attr("class", "brush")
        .call(brush)

    // labels
    const labelL = g.append('text')
      .attr('id', 'labelleft')
      .attr('x', x)
      .attr('y', y + height + 4)
      .text(range[0])

    const labelR = g.append('text')
      .attr('id', 'labelright')
      .attr('x', x)
      .attr('y', y + height + 4)
      .text(range[1])

    // add brush handles (from https://bl.ocks.org/Fil/2d43867ba1f36a05459c7113c7f6f98a)
    const brushResizePath = function(d) {
        const e = +(d.type === "e")
        const x = e ? 1 : -1
        const y = height / 2
        return "M" + (.5 * x) + "," + y + "A6,6 0 0 " + e + " " + (6.5 * x) + "," + (y + 6) + "V" + (2 * y - 6) +
          "A6,6 0 0 " + e + " " + (.5 * x) + "," + (2 * y) + "ZM" + (2.5 * x) + "," + (y + 8) + "V" + (2 * y - 8) +
          "M" + (4.5 * x) + "," + (y + 8) + "V" + (2 * y - 8);
    }

    const handle = gBrush.selectAll(".handle--custom")
      .data([{type: "w"}, {type: "e"}])
      .enter().append("path")
      .attr("class", "handle--custom")
      .attr("stroke", "#000")
      .attr("fill", '#eee')
      .attr("cursor", "ew-resize")
      .attr("d", brushResizePath);
      
    // override default behaviour - clicking outside of the selected area 
    // will select a small piece there rather than deselecting everything
    // https://bl.ocks.org/mbostock/6498000
    gBrush.selectAll(".overlay")
      .each(function(d) { d.type = "selection"; })
    
    // select entire range
    gBrush.call(brush.move, [start, max].map(xScale))
    return svg.node()
  }

  const toggleShow = e => {
    setShow(!show)
  }

  const handleDragChange = e => {
    setDrag(e.target.checked)
  }

  const renderTooltip = props => (
    <Tooltip id="button-tooltip" {...props}>
      Edge strength of X means that X people in common between 2 collabs becomes an edge.
    </Tooltip>
  )

  return (
    <>
      <Button variant="light" onClick={toggleShow}>{show ? 'Hide' : 'Show'} settings</Button>
      <div id="slider-event-handler" className="d-none"></div>
      <Table id="network-settings" size="sm" className={show ? '' : 'd-none'} borderless>
        <tbody>
          <tr className="d-flex">
            <td>
              <OverlayTrigger overlay={renderTooltip}>
                <Button variant="link"><MdInfo className="mt-n1" /></Button>
              </OverlayTrigger>
              <strong style={{position: 'relative', top: '2px'}}>Edge Strength:</strong>
            </td>
            <td>
              <div id="slider"></div>
            </td>
          </tr>
          <tr>
            <td>
              <Form.Check
                className="ml-1"
                type="switch"
                id="drag-enabled"
                label=<strong>Draggable nodes</strong>
                onChange={handleDragChange}
                defaultChecked={initialDrag} />
            </td>
          </tr>
        </tbody>
      </Table>
    </>
  )
}

export default NetworkSettings