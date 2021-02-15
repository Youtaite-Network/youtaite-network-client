import React, { useEffect, useState } from 'react'
import * as d3 from 'd3'
import Button from 'react-bootstrap/Button'
import { MdSettings } from 'react-icons/md'

function NetworkSettings({maxStrength, range, setRange}) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    // create slider
    const w = 200
    const h = 40
    const padX = 20
    const padY = 5
    const svg = d3.select('#slider')
      .append('svg')
      .attr('width', w)
      .attr('height', h)
    // https://observablehq.com/@sarah37/snapping-range-slider-with-d3-brush
    const slider = sliderSnap(svg, [1, maxStrength], {x: padX, y: padY, width: w - padX*2, height: h - padY*2})
    d3.select('#slider-event-handler')
      .on('change', function(event) {
        setRange(slider.getRange())
      })
  }, [maxStrength, setRange])

  const sliderSnap = (svg, [min, max], {x, y, width, height}) => {
    const range = [min, max + 1]

    // create x scale
    const xScale = d3.scaleLinear()
      .domain(range)  // data space
      .range([x, x + width]);  // display space
    
    // create svg and translated g
    const g = svg.append('g').classed('slider', true)
    
    // draw background lines
    g.append('g').selectAll('line')
      .data(d3.range(range[0], range[1]+1))
      .enter()
      .append('line')
      .attr('x1', d => xScale(d)).attr('x2', d => xScale(d))
      .attr('y1', y).attr('y2', y+height)
      .style('stroke', '#ccc')
    
    // labels
    const labelL = g.append('text')
      .attr('id', 'labelleft')
      .attr('x', x)
      .attr('y', y + height + 5)
      .text(range[0])

    const labelR = g.append('text')
      .attr('id', 'labelright')
      .attr('x', x)
      .attr('y', y + height + 5)
      .text(range[1])

    // define brush
    const brush = d3.brushX()
      .extent([[x,y], [x+width, y+height]])
      .on('brush', function(event) {
        const s = event.selection;
        // update and move labels
        labelL.attr('x', s[0])
          .text(Math.round(xScale.invert(s[0])))
        labelR.attr('x', s[1])
          .text(Math.round(xScale.invert(s[1])) - 1)
        // move brush handles      
        handle.attr("display", null)
          .attr("transform", function(d, i) { 
            return `translate(${[ s[i], y - height / 4]})`; 
          });
      })
      .on('end', function(event) {
        if (!event.sourceEvent) return;
        const d0 = event.selection.map(xScale.invert);
        const d1 = d0.map(Math.round)
        d3.select(this).transition().call(event.target.move, d1.map(xScale))
        // update view
        d3.select('#slider-event-handler').dispatch('change');
      })

    // append brush to g
    const gBrush = g.append("g")
        .attr("class", "brush")
        .call(brush)

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
    gBrush.call(brush.move, range.map(xScale))
    const getRange = function() {
      return d3.brushSelection(gBrush.node()).map(d => Math.round(xScale.invert(d)))
    }
    return {...svg.node(), getRange: getRange}
  }

  const toggleShow = e => {
    setShow(!show)
  }

  return (
    <>
      <Button variant="outline-secondary" className="py-1 px-2" style={{lineHeight: 1}} onClick={toggleShow}>
        <h5 className="m-0"><MdSettings size="1.5rem" className="mt-n1 mr-1" />Settings</h5>
      </Button>
      <div id="network-settings" className={show ? '' : 'd-none'}>
        <div id="slider">
          <strong>Edge Strength</strong>
        </div>
        <div id="slider-event-handler" className="d-none"></div>
      </div>
    </>
  )
}

export default NetworkSettings