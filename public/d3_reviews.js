var storeData = [
  {name: "Amazon", color: "steelblue"},
  {name: "WalMart", color: "darkorange"},
  {name: "Best Buy", color: "darkseagreen"},
];

var dataGen = function () {
  results = [];
  for (var i = 0; i < 20; i++) {
    var obj = {};
    obj.numLines = Math.floor(Math.random() * 39) + 20;
    obj.stars = Math.round(Math.random() * 10)/2;
    obj.site = storeData[Math.floor(Math.random() * 3)];
    obj.username = 'User' + i;
    obj.reviewTitle = 'NO CATS INCLUDED';
    obj.review = "I thought this product was crap.  It didn't come with any cats.  \
    I require cats in all my products and I plan on writing a very angry letter to \
    the manufacturer as a result of not having my cat needs met.";
    obj.reviewStart = obj.review.slice(0, 110) + "...";
    results.push(obj);
  }
  return results;
};

var data = dataGen();

var legendData = ['0 stars', '1 star', '3 stars', '4 stars', '5 stars'];

var width = 600,
  height = 300,
  yOffset = 50;


// x based on star rating
var x = d3.scale.linear()
          .domain([0, 6])
          .range([0, width]);

var fociX = d3.scale.linear()
          .domain([0, 6])
          .range([100, width-50]);

var fociGen = function (numFoci, x) {
  var results = [];
  for (var i = 0; i < numFoci; i++) {
    results.push({x: fociX(i+1)/2, y: 150});
  }
  return results;
};

var foci = fociGen(11, x);

var force = d3.layout.force()
  .gravity(0)
  .links([])
  .nodes(data)
  .charge(function(d) { return d.numLines * -1.5; })
  .size([width, height]);

var chart = d3.select(".chart")
  .attr("width", width)
  .attr("height", height);

var circle = chart.selectAll("g.node")
    .data(data)
  .enter().append("g")
    .classed("node", true)
    .attr("transform", function(d, i) { 
      return "translate(" + (x(d.stars)+ d.numLines) + "," + yOffset + ")";
    });

circle.append("circle")
  .attr("cx", 0)
  .attr("cy", 0)
  .attr("r", function(d) { return d.numLines/2; })
  .style("fill", function(d) { return d.site.color; })
  .style("stroke", "white")
  .style("stroke-width", 2)
  .style("stroke-opacity", 0.5);

circle.append("text")
  .attr("x", 0)
  .attr("y", 0)
  .attr("dy", ".35em")
  .text(function(d) {return d.stars;});

var legend = chart.selectAll("g.legend")
  .data(legendData)
  .enter().append("g")
  .classed("legend", true)
  .attr("transform", "translate(0, " + (height-25) + ")");

legend.append("text")
  .attr("x", function(d, i) { return x((i*1.25)+0.3); })
  .attr("y", 0)
  .text(function(d) {return d});

var storeLegend = chart.selectAll("g.storeLegend")
  .data(storeData)
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

var nodes = chart.selectAll("g.node");


var ttOffset = 10;
var ttWidth = 220;
var ttHeight = 105;

var tooltip = d3.select(".d3-container")
  .append("div")
  .style("width", ttWidth + "px")
  .style("height", ttHeight + "px")
  .classed("hoverbox", true);

tooltip.append('div')
  .classed("username", true);

tooltip.append('div')
  .classed("reviewTitle", true);

tooltip.append('div')
  .classed("reviewText", true);

nodes.on('mouseover', function(d) {
  var mouseLoc = d3.mouse(this.parentNode);
  if (mouseLoc[0] + ttOffset + ttWidth > width) {
    mouseLoc[0] = mouseLoc[0] - ttOffset*2 - ttWidth;
  }
  if (mouseLoc[1] + ttOffset + ttHeight > height) {
    mouseLoc[1] = mouseLoc[1] - ttOffset*2 - ttHeight;
  }
   tooltip
        .style("display", "block")
        .style("left", (mouseLoc[0]+ttOffset)+"px")
        .style("top", (mouseLoc[1]+ttOffset)+"px")
        .transition()
        .duration(200)
        .style('opacity', 1);
  tooltip.select(".username")
    .text(d.username + " on " + d.site.name);
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

force.start();


force.on("tick", function(e) {
  var k = .1 * e.alpha;

  data.forEach(function(o,i) {
    o.y += (foci[o.stars*2].y - o.y) * k;
    o.x += (foci[o.stars*2].x - o.x) * k;
    chart.selectAll("g.node")
      .attr("transform", function(d) { 
        return "translate(" + d.x + "," + d.y + ")";
      });
  });
});