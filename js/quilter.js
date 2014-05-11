// ------------- initialization -------------------
jQuery(function(){
  loadHandlebars();
  loadSquares();
  x = -1;
  y = -1;

  registerListeners();
  makeTable(4,4);
});

loadHandlebars = function() {
  tableTemplate = Handlebars.compile($("#table").html());
  cellTemplate = Handlebars.compile($("#cell").html());
  squareTempate = Handlebars.compile($("#squareTempate").html());

  Handlebars.registerHelper('table', function(x,y,  options) {
    var out = "<table>";
    for(var i=0, l=x; i<l; i++) {
      out = out + "<tr>";
      for(var j=0, m=y; j<m; j++) {
        out = out + cellTemplate({x: i, y: j});
      }
      out = out + "<tr/>";
    }
    return out + "</table>";
  });
}

registerListeners = function() {
  $("body").click(function(e) {
    var target = $(e.target);
    if(!$("#table-container").has(target).length) {
      clearCell(findCell(x,y));
      x = -1;
      y = -1;
    }});
}

// ------------- cells -------------------

clearCell = function(cell) {
  cell.css('border', '1px solid black');
}

cellClicked = function(that) {
  if(x !== -1 && y !== -1) {
    clearCell(findCell(x,y));
  }
  var cell = $(that);
  x = cell.data("x");
  y = cell.data("y");
  setCell(cell);
}

highlightCell = function(cell) {
  cell.css('border', '2px solid red');
}

setCell = function(cell) {
  var square_id = findIdByColor(getColor());
  colorCell(cell, squares[square_id]);
  cell.data('sid', square_id);
  highlightCell(cell);
}

colorCell = function(cell, square) {
  cell.css('background-color', square.color);
}

findCell = function(x,y) {
  return $("#table-container").find("[data-x='" + x + "'][data-y='" + y + "']");
}

// ------------- squares -------------------

getColor = function() {
  return $("input[name=color]:checked", "#square-form").val();
}

findIdByColor = function(colorString) {
  for(var i = 0; i < squares.length; i++) {
    if(squares[i].color === colorString){
      return i;
    }
  }
  return -1;
}

addSquare = function() {
  var _square = makeSquare()
  squares.push(_square);
  addColorToSelect(_square);
  if(currentColor === -1){
    currentColor = _square
  }
  localStorage['quilter.squares'] = JSON.stringify(squares);
}

makeSquare = function() {
  var name = $("#square-name").val();
  var color = $("#square-color").val();
  return { 'color' : color, 'name': name }
}

loadSquares = function() {
  var savedSquares = localStorage['quilter.squares'];
  if(typeof savedSquares !== 'undefined'){
    squares = JSON.parse(savedSquares);
    for( s in squares ) {
      addColorToSelect(squares[s]);
    }
    currentColor = squares[0];
  } else {
    squares = [];
    currentColor = -1;
  }
}

addColorToSelect = function(square) {
  $("#square-form").append(squareTempate({color: square.color, name: square.name}));
}

// ------------- table -------------------

makeTableButton = function() {
  var x = parseInt($("#x-size").val());
  var y = parseInt($("#y-size").val());
  makeTable(x, y);
};

makeTable = function(xsize, ysize) {
  $("#table-container").html(tableTemplate({x: xsize, y: ysize}));
};

// ------------- stats -------------------

countCells = function() {
  var results = {}
  $("#table-container td").each(function(index, elm){
    var sid = $(elm).data("sid");
    if(results[sid]){
      results[sid] = results[sid] + 1;
    } else {
      results[sid] = 1;
    }
  });
  $("#stats").html(showResults(results));
}

showResults = function(results) {
  var resultString = "";
  for(result in results) {
    var name = "";
    var id = parseInt(result);
    if(id === -1) {
      name = "unset";
    } else {
      name = squares[id].name;
    }
    resultString = resultString + name + ": " + results[result] + " ";
  }
  return resultString;

}
