import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  /**
  * Shuffles array in place. (Thanks to https://stackoverflow.com/a/6274381)
  * @param {Array} a items An array containing the items.
  */
  shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      x = a[i];
      a[i] = a[j];
      a[j] = x;
    }
    return a;
  }

  generateBoardData() {
    var numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    this.shuffle(numbers);

    var area = [];
    for (var i=0; i<3; i++) {
      var riga = [];
      for (var j=0; j<3; j++) {
        riga.push({
          x : i,
          y : j,
          n : numbers.pop()
        });
      }
      area.push(riga);
    }
    return area;
  }

  render() {
    return (
      <div className="App">
      <header className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
      <h1 className="App-title">React sliding puzzle</h1>
      </header>
      <Board boardData={ this.generateBoardData() }/>
            <p>Image credits: vector redraw by <a href="https://commons.wikimedia.org/wiki/User:Editor_at_Large" title="User:Editor at Large">Editor at Large</a>, original png by <a href="https://ja.wikipedia.org/wiki/User:Kasuga~jawiki" class="extiw" title="ja:User:Kasuga~jawiki">Kasuga~jawiki</a> [<a href="http://www.gnu.org/copyleft/fdl.html">GFDL</a>, <a href="http://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA-3.0</a> or <a href="https://creativecommons.org/licenses/by-sa/2.5">CC BY-SA 2.5</a>]
            </p>
      </div>
      );
  }
}

class Board extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      move: 0,
      end: false
    };

    this.handleClick = this.handleClick.bind(this);
  }

  isFinished() {
    var res = [].concat(...this.props.boardData);
    var c = 0;
    for (var el=0; el<res.length-1; el++) {
      if (res[el].n === (el+1)) c += 1;
    }

    if (c === 8)
      this.setState({
        end: true
      });
    else
      this.setState({
        end: false
      });
  }

  cambia(a, b) {
    var c = this.props.boardData[a.x][a.y].n
    this.props.boardData[a.x][a.y].n = this.props.boardData[b.x][b.y].n
    this.props.boardData[b.x][b.y].n = c

    this.setState({
      move: this.state.move + 1
    });

    this.isFinished();
  }

  spostaColonna(target, zero) {
    // distanza 1 o 2
    var dist = zero.y - target.y;
    console.log(dist);

    // se distanza 1 sposta
    if (Math.abs(dist) === 1) {
      console.log("Sposto di " + dist)
      this.cambia(target, zero)
    }

    if (dist === -2) {
      // target su di uno
      this.cambia({ x : target.x, y : target.y-1 }, zero)
      this.cambia(target, { x : target.x, y : target.y-1 })
    }

    if (dist === 2) {
      this.cambia({ x : target.x, y : target.y+1 }, zero)
      this.cambia(target, { x : target.x, y : target.y+1 })
    }
  }

  spostaRiga(target, zero) {
    // distanza dallo zero (zona vuota)
    var dist = zero.x - target.x;
    console.log(dist);

    if (Math.abs(dist) === 1) {
      console.log("Sposto di " + dist)
      this.cambia(target, zero)
    }

    if (dist === -2) {
      // target su di uno
      this.cambia({ x : target.x-1, y : target.y }, zero)
      this.cambia(target, { x : target.x-1, y : target.y })
    }

    if (dist === 2) {
      this.cambia({ x : target.x+1, y : target.y }, zero)
      this.cambia(target, { x : target.x+1, y : target.y })
    }
  }

  findingNeighbors(i, j) {
    var riga = i;
    var colonna = j;

    // riga ferma scorri colonna
    for (var c = 0; c < 3; c++) {
      if (c !== colonna && this.props.boardData[riga][c].n === 0) {
        var zero = this.props.boardData[riga][c];
        var target = { x:i, y:j };
        this.spostaColonna(target, zero);
      }
    }

    // colonna ferma scorri riga
    for (var r = 0; r < 3; r++) {
      if (r !== riga && this.props.boardData[r][colonna].n === 0) {
        var zero = this.props.boardData[r][colonna];
        var target = { x:i, y:j };
        this.spostaRiga(target, zero);
      }
    }
  }

  handleClick(e, pos) {
    e.preventDefault();
    this.findingNeighbors(pos.x, pos.y);
  }

  preventPulltToRefresh(e) {
    e.preventDefault();
  }

  renderSquare (x, y) {
    const { boardData } = this.props;

    const img = require('./images/wp_' + boardData[x][y].n + '.png');

    const style = { 
      top : x*100 + "px" , 
      left : y*100 + "px",
      backgroundImage : "url('" + img + "')",
      backgroundSize: "cover"
    }

    return (
      <div id={ x + "_" + y} 
      className="square" 
      draggable="true"
      onTouchStart={ ((e)=> this.preventPulltToRefresh (e) }
      onTouchEnd={ ((e)=> this.handleClick(e, { x: x, y: y})) }
      onClick={ ((e)=> this.handleClick(e, { x: x, y: y})) }
      style={ style }>
      { boardData[x][y].n === 0 ? null : boardData[x][y].n }
      </div>
    );
  }

  render() {
    return (
      <div className="container">
        <div className="board">
          {this.renderSquare(0, 0)}
          {this.renderSquare(0, 1)}
          {this.renderSquare(0, 2)}

          {this.renderSquare(1, 0)}
          {this.renderSquare(1, 1)}
          {this.renderSquare(1, 2)}
       
          {this.renderSquare(2, 0)}
          {this.renderSquare(2, 1)}
          {this.renderSquare(2, 2)}
        </div>
      </div>
    );
  }
}

export default App;
