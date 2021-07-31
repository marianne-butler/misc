const topRockAlbums = [
  { artist: "Queen", title: "Greatest Hits", eq_albums: 929000 },
  { artist: "Elton John", title: "Diamonds", eq_albums: 743000 },
  { artist: "Fleetwood Mac", title: "Rumours", eq_albums: 721000 },
  { artist: "CCR", title: "The 20 Greatest Hits", eq_albums: 630000 },
  { artist: "Journey", title: "Journey's Greatest Hits", eq_albums: 561000 }
],
topAlbumsSection = d3.select('#top-albums'),
barChartWidth = 500,
barChartHeight = 130,
marginLeft = 200,
barThickness = 20;
barMargin = 5;

let barChart, barLengthScale;

topAlbumsSection
  .append('h3')
  .text('Top Rock Albums');

barChart = topAlbumsSection
  .append('svg')
    .attr('viewbox', [0, 0, barChartWidth, barChartHeight])
    .attr('width', barChartWidth)
    .attr('height', barChartHeight);

barLengthScale = d3.scaleLinear()
  .domain([0, 1000000]) // In our data, the number of album-equivalent goes up to about 1,000,000
  .range([0, barChartWidth - marginLeft - 100]); // Based on the space that we have on screen and the space we need for the labels

barChart
  .append('line')
    .attr('x1', marginLeft)
    .attr('y1', 0)
    .attr('x2', marginLeft)
    .attr('y2', barChartHeight)
    .attr('stroke', '#333')
    .attr('stroke-width', 2);

barChart.selectAll('rect')
  .data(topRockAlbums)
  .join('rect')
  .attr('width', d => barLengthScale(d.eq_albums))
  .attr('height', barThickness)
  .attr('x', marginLeft + 1)
  .attr('y', (d, i) => barMargin + (barThickness + barMargin) * i)
  .attr('fill', '#a6d854');

barChart.selectAll('.label-value')
  .data(topRockAlbums)
  .join('text')
    .attr('class', 'label label-value')
    .attr('x', d => marginLeft + barLengthScale(d.eq_albums) + 10)
    .attr('y', (d, i) => (barMargin + (barThickness + barMargin) * i) + 14)
    .text(d => d.eq_albums / 1000000 + 'M');