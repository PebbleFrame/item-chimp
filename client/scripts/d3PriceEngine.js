module.exports = function(pricesArray, query) {

  var width = 500,
      height = 275;

  var fill = d3.scale.category10();

  var nodes = d3.range(100).map(function(i) {
    return {index: i};
  });

  var force = d3.layout.force()
      .nodes(pricesArray)
      .size([width, height])
      .on("tick", tick)
      .start();

  var svg = d3.select(".d3-price-container").append("svg")
      .attr("width", width)
      .attr("height", height);

  var node = svg.selectAll(".node")
      .data(pricesArray)
    .enter().append("circle")
      .attr("class", "node")
      .attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; })
      .attr("r", 8)
      .style("fill", function(d, i) { return fill(i & 1); })
      .style("stroke", function(d, i) { return d3.rgb(fill(i & 1)).darker(2); })
      .call(force.drag)
      .on("mousedown", function() { d3.event.stopPropagation(); });

  svg.style("opacity", 1e-6)
    .transition()
      .duration(1000)
      .style("opacity", 1);

  d3.select("body")
      .on("mousedown", mousedown);

  function tick(e) {

    // Push different nodes in different directions for clustering.
    var k = 6 * e.alpha;
    pricesArray.forEach(function(o, i) {
      o.y += i & 1 ? k : -k;
      o.x += i & 1 ? k : -k;
    });

    node.attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
  }

  function mousedown() {
    pricesArray.forEach(function(o, i) {
      o.x += (Math.random() - .5) * 40;
      o.y += (Math.random() - .5) * 40;
    });
    force.resume();
  }

};
