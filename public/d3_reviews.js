//var data = [4, 8, 15, 16, 23, 42];

var dataGen = function () {
  results = [];
  for (var i = 0; i < 10; i++) {
    var obj = {};
    obj.numLines = Math.floor(Math.random() * 49) + 5;
    obj.stars = Math.floor(Math.random() * 10)/2;
    obj.site = Math.floor(Math.random() * 3);
    results.push(obj);
  }
  return results;
};

var storeCode = {
  0: "steelblue",
  1: "gold",
  2: "navy"
};

var data = dataGen();

var width = 420,
  height = 300,
  yOffset = 50;

// var x = d3.scale.linear()
//           .domain([0, d3.sum(data)])
//           .range([0, width]);

// x based on star rating
var x = d3.scale.linear()
          .domain([0, 6])
          .range([0, width]);

var chart = d3.select(".chart")
  .attr("width", width)
  .attr("height", height);

var circle = chart.selectAll("g")
    .data(data)
  .enter().append("g")
    .attr("transform", function(d, i) { 
      // var transX = 0;
      // for (var j = 0; j < i; j++) {
      //   transX += data[j];
      // }
      // transX += d/2;
      return "translate(" + (x(d.stars)+ d.numLines) + "," + yOffset + ")";
    });

circle.append("circle")
  .attr("cx", 0)
  .attr("cy", 0)
  .attr("r", function(d) { return d.numLines/2; })
  .style("fill", function(d) { return storeCode[d.site]; });

circle.append("text")
  .attr("x", 0)
  .attr("y", 0)
  .attr("dy", ".35em")
  .text(function(d) {return d.stars;});
