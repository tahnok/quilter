// ------------- initialization -------------------
jQuery(function(){
  loadHandlebars();
  loadColors();
  x = -1;
  y = -1;

  registerListeners();
  makeTable(4,4);
});

loadHandlebars = function() {
  tableTemplate = Handlebars.compile($("#table").html());
  cellTemplate = Handlebars.compile($("#cell").html());
  colorTemplate = Handlebars.compile($("#colorTemplate").html());

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
  $("#color-select").change(function(){
    color = getColor();
    setCell();
  });

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
  var color_id = findByColor(getColor());
  colorCell(cell, colors[color_id]);
  cell.data('cid', color_id);
  highlightCell(cell);
}

colorCell = function(cell, color) {
  cell.css('background-color', color.color);
}

findCell = function(x,y) {
  return $("#table-container").find("[data-x='" + x + "'][data-y='" + y + "']");
}

// ------------- colors -------------------

getColor = function() {
  return $("input[name=color]:checked", "#color-form").val();
}

findByColor = function(colorString) {
  for(var i = 0; i < colors.length; i++) {
    if(colors[i].color === colorString){
      return i;
    }
  }
  return -1;
}

addColor = function() {
  var _color = makeColor()
  colors.push(_color);
  addColorToSelect(_color);
  if(color === -1){
    color = _color
  }
  localStorage['quilter.colors'] = JSON.stringify(colors);
}

makeColor = function() {
  var name = $("#color-name").val();
  var color = $("#color-val").val();
  return { 'color' : color, 'name': name }
}

loadColors = function() {
  var savedColors = localStorage['quilter.colors'];
  if(typeof savedColors !== 'undefined'){
    colors = JSON.parse(savedColors);
    for( c in colors ) {
      addColorToSelect(colors[c]);
    }
    color = colors[0];
  } else {
    colors = [];
    color = -1;
  }
}

addColorToSelect = function(_color) {
  $("#color-form").append(colorTemplate({color: _color.color, name: _color.name}));
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
    var cid = $(elm).data("cid");
    if(results[cid]){
      results[cid] = results[cid] + 1;
    } else {
      results[cid] = 1;
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
      name = colors[id].name;
    }
    resultString = resultString + name + ": " + results[result] + " ";
  }
  return resultString;

}
