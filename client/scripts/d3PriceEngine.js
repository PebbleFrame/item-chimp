module.exports = function(pricesArray, query) {

  // Set the size of the D3 price chart
  var width = 500;
  var height = 275;

  // Used to color bubbles
  // i & 1 --> two colors, i & 2 --> three colors, etc.
  var fill = d3.scale.category10();

  // Used to find the minimum and maximum price for d3.scale.linear
  var pricesOnlyArray = pricesArray.map(function(item) {
    return item.salePrice;
  });

  // Find the minimum and maximum price for all products listed in the query results
  var min = d3.min(pricesOnlyArray);
  var max = d3.max(pricesOnlyArray);

  // Scale for circle radii. Size ranges from 15px to 45px
  var radiusScale = d3.scale.linear()
                            .domain([min, max])
                            .range([15, 45]);

  // Scale for font-size in circles. Size ranges from 7px to 20px
  var textScale = d3.scale.linear()
                          .domain([min, max])
                          .range([7, 20]);

  // Initializes D3 "force", which provides animation for the bubbles
  var force = d3.layout.force()
      .nodes(pricesArray)
      .size([width, height])
      // "charge" is how strong the attraction between bubbles are
      // We use radiusScale for greater repulsion for larger bubbles
      .charge(function(d) { return radiusScale(d.salePrice) * -3.5; })
      .on("tick", tick)
      .start();

  // Select the SVG element in the ".d3-price-container"
  var svg = d3.select(".price-chart")
      .attr("width", width)
      .attr("height", height);

  // Appends "Walmart" and "Best Buy" key to the chart
  // Text color represents the bubbles the store is associated with
  var storesLegend = svg.selectAll("g.stores")
      .data(['Walmart', 'Best Buy'])
      .enter().append("text")
      .attr("x", "400")
      .attr("y", function(d,i) { return (i+1) * 30; })
      .attr("font-size", "17px")
      .attr("font-weight", "bold")
      .attr("fill", function(d,i) { return fill(i & 1); })
      .text(function(d) { return d; });

  // Create a node for each product in pricesArray
  // Use "g" to group things appended to each node
  var node = svg.selectAll("g.node")
      .data(pricesArray)
      .enter().append("g")
      .classed("node", true)
      // Allows bubbles to be dragged
      .call(force.drag)
      // Prevents bubbles from scattering on drag event
      .on("mousedown", function() { d3.event.stopPropagation(); });

  // Create a circle/bubble for each product/node
  // Size and color are used for data visualization
  node.append("circle")
      .attr("class", "node")
      .attr("cx", 0)
      .attr("cy", 0)
      // The higher a product's price, the larger the bubble
      .attr("r", function(d) { return radiusScale(d.salePrice); })
      // Creates two colors for the two halves of pricesArray
      .style("fill", function(d, i) { return fill(i & 1); })
      .style("stroke", function(d, i) { return d3.rgb(fill(i & 1)).darker(2); })

  // Appends the price to each bubble
  node.append("text")
    // Adjust the x and y position of the price to be close to the middle
    .attr("x", function(d) { return -radiusScale(d.salePrice) * 0.8; })
    .attr("y", function(d) { return radiusScale(d.salePrice) * 0.17; })
    // Adjust the font size based on the size of the bubble
    .attr("font-size", function(d) { return textScale(d.salePrice) + "px"; })
    .attr("fill", "white")
    .text(function(d) { return "$" + d.salePrice; });

  svg.style("opacity", 1e-6)
    .transition()
      .duration(1000)
      .style("opacity", 1);

  // Scatters bubbles on click
  d3.select(".d3-price-container")
      .on("mousedown", mousedown);

  // Initialize the tooltip popup
  tooltipSetup();

  // D3 "force" uses this to animate the bubbles
  function tick(e) {

    // Push different nodes in different directions for clustering.
    var k = 1.5 * e.alpha;
    pricesArray.forEach(function(o, i) {
      o.y += i & 1 ? k : -k;
      o.x += i & 1 ? k : -k;
    });

    // Sets the x and y attributes of the "g" node for D3's "force"
    svg.selectAll("g.node")
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
  }

  // Function that scatters bubbles on click event
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

    // Append tooltip popup div to container
    var tooltip = d3.select(".d3-price-container")
      .append("div")
      .style("width", tooltipWidth)
      .style("height", tooltipHeight)
      .classed("hoverbox", true);

    // Append "product-name" div to tooltip div
    tooltip.append('div')
      .classed("product-name", true);

    // Select all products in the array
    var nodes = svg.selectAll("g.node");

    // On mouseover event over a bubble, display the tooltip popup that displays the product name
    nodes.on('mouseover', function(d) {
      var mouseLoc = d3.mouse(this.parentNode);

      // Set position and styling of tooltip div
      tooltip
            .style("display", "block")
            .style("left", (mouseLoc[0]-170)+"px")
            .style("top", (mouseLoc[1]-80)+"px")
            .style("font-size", "13px")
            .transition()
            .duration(200)
            .style('opacity', 1);

      // Set the text in the tooltip popup to be the product name associated with the price in the bubble
      tooltip.select(".product-name")
        .text(d.name);
    });

    // On mouseout event, tooltip div disappears
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
