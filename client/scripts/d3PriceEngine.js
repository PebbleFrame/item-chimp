module.exports = function(pricesArray, query) {

  var width = 500,
      height = 275;

  var fill = d3.scale.category10();

  var nodes = d3.range(100).map(function(i) {
    return {index: i};
  });

  var pricesOnlyArray = pricesArray.map(function(item) {
    return item.salePrice;
  });

  var min = d3.min(pricesOnlyArray);
  var max = d3.max(pricesOnlyArray);

  var radiusScale = d3.scale.linear()
                            .domain([min, max])
                            .range([15, 45]);

  var textScale = d3.scale.linear()
                          .domain([min, max])
                          .range([7, 20]);

  var force = d3.layout.force()
      .nodes(pricesArray)
      .size([width, height])
      .charge(function(d) { return radiusScale(d.salePrice) * -3; })
      .on("tick", tick)
      .start();

  var svg = d3.select(".d3-price-container")
      .attr("width", width)
      .attr("height", height);

  var node = svg.selectAll("g.node")
      .data(pricesArray)
    .enter().append("g")
      .classed("node", true);

  node.append("circle")
      .attr("class", "node")
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("r", function(d) { return radiusScale(d.salePrice); })
      .style("fill", function(d, i) { return fill(i & 1); })
      .style("stroke", function(d, i) { return d3.rgb(fill(i & 1)).darker(2); })
      .call(force.drag)
      .on("mousedown", function() { d3.event.stopPropagation(); });

  node.append("text")
    .attr("x", function(d) { return -radiusScale(d.salePrice) * 0.8; })
    .attr("y", function(d) { return radiusScale(d.salePrice) * 0.17; })
    .attr("font-size", function(d) { return textScale(d.salePrice) + "px"; })
    .attr("fill", "white")
    .text(function(d) { return "$" + d.salePrice; });

  svg.style("opacity", 1e-6)
    .transition()
      .duration(1000)
      .style("opacity", 1);

  d3.select("body")
      .on("mousedown", mousedown);

  function tick(e) {

    // Push different nodes in different directions for clustering.
    var k = 1.5 * e.alpha;
    pricesArray.forEach(function(o, i) {
      o.y += i & 1 ? k : -k;
      o.x += i & 1 ? k : -k;
    });

    svg.selectAll("g.node")
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
  }

  function mousedown() {
    pricesArray.forEach(function(o, i) {
      o.x += (Math.random() - 0.5) * 40;
      o.y += (Math.random() - 0.5) * 40;

    });
    force.resume();
  }

};
