/* gets {nodes, edges} from:
 *  - dataset {nodes, edgeStrength}
 *  - range of edgeStrengths to include
*/
const getGraphComponents = (dataset, range) => {
  let edges = []
  let nodeIds = []
  for (const [strength, edgesWithStrength] of Object.entries(dataset.edgeStrength)) {
    if (strength >= range[0] && strength < range[1]) {
      // replace ID with object
      edges = edges.concat(edgesWithStrength)
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

/* gets subset {nodes, edges} connected to given node from:
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

export { getGraphComponents, getSubgraphFromNode }