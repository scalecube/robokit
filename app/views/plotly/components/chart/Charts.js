const Plot = createPlotlyComponent(Plotly)
var i=0;
class Chart extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      inputValue: '',
      config: { responsive: true },
      charts: props.charts
    }
  }

  render () {
    const charts = this.state.charts.map((chart,i) =>
      <Plot key={i}
            data={chart.data}
            layout={chart.layout}
            config = {this.state.config}
            useResizeHandler={true}
            style={{width: "100%", height: "100%"}}
      />
    );
    let id =i++
    return <div id={id}>{charts}</div>
  }
}