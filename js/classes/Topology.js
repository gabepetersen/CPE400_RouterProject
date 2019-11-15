
/*
  A data structure which is essentially a graph. Methods to manipulate the graph can be put here for simplicity.
 */
class Topology {
  constructor() {
    this.graph = [];
  }

  addRouter(router) {
    let numExistingRouters = this.graph.length;
    let newRouterRow = [router];

    // init the new row to have all 0s, indicating no edges / connections to other routers
    for (let i = 0; i < numExistingRouters; i++) {
      newRouterRow.push(0);
    }

    this.graph.push(newRouterRow);

    // update each row to have no edge / connection to the new router
    for (let i = 0; i < this.graph.length; i++) {
      this.graph[i].push(0);
    }
  }

  removeRouter() {
    // TODO - do we want to support removing routers? Not tough to implement
  }

  addEdge(fromRouterId, toRouterId) {
    this.__setEdge(fromRouterId, toRouterId, 1);
  }

  removeEdge(fromRouterId, toRouterId) {
    this.__setEdge(fromRouterId, toRouterId, 0);
  }

  __setEdge(fromRouterId, toRouterId, value) {
    const ACCEPTED_VALS = [0,1];
    let fromRouterRowNum = 0;
    let toRouterRowNum = 0;

    // protection: cannot accept edges with values other than 0 or 1
    if (ACCEPTED_VALS.indexOf(value) < 0)
      return;

    for (let i = 0; i < this.graph.length; i++) {
      if (this.graph[i][0].id === fromRouterId)
        fromRouterRowNum = i;

      if (this.graph[i][0].id === toRouterId)
        toRouterRowNum = i;

      if (fromRouterRowNum !== 0 && toRouterRowNum !== 0)
        break;
    }

    this.graph[fromRouterRowNum][1 + toRouterRowNum] = value;
    this.graph[toRouterRowNum][1 + fromRouterRowNum] = value;
  }

  getAllEdges() {
    // TODO - return all edges from above the diagonal (no reason to draw all edges below diagonal; would be mirrored)
  }
}