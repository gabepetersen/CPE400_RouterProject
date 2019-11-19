
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

  // TODO - test this function
  getRouter(routerId) {
    this.Graph.forEach(function(row) {
      if (row.Id === routerId) {
        return row[0];
      }
    });

    return null;
  }

  getAdjacentRouters(routerId) {
    return this.__getAdjacentRouters(routerId, false);
  }

  getAliveAdjacentRouters(routerId) {
    return this.__getAdjacentRouters(routerId, true);
  }

  // TODO - test this function
  __getAdjacentRouters(routerId, aliveOnly) {
    let routerIndexes = [];
    let adjacentRouters = [];
    let rowLength = this.Graph[0].length;

    this.Graph.forEach(function(row) {
      if (row.Id === routerId) {
        for (let i = 1; i < rowLength; i++) {
          if (row[i] === 1) {
            routerIndexes.push(i);
          }
        }
      }
    });

    routerIndexes.forEach(function(index) {
      // if toggled to true, only add adjacent routers that are currently alive
      if (aliveOnly && this.Graph[index][0].Alive) {
        adjacentRouters.push(this.Graph[index][0]);
      }
      // otherwise, always add adjacent routers
        else if (!aliveOnly) {
        adjacentRouters.push(this.Graph[index][0]);
      }
    });

    return adjacentRouters;
  }

  // TODO - test this function
  getAllRouterDrawingData() {
    let drawingData = [];

    this.Graph.forEach(function(row) {
      // per row, grab each router's X, Y, and Alive values
      drawingData.push( [row[0].X, row[0].Y, row[0].Alive] );
    });

    return drawingData;
  }

  // TODO - implement & test this function
  getAllEdgeDrawingData(routerWidth, routerHeight) {
    let drawingData = [];
    let xOffset = routerWidth / 2;
    let yOffset = routerHeight / 2;
    let x0, y0, xF, yF;


    // iterate over each row

      // per row, record x0 and y0

      // per router connected to this row's router:

        // add element to drawingData with [x0, y0, adjacentRouter.X, adjacentRouter.Y]

  }
}