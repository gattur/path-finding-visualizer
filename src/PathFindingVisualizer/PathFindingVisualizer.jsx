import React,{Component} from 'react'
import Node from './Node/Node'
import {dijkstra, getNodesInShortestPathOrder} from '../algorithms/dijkstra';
import './PathFindingVisualizer.css'
import { bfs, getNodesInShortestPathOrderBfs } from '../algorithms/bfs';
import { getNodesInShortestPathOrderDfs, dfs } from '../algorithms/dfs';


const START_NODE_ROW = 10;
const START_NODE_COL = 15;
const FINISH_NODE_ROW = 10;
const FINISH_NODE_COL = 35;

export default class PathFindingVisualizer extends Component{
    constructor(props){
        super(props);
        this.state={
            grid:[],
            mouseIsPressed: false,
        };
    }
    componentDidMount() {
        const grid = getInitialGrid();
        this.setState({grid});
      }
    
      handleMouseDown(row, col) {
        const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
        this.setState({grid: newGrid, mouseIsPressed: true});
      }
    
      handleMouseEnter(row, col) {
        if (!this.state.mouseIsPressed) return;
        const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
        this.setState({grid: newGrid});
      }
    
      handleMouseUp() {
        this.setState({mouseIsPressed: false});
      }

      animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
        for (let i = 0; i <= visitedNodesInOrder.length; i++) {
          if (i === visitedNodesInOrder.length) {
            setTimeout(() => {
              this.animateShortestPath(nodesInShortestPathOrder);
            }, 10 * i);
            return;
          }
          setTimeout(() => {
            const node = visitedNodesInOrder[i];
            document.getElementById(`node-${node.row}-${node.col}`).className =
              'node node-visited';
          }, 10 * i);
        }
      }
      
      animateShortestPath(nodesInShortestPathOrder) {
        for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
          setTimeout(() => {
            const node = nodesInShortestPathOrder[i];
            document.getElementById(`node-${node.row}-${node.col}`).className =
              'node node-shortest-path';
          }, 50 * i);
        }
      }
    
      reseter(grid){
        for (const row of grid) {
          for (const node of row) {
            if(node.isStart) document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-start';
            else if(node.isFinish) document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-finish';
            else if(node.isWall) document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-wall';
            else document.getElementById(`node-${node.row}-${node.col}`).className = 'node ';
            
          }
        }
      }

      visualizeDijkstra() {
        const {grid} = this.state;
        const startNode = grid[START_NODE_ROW][START_NODE_COL];
        const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
        const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
        const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
        this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
      }
      
      visualizeBFS() {
        const {grid} = this.state;
        const startNode = grid[START_NODE_ROW][START_NODE_COL];
        const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
        const visitedNodesInOrder = bfs(grid, startNode, finishNode);
        const nodesInShortestPathOrder = getNodesInShortestPathOrderBfs(finishNode);
        this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
      }

      visualizeDFS() {
        const {grid} = this.state;
        const startNode = grid[START_NODE_ROW][START_NODE_COL];
        const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
        const visitedNodesInOrder = dfs(grid, startNode, finishNode);
        const nodesInShortestPathOrder = getNodesInShortestPathOrderDfs(finishNode);
        this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
      }

      render() {
        const {grid, mouseIsPressed} = this.state;
    
        return (
          <>
            <button onClick={() => this.visualizeDijkstra()} className="btn btn-info m-2">Visualize Dijkstra</button>
            <button onClick={() => this.visualizeBFS()} className="btn btn-info m-2"> Visualize BFS </button>
            <button onClick={() => this.visualizeDFS()} className="btn btn-info m-2"> Visualize DFS </button>
            <button onClick={() => this.reseter(grid)} className="btn btn-info m-2"> Reset </button>
            <div className="grid">
              {grid.map((row, rowIdx) => {
                return (
                  <div key={rowIdx}>
                    {row.map((node, nodeIdx) => {
                      const {row, col, isFinish, isStart, isWall} = node;
                      return (
                        <Node
                          key={nodeIdx}
                          col={col}
                          isFinish={isFinish}
                          isStart={isStart}
                          isWall={isWall}
                          mouseIsPressed={mouseIsPressed}
                          onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                          onMouseEnter={(row, col) =>
                            this.handleMouseEnter(row, col)
                          }
                          onMouseUp={() => this.handleMouseUp()}
                          row={row}></Node>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </>
        );
      }
    
}

const getInitialGrid = () => {
    const grid = [];
    for (let row = 0; row < 20; row++) {
      const currentRow = [];
      for (let col = 0; col < 50; col++) {
        currentRow.push(createNode(col, row));
      }
      grid.push(currentRow);
    }
    return grid;
  };

  const createNode = (col, row) => {
    return {
      col,
      row,
      isStart: row === START_NODE_ROW && col === START_NODE_COL,
      isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
      distance: Infinity,
      isVisited: false,
      isWall: false,
      previousNode: null,
    };
  };
  
  const getNewGridWithWallToggled = (grid, row, col) => {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    const newNode = {
      ...node,
      isWall: !node.isWall,
    };
    newGrid[row][col] = newNode;
    return newGrid;
  };
