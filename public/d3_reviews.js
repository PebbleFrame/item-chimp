
// ------ CONFIG DATA ---------

var d3Engine = {};


var prodKey = [
  {name: "Amazon", color: "steelblue"},
  {name: "WalMart", color: "darkorange"},
  {name: "Best Buy", color: "darkseagreen"},
];

d3Engine.legendData = ['0 stars', '1 star', '3 stars', '4 stars', '5 stars'];

// chart vars
d3Engine.width = 600;
d3Engine.height = 300;

// tooltip vars
d3Engine.ttOffset = 10;
d3Engine.ttWidth = 220;
d3Engine.ttHeight = 105;

// x based on star rating
d3Engine.x = d3.scale.linear()
          .domain([0, 6])
          .range([0, d3Engine.width]);

// narrower range for foci (don't want foci at edge)
d3Engine.fociX = d3.scale.linear()
          .domain([0, 6])
          .range([100, d3Engine.width-50]);

var fociGen = function (numFoci, x) {
  var results = [];
  for (var i = 0; i < numFoci; i++) {
    results.push({x: d3Engine.fociX(i+1)/2, y: 150});
  }
  return results;
};

d3Engine.foci = fociGen(11, d3Engine.x);

// ---------------------------------


// ------ PREP DATA RECEIVED FROM OUTSIDE ---------
d3Engine.populateWMData = function (rawData, prodNum) {
  var results = [];
  for (var i = 0; i < rawData.length; i++) {
    var obj = {};
    obj.reviewLength = rawData[i].reviewText.length;
    obj.dotSize = obj.reviewLength/50 + 20;
    obj.stars = +rawData[i].overallRating.rating;
    obj.prodKey = prodKey[prodNum];
    obj.username = rawData[i].reviewer;
    obj.reviewTitle = rawData[i].title.slice(0,24) + "..."
    obj.review = rawData[i].reviewText;
    obj.reviewStart = obj.review.slice(0, 110) + "...";
    results.push(obj);
  }
  return results;
};
// ---------------------------------


// ------ CHART COMPONENTS ---------

d3Engine.create = function (el, wmData, state) {

  d3Engine.data = [];
  d3Engine.data = d3Engine.data.concat(d3Engine.populateWMData(wmData,0));

  this.chart = d3.select(".chart")
    .attr("width", d3Engine.width)
    .attr("height", d3Engine.height);

  var circle = this.chart.selectAll("g.node")
      .data(d3Engine.data)
    .enter().append("g")
      .classed("node", true)
      .attr("transform", function(d, i) { 
        return "translate(" + (d3Engine.x(d.stars)+ d.dotSize) + ", 50)";
      });

  circle.append("circle")
    .attr("cx", 0)
    .attr("cy", 0)
    .attr("r", function(d) { return d.dotSize/2; })
    .style("fill", function(d) { return d.prodKey.color; })
    .style("stroke", "white")
    .style("stroke-width", 2)
    .style("stroke-opacity", 0.5);

  circle.append("text")
    .attr("x", 0)
    .attr("y", 0)
    .attr("dy", ".35em")
    .text(function(d) {return d.stars;});

  var legend = this.chart.selectAll("g.legend")
    .data(d3Engine.legendData)
    .enter().append("g")
    .classed("legend", true)
    .attr("transform", "translate(0, " + (d3Engine.height-25) + ")");

  legend.append("text")
    .attr("x", function(d, i) { return d3Engine.x((i*1.25)+0.3); })
    .attr("y", 0)
    .text(function(d) {return d});

  var storeLegend = this.chart.selectAll("g.storeLegend")
    .data(prodKey)
    .enter().append("g")
    .classed("storeLegend", true)
    .attr("transform", "translate(20,10)");

  storeLegend.append("rect")
    .attr("x", function (d,i) { return i*100; })
    .attr("y", 5)
    .attr("width", 80)
    .attr("height", 25)
    .style("fill", function (d) { return d.color; });

  storeLegend.append("text")
    .attr("x", function (d,i) { return i*100 + 5; })
    .attr("y", 18)
    .attr("dy", "0.35em")
    .text(function(d) { return d.name; } );

  tooltipSetup();
  forceInit();
};



// ---------------------------------


// ------ TOOLTIP DEF ---------

function tooltipSetup() {
  tooltip = d3.select(".d3-container")
    .append("div")
    .style("width", d3Engine.ttWidth + "px")
    .style("height", d3Engine.ttHeight + "px")
    .classed("hoverbox", true);

  tooltip.append('div')
    .classed("username", true);

  tooltip.append('div')
    .classed("reviewTitle", true);

  tooltip.append('div')
    .classed("reviewText", true);

  var nodes = d3Engine.chart.selectAll("g.node");

  nodes.on('mouseover', function(d) {
    var mouseLoc = d3.mouse(this.parentNode);
    if (mouseLoc[0] + d3Engine.ttOffset + d3Engine.ttWidth > d3Engine.width) {
      mouseLoc[0] = mouseLoc[0] - d3Engine.ttOffset*2 - d3Engine.ttWidth;
    }
    if (mouseLoc[1] + d3Engine.ttOffset + d3Engine.ttHeight > d3Engine.height) {
      mouseLoc[1] = mouseLoc[1] - d3Engine.ttOffset*2 - d3Engine.ttHeight;
    }
    tooltip
          .style("display", "block")
          .style("left", (mouseLoc[0]+d3Engine.ttOffset)+"px")
          .style("top", (mouseLoc[1]+d3Engine.ttOffset)+"px")
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
    .nodes(d3Engine.data)
    .charge(function(d) { return d.dotSize * -1.5; })
    .size([d3Engine.width, d3Engine.height]);

  force.start();

  force.on("tick", function(e) {
    var k = .1 * e.alpha;

    d3Engine.data.forEach(function(o,i) {
      o.y += (d3Engine.foci[o.stars*2].y - o.y) * k;
      o.x += (d3Engine.foci[o.stars*2].x - o.x) * k;
      d3Engine.chart.selectAll("g.node")
        .attr("transform", function(d) { 
          return "translate(" + d.x + "," + d.y + ")";
        });
    });
  });
}

// ---------------------------------


module.exports = d3Engine;


