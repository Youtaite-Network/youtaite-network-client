/* returns {nodes, edges} from:
 *  - dataset {nodes, freqToEdges, edgeToPeople, people}
 *  - range of edge freqs to include
*/
const getGraphComponents = (dataset, range) => {
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
  const nodes = dataset.nodes.filter(node => {
    return nodeIds.includes(node.id)
  })
  return {nodes, edges}
}

/* returns subset {nodes, edges} connected to given node from:
 *  - nodes of graph
 *  - edges of graph
 *  - centerNode
*/
const getSubgraphFromNode = (nodes, edges, centerNode) => {
  // find all edges with node as source or target + nodes that node is connected to
  const connectedNodes = [centerNode]
  const connectedEdges = []
  edges.forEach(edge => {
    if (edge.source === centerNode.id) {
      connectedNodes.push(nodes.find(node => node.id === edge.target))
      connectedEdges.push(edge)
    } else if (edge.target === centerNode.id) {
      connectedNodes.push(nodes.find(node => node.id === edge.source))
      connectedEdges.push(edge)
    }
  })
  return {nodes: connectedNodes, edges: connectedEdges}
}

/* returns [{person, edge, i, l}] from:
 *  - people: array of person objects {id, name, misc_id, id_type, thumbnail}
 *  - edges: array of edge objects {source, target}; source < target
 *  - edgesToPeople: {edge: [people ids]}
*/
const getLabelData = (edges, nodes, people, personEdges, focusedNode) => {
  if (!focusedNode) return []
  return personEdges.filter(pe => edges.find(edge => edge.source === pe.edge.source && edge.target === pe.edge.target))
    .map(pe => {
      return {
        ...pe,
        person: people.find(person => person.id === pe.person),
        edge: {
          source: nodes.find(node => node.id === pe.edge.source),
          target: nodes.find(node => node.id === pe.edge.target),
        },
      }
    })
}

export { getGraphComponents, getSubgraphFromNode, getLabelData }
