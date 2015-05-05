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
      .charge(function(d) { return radiusScale(d.salePrice) * -3.5; })
      .on("tick", tick)
      .start();

  var svg = d3.select(".price-chart")
      .attr("width", width)
      .attr("height", height);

  var stores = svg.selectAll("g.stores")
      .data(['Walmart', 'Best Buy'])
      .enter().append("text")
      .attr("x", "390")
      .attr("y", function(d,i) { return (i+1) * 30; })
      .attr("font-size", "17px")
      .attr("fill", function(d,i) { return fill(i & 1); })
      .text(function(d) { return d; });

  svg.append("text")
    .attr("x", "30")
    .attr("y", "30")
    .attr("font-size", "17px")
    .text("Prices for " + query);

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

  d3.select(".d3-price-container")
      .on("mousedown", mousedown);

  tooltipSetup();

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

  function tooltipSetup() {
    // tooltip vars
    tooltipOffset = 10;
    tooltipWidth = 220;
    tooltipHeight = 105;

    tooltip = d3.select(".d3-price-container")
      .append("div")
      .style("width", tooltipWidth)
      .style("height", tooltipHeight)
      .classed("hoverbox", true);

    tooltip.append('div')
      .classed("product-name", true);

    var nodes = svg.selectAll("g.node");

    nodes.on('mouseover', function(d) {
      console.log('mouseover!', d);
      var mouseLoc = d3.mouse(this.parentNode);
      if (mouseLoc[0] + tooltipOffset + tooltipWidth > width) {
        mouseLoc[0] = mouseLoc[0] - tooltipOffset*2 - tooltipWidth;
      }
      if (mouseLoc[1] + tooltipOffset + tooltipHeight > height) {
        mouseLoc[1] = mouseLoc[1] - tooltipOffset*2 - tooltipHeight;
      }
      tooltip
            .style("display", "block")
            .style("left", (mouseLoc[0]+tooltipOffset)+"px")
            .style("top", (mouseLoc[1]+tooltipOffset)+"px")
            .transition()
            .duration(200)
            .style('opacity', 1);
      tooltip.select(".product-name")
        .text(d.name);
    });

    nodes.on('mouseout', function(d) {
      tooltip.transition()
        .duration(200)
        .style('opacity', 0)
        .each('end', function () {
          tooltip.style("display", "none");
        });
    });
  }

};
