jQuery(function(){
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

  loadColors();
  x = -1;
  y = -1;

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
  makeTable(4,4);
});

clearCell = function(cell) {
  cell.css('border', '1px solid black');
}

cellClicked = function(that) {
  if(x !== -1 && y !== -1) {
    clearCell(findCell(x,y));
  }
  x = $(that).data("x");
  y = $(that).data("y");
  setCell();
  findCell(x, y).css('border', '2px solid red');
}

setCell = function() {
  var cell = findCell(x,y);
  var color_id = findByColor(getColor());
  colorCell(cell, colors[color_id]);
  cell.data('cid', color_id);
}

findByColor = function(colorString) {
  for(var i = 0; i < colors.length; i++) {
    if(colors[i].color === colorString){
      return i;
    }
  }
  return -1;
}

getColor = function() {
  return $("input[name=color]:checked", "#color-form").val();
}

colorCell = function(cell, color) {
  cell.css('background-color', color.color);
}

findCell = function(x,y) {
  return $("#table-container").find("[data-x='" + x + "'][data-y='" + y + "']");
}

makeTableButton = function() {
  var x = parseInt($("#x-size").val());
  var y = parseInt($("#y-size").val());
  makeTable(x, y);
};

makeTable = function(xsize, ysize) {
  $("#table-container").html(tableTemplate({x: xsize, y: ysize}));
};

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

addColorToSelect = function(_color) {
  $("#color-form").append(colorTemplate({color: _color.color, name: _color.name}));
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
    console.log(name);
    console.log(results[result]);
    resultString = resultString + name + ": " + results[result] + " ";
  }
  return resultString;

}
