/* returns {nodes, edges} from:
 *  - dataset {nodes, freqToEdges, edgeToPeople, people}
 *  - range of edge freqs to include
*/
const getRangeGraphComponents = (dataset, range, focusedNode) => {
  let edges = []
  let nodeIds = []
  for (const [freq, edgesWithFreq] of Object.entries(dataset.freqToEdges)) {
    if (freq >= range[0] && freq < range[1]) {
      // replace ID with object
      edges = edges.concat(edgesWithFreq)
    }
  }
  edges.forEach(edge => {
    nodeIds.push(edge.source)
    nodeIds.push(edge.target)
  })
  nodeIds = [...new Set(nodeIds)]
  const collabs = dataset.nodes.filter(node => {
    return nodeIds.includes(node.id)
  })
  console.log({collabs, edges})
  return {collabs, edges}
}

const getCurrentGraphComponents = (dataset, rangeCollabs, rangeEdges, focusedNode) => {
  if (!focusedNode) return {collabs: rangeCollabs, people: [], edges: rangeEdges}
  return getFocusedGraphComponents(dataset, rangeCollabs, rangeEdges, focusedNode)
}

/* returns subset {nodes, edges} connected to given node from:
 *  - nodes of graph
 *  - edges of graph
 *  - focusedNode
*/
const getFocusedGraphComponents = (dataset, rangeCollabs, rangeEdges, focusedNode) => {
  const connectedCollabs = [focusedNode]
  const connectedPeople = []
  const connectedEdges = []
  rangeEdges.forEach(edge => {
    if (edge.source === focusedNode.id || edge.target === focusedNode.id) {
      const personEdges = dataset.personEdges.filter(pe => {
        return pe.edge.source === edge.source
          && pe.edge.target === edge.target
      })
      // find people connected to edge
      personEdges.forEach(pe => {
        const personId = `p-${pe.person}`
        if (!connectedPeople.find(person => person.id === personId)) {
          connectedPeople.push({...dataset.people.find(person => person.id === pe.person), id: personId})
        }
        connectedEdges.push({
          source: personId,
          target: focusedNode.id,
        })
        if (pe.edge.source === focusedNode.id) {
          connectedEdges.push({
            source: personId,
            target: pe.edge.target,
          })
          if (!connectedCollabs.find(collab => collab.id === pe.edge.target)) {
            connectedCollabs.push(rangeCollabs.find(collab => collab.id === pe.edge.target))
          }
        } else if (pe.edge.target === focusedNode.id) {
          connectedEdges.push({
            source: personId,
            target: pe.edge.source,
          })
          if (!connectedCollabs.find(collab => collab.id === pe.edge.source)) {
            connectedCollabs.push(rangeCollabs.find(collab => collab.id === pe.edge.source))
          }
        }
      })
    }
  })
  return {collabs: connectedCollabs, people: connectedPeople, edges: connectedEdges}
}

export { getRangeGraphComponents, getCurrentGraphComponents }
