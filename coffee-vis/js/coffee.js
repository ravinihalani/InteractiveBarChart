var chart;
var margin = {top: 5, right: 30, bottom: 30, left: 10};
var width = 300 - margin.left - margin.right;
var height = 200 - margin.top - margin.bottom;

//DEFINE YOUR VARIABLES UP HERE

//Gets called when the page is loaded.
function init(){

//PUT YOUR INIT CODE BELOW
x_scale = d3.scaleBand().rangeRound([0, width]).padding(0.1);
y_scale = d3.scaleLinear().range([height,0]);

x_axis = d3.axisBottom().scale(x_scale);
y_axis = d3.axisRight().scale(y_scale).ticks(5);

}

//Called when the update button is clicked
function updateClicked(){

xDropDownValue = getXSelectedOption();
yDropDownValue = getYSelectedOption();

d3.select("svg").remove();

chart = d3.select('#vis').append('svg')
  .attr("width", width + margin.left + margin.right+80)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(50,0)");


d3.csv("data/CoffeeData.csv", function(error,data) {

   // error check
   if (error) throw error;

   dataset = data; // store data into global var

   dataset.forEach(function(d) {
      d.sales = +d.sales;
      d.profit = +d.profit;
   });

   function colorPicker(v){

    if (v=="Central" || v=="Coffee"){return "#1187bd";}
    else if (v=="East" || v=="Tea"){return "#fd8100";}
    else if (v=="South" || v=="Espresso" ){return "#00c33b";}
    else if (v=="West" || v=="Herbal Tea"){return "#dd000b";}

   }

   var nested_data = d3.nest()
             .key(function(d) { if (xDropDownValue == "region") {return d.region}  else { return d.category } ;})
             .rollup(function (d) {
                      return d3.sum(d, function(d) { if (yDropDownValue == "sales") {return d.sales}  else { return d.profit } ;})
                       })
             .entries(dataset);
 
   x_scale.domain(nested_data.map(function(d) { return d.key; }));
   y_scale.domain([0, d3.max(nested_data, function(d) { return d.value; })]);

   chart.append("g").attr("class", "x axis").attr("transform", "translate(0, " + height + ")").call(x_axis);

   chart.append("g").attr("class", "y axis")
    .attr("transform", "translate(" + width + ",0)")
    .call(y_axis).append("text")
    .attr("transform", "rotate(-90)")
  .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    ;

  chart.selectAll(".bar").data(nested_data).enter().append("rect")
    .attr("class", "bar")
    .attr("x",function(d) { return x_scale(d.key); })
    .attr("width", x_scale.bandwidth())
    .attr("y", function(d) { return y_scale(d.value); })
    .attr("height", function(d) { return height - y_scale(d.value); })
    .attr("fill",function(d) { return colorPicker(d.key); });

});

}

//Callback for when data is loaded
function update(rawdata){
  //PUT YOUR UPDATE CODE BELOW
  
}

// Returns the selected option in the X-axis dropdown. Use d[getXSelectedOption()] to retrieve value instead of d.getXSelectedOption()
function getXSelectedOption(){
  var node = d3.select('#xdropdown').node();
  var i = node.selectedIndex;
  return node[i].value;
}

// Returns the selected option in the X-axis dropdown. 
function getYSelectedOption(){
  var node = d3.select('#ydropdown').node();
  var i = node.selectedIndex;
  return node[i].value;
}




