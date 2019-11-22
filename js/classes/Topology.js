
/*
  A data structure which is essentially a graph. Methods to manipulate the graph can be put here for simplicity.
 */
class Topology {
  constructor() {
    this.Graph = [];
  }

  hasRouters() {
    return this.Graph.length > 0;
  }

  addRouter(router) {
    let numExistingRouters = this.Graph.length;
    let newRouterRow = [router];

    // init the new row to have all 0s, indicating no edges / connections to other routers
    for (let i = 0; i < numExistingRouters; i++) {
      newRouterRow.push(0);
    }

    this.Graph.push(newRouterRow);

    // update each row to have no edge / connection to the new router
    for (let i = 0; i < this.Graph.length; i++) {
      this.Graph[i].push(0);
    }
  }

  addEdge(fromRouterId, toRouterId) {
    this.__setEdge(fromRouterId, toRouterId, 1);
  }

  removeEdge(fromRouterId, toRouterId) {
    this.__setEdge(fromRouterId, toRouterId, 0);
  }

  /* private function: sets a given edge to either 0 or 1 */
  __setEdge(fromRouterId, toRouterId, value) {
    const ACCEPTED_VALS = [0,1];
    let fromRouterRowNum = 0;
    let toRouterRowNum = 0;

    // protection: cannot accept edges with values other than 0 or 1
    if (ACCEPTED_VALS.indexOf(value) < 0)
      return;

    for (let i = 0; i < this.Graph.length; i++) {
      if (this.Graph[i][0].Id === fromRouterId)
        fromRouterRowNum = i;

      if (this.Graph[i][0].Id === toRouterId)
        toRouterRowNum = i;

      if (fromRouterRowNum !== 0 && toRouterRowNum !== 0)
        break;
    }

    this.Graph[fromRouterRowNum][1 + toRouterRowNum] = value;
    this.Graph[toRouterRowNum][1 + fromRouterRowNum] = value;
  }

  getRouter(routerId) {
    let router = null;

    this.Graph.forEach(function(row) {
      if (row[0].Id === routerId) {
        router = row[0];
      }
    });

    return router;
  }

  getAdjacentRouters(routerId) {
    return this.__getAdjacentRouters(routerId, false);
  }

  getAliveAdjacentRouters(routerId) {
    return this.__getAdjacentRouters(routerId, true);
  }

  __getAdjacentRouters(routerId, aliveOnly) {
    let routerIndexes = [];
    let adjacentRouters = [];
    let rowLength = this.Graph[0].length;
    let index = 0;

    // find the row with the given routerId, and then add the indexes of all edges (denoted by a value of 1)
    this.Graph.forEach(function(row) {
      if (row[0].Id === routerId) {
        for (let i = 1; i < rowLength; i++) {
          if (row[i] === 1) {
            routerIndexes.push(i-1);
          }
        }
      }
    });

    // for each edge, go to the row and get the router at that row
    for(let i = 0; i < routerIndexes.length; i++) {
      index = routerIndexes[i];

      // if toggled to true, only add adjacent routers that are currently alive
      if (aliveOnly && this.Graph[index][0].Alive) {
        adjacentRouters.push(this.Graph[index][0]);
      }
      // otherwise, always add adjacent routers
      else if (!aliveOnly) {
        adjacentRouters.push(this.Graph[index][0]);
      }
    }

    return adjacentRouters;
  }

  getAllRouterDrawingData() {
    let drawingData = [];

    this.Graph.forEach(function(row) {
      // per row, grab each router's X, Y, and Alive values
      drawingData.push(row[0]);
    });

    return drawingData;
  }

  getAllEdgeDrawingData(routerWidth, routerHeight) {
    let drawingData = [];
    let xOffset = routerWidth / 2;
    let yOffset = routerHeight / 2;
    let x1, y1, x2, y2, row, otherRouter;


    // iterate over each row
    for (let i = 0; i < this.Graph.length; i++) {
      row = this.Graph[i];

      x1 = row[0].X + xOffset;
      y1 = row[0].Y + yOffset;

      // start at the diagonal, and find edges
      for (let j = i; j <= this.Graph.length; j++) {
        if (row[j+1] == 1) {
          otherRouter = this.Graph[j][0];
          x2 = otherRouter.X + xOffset;
          y2 = otherRouter.Y + yOffset;
          drawingData.push([x1, y1, x2, y2]);
        }
      }
    }

    return drawingData;
  }
}