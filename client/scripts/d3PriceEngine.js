
// ------ CONFIG DATA ---------

var d3PriceEngine = {};

d3PriceEngine.initValues = function (width, height) {
  // colors key
  d3PriceEngine.colors = ["steelblue", "darkorange", "darkseagreen"];
  d3PriceEngine.prodKey = [];

  // Data for stars legend at bottom
  d3PriceEngine.legendData = ['0 stars', '1 star', '3 stars', '4 stars', '5 stars'];

  // overall chart vars
  d3PriceEngine.width = width || 600;
  d3PriceEngine.height = height || 300;

  // tooltip vars
  d3PriceEngine.ttOffset = 10;
  d3PriceEngine.ttWidth = 220;
  d3PriceEngine.ttHeight = 105;

  // x scale based on star rating
  d3PriceEngine.x = d3.scale.linear()
            .domain([0, 6])
            .range([0, d3PriceEngine.width]);

  // another scale, narrower range for foci (don't want foci at edge)
  d3PriceEngine.fociX = d3.scale.linear()
            .domain([0, 6])
            .range([100, d3PriceEngine.width-50]);

  // Create foci (1 per 0.5 star spaced out horizontally across chart)
  var fociGen = function (numFoci, x) {
    var results = [];
    for (var i = 0; i < numFoci; i++) {
      results.push({x: d3PriceEngine.fociX(i+1)/2, y: 150});
    }
    return results;
  };

  d3PriceEngine.foci = fociGen(11, d3PriceEngine.x);
};

// ---------------------------------


// ------ PREP DATA RECEIVED FROM OUTSIDE ---------
d3PriceEngine.populateWMData = function (rawData, prodNum) {
  var results = [];
  for (var i = 0; i < rawData.length; i++) {
    var obj = {};
    obj.reviewLength = rawData[i].reviewText.length;
    obj.dotSize = obj.reviewLength/50 + 20;
    obj.stars = +rawData[i].overallRating.rating;
    obj.prodKey = d3PriceEngine.prodKey[prodNum];
    obj.username = rawData[i].reviewer;
    obj.reviewTitle = rawData[i].title.slice(0,24) + "..."
    obj.review = rawData[i].reviewText;
    obj.reviewStart = obj.review.slice(0, 110) + "...";
    results.push(obj);
  }
  return results;
};

d3PriceEngine.populateBBData = function (rawData, prodNum) {
  var results = [];
  for (var i = 0; i < rawData.length; i++) {
    var obj = {};
    obj.reviewLength = rawData[i].comment.length;
    obj.dotSize = obj.reviewLength/50 + 20;
    obj.stars = +rawData[i].rating;
    obj.prodKey = d3PriceEngine.prodKey[prodNum];
    obj.username = rawData[i].reviewer.name;
    obj.reviewTitle = rawData[i].title.slice(0,24) + "..."
    obj.review = rawData[i].comment;
    obj.reviewStart = obj.review.slice(0, 110) + "...";
    results.push(obj);
  }
  return results;
};
// ---------------------------------


// ------ MAIN CHART CREATION FUNCTION ---------

d3PriceEngine.create = function (el, width, height, products) {

  d3PriceEngine.initValues(width, height);

  // populate chart with review data
  d3PriceEngine.data = [];
  for (var i = 0; i < products.length; i++) {
    d3PriceEngine.prodKey[i] = {name: products[i].name, color: d3PriceEngine.colors[i], source: products[i].source};
    if (products[i].source === 'Walmart') {
      d3PriceEngine.data = d3PriceEngine.data.concat(d3PriceEngine.populateWMData(products[i].reviews,i));
    } else if (products[i].source === 'Best Buy') {
      d3PriceEngine.data = d3PriceEngine.data.concat(d3PriceEngine.populateBBData(products[i].reviews,i));
    }
  }

  // chart overall dimensions
  this.chart = d3.select(".chart")
    .attr("width", d3PriceEngine.width)
    .attr("height", d3PriceEngine.height);

  // create a "g" element for every review (will contain a circle and a text obj)
  var circle = this.chart.selectAll("g.node")
      .data(d3PriceEngine.data)
    .enter().append("g")
      .classed("node", true)
      .attr("transform", function(d, i) { 
        return "translate(" + (d3PriceEngine.x(d.stars)+ d.dotSize) + ", 50)";
      });

  // create a circle element for every g element
  circle.append("circle")
    .attr("cx", 0)
    .attr("cy", 0)
    .attr("r", function(d) { return d.dotSize/2; })
    .style("fill", function(d) { return d.prodKey.color; })
    .style("stroke", "white")
    .style("stroke-width", 2)
    .style("stroke-opacity", 0.5);

  // create a text element for every g
  circle.append("text")
    .attr("x", 0)
    .attr("y", 0)
    .attr("dy", ".35em")
    .text(function(d) {return d.stars;});

  // Bottom legend (# of stars)
  var legend = this.chart.selectAll("g.legend")
    .data(d3PriceEngine.legendData)
    .enter().append("g")
    .classed("legend", true)
    .attr("transform", "translate(0, " + (d3PriceEngine.height-25) + ")");

  legend.append("text")
    .attr("x", function(d, i) { return d3PriceEngine.x((i*1.25)+0.3); })
    .attr("y", 0)
    .text(function(d) {return d});

  // Product legend
  var productLegend = this.chart.selectAll("g.productLegend")
    .data(d3PriceEngine.prodKey)
    .enter().append("g")
    .classed("productLegend", true)
    .attr("transform", "translate(20,10)");

  productLegend.append("rect")
    .attr("x", 0)
    .attr("y", function(d,i) { return i*25; })
    .attr("width", 25)
    .attr("height", 25)
    .style("fill", function (d) { return d.color; });

  productLegend.append("text")
    .attr("x", 35)
    .attr("y", function (d,i) { return i*25 + 13; })
    .attr("dy", "0.35em")
    .text(function(d) { 
      if (d.name.length > 40) {
        return d.name.slice(0,40) + "..." + " at " + d.source;
      } else {
        return d.name + " at " + d.source;
      }
    });

  tooltipSetup();
  forceInit();
};
// ---------------------------------


// ------ TOOLTIP DEF ---------

function tooltipSetup() {
  tooltip = d3.select(".d3-container")
    .append("div")
    .style("width", d3PriceEngine.ttWidth + "px")
    .style("height", d3PriceEngine.ttHeight + "px")
    .classed("hoverbox", true);

  tooltip.append('div')
    .classed("username", true);

  tooltip.append('div')
    .classed("reviewTitle", true);

  tooltip.append('div')
    .classed("reviewText", true);

  var nodes = d3PriceEngine.chart.selectAll("g.node");

  nodes.on('mouseover', function(d) {
    var mouseLoc = d3.mouse(this.parentNode);
    if (mouseLoc[0] + d3PriceEngine.ttOffset + d3PriceEngine.ttWidth > d3PriceEngine.width) {
      mouseLoc[0] = mouseLoc[0] - d3PriceEngine.ttOffset*2 - d3PriceEngine.ttWidth;
    }
    if (mouseLoc[1] + d3PriceEngine.ttOffset + d3PriceEngine.ttHeight > d3PriceEngine.height) {
      mouseLoc[1] = mouseLoc[1] - d3PriceEngine.ttOffset*2 - d3PriceEngine.ttHeight;
    }
    tooltip
          .style("display", "block")
          .style("left", (mouseLoc[0]+d3PriceEngine.ttOffset)+"px")
          .style("top", (mouseLoc[1]+d3PriceEngine.ttOffset)+"px")
          .transition()
          .duration(200)
          .style('opacity', 1);
    tooltip.select(".username")
      .text(d.username + " on " + d.prodKey.name);
    tooltip.select(".reviewTitle")
      .text(d.reviewTitle);
    tooltip.select(".reviewText")
      .text(d.reviewStart);
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

// // ---------------------------------


// ------ FORCE DEFINITION AND START---------

function forceInit() {
  var force = d3.layout.force()
    .gravity(0)
    .links([])
    .nodes(d3PriceEngine.data)
    .charge(function(d) { return d.dotSize * -1.5; })
    .size([d3PriceEngine.width, d3PriceEngine.height]);

  force.start();

  force.on("tick", function(e) {
    var k = .1 * e.alpha;

    d3PriceEngine.data.forEach(function(o,i) {
      o.y += (d3PriceEngine.foci[o.stars*2].y - o.y) * k;
      o.x += (d3PriceEngine.foci[o.stars*2].x - o.x) * k;
      d3PriceEngine.chart.selectAll("g.node")
        .attr("transform", function(d) { 
          return "translate(" + d.x + "," + d.y + ")";
        });
    });
  });
}

// ---------------------------------


module.exports = d3PriceEngine;


