const topRockSongs = [
   { artist: "Fleetwod Mac", title: "Dreams", sales_and_streams: 1882000 },
   { artist: "AJR", title: "Bang!", sales_and_streams: 1627000 },
   { artist: "Imagine Dragons", title: "Believer", sales_and_streams: 1571000 },
   { artist: "Journey", title: "Don't Stop Believin'", sales_and_streams: 1497000 },
   { artist: "Eagles", title: "Hotel California", sales_and_streams: 1393000 }
],
topSongsSection = d3.select('#top-songs'),
bubbleChartMargin = 20,
bubbleChartHeight = 130,
bubbleMaxDiameter = bubbleChartHeight - (bubbleChartMargin * 2),
bubbleMaxArea = Math.PI * (bubbleMaxDiameter / 2) * (bubbleMaxDiameter / 2),
bubbleMargin = 10,
bubbleChartWidth = ((bubbleMaxDiameter + bubbleMargin) * topRockSongs.length) + bubbleMargin,
maxSale = d3.max(topRockSongs, d => d.sales_and_streams),
circlesScale = d3.scaleLinear().domain([0, maxSale]),
itemCenterY = bubbleChartHeight / 2,
itemCenterX = (d, i) => (bubbleMargin * (i + 1)) + (bubbleMaxDiameter * (i + 0.5))
circleRadius = (d) => Math.sqrt(bubbleMaxArea * circlesScale(d.sales_and_streams) / Math.PI);

let circlesChart, circlesChartGroup;

topSongsSection
   .append('h3')
   .text('Top Rock Songs');

circlesChart = topSongsSection
   .append('svg')
   .attr('viewbox', [0, 0, bubbleChartWidth, bubbleChartHeight])
   .attr('width', bubbleChartWidth)
   .attr('height', bubbleChartHeight);

circlesChart
   .append("line")
   .attr('x1', 0)
   .attr('x2', bubbleChartWidth)
   .attr('y1', itemCenterY)
   .attr('y2', itemCenterY)
   .attr('stroke', '#333')
   .attr('stroke-width', '2px');

circlesChartGroup = circlesChart
   .selectAll('g')
   .data(topRockSongs)
   .join('g')

circlesChartGroup
   .append('circle')
   .attr('r', circleRadius)
   .attr('cy',  itemCenterY)
   .attr('cx', itemCenterX)
   .attr('fill', 'rgb(226 69 255)');

circlesChartGroup
   .append('text')
   .attr('class', 'label')
   .attr('x', itemCenterX)
   .attr('y', 5)
   .attr('text-anchor', 'middle')
   .attr('dominant-baseline', 'hanging')
   .text(d => d.sales_and_streams / 1000000 + 'M');

circlesChartGroup
   .append('text')
   .attr('class', 'label')
   .attr('x', itemCenterX)
   .attr('y', bubbleChartHeight - 5)
   .attr('text-anchor', 'middle')
   .text(d => d.title);
