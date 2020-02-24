class Catrgory extends React.Component {
  constructor(props) {
    let items = props.shaList.map( (item,i) => {
       return {
         id:i,
         sha:item[0],
         date: item[1],
         template: props.template
        }
     })

    super(props);
      this.state = {
        inputValue: '',
        name: props.name,
        items: items,
        template: props.template
      };
  }

  itemSelected(item){
    window.eventBus.emit('draw-charts',null,item)
  }

  render() {
    const { items,name, inputValue } = this.state;
    const style = {
      fontSize:'12px',
      borderTop: '1px solid #99bbc7',
      padding: '2px'
    }
    const ul= {
      padding: 1,
      margin: 1
    }
    const ul2= {
      padding: 3,
      margin: 3
    }
    return (
      <li style={ul}>
        <strong style={ul}>{name}</strong>
        <ul style={ul2}>
          <strong style={ul}>{this.state.template.title}</strong>
          <ul style={ul2}>
          {
            items.map((item,i) => {
              return (<div key={i} style={style} onClick={() => this.itemSelected(item)}>
                <CopyToClipboard text={item.sha} onCopy={() => this.setState({copied: true})}>
                  <img src={'../components/side-menu/clipboard.png'} style={{width:"13px", height:"13px"}}></img>
                </CopyToClipboard>
                <label>{"..."+item.sha.slice(item.sha.length - 20)}</label>
                <br/>
                <li style={{fontSize:'9px'}} key={item.id}>{item.date}</li>
              </div>)
            })
          }
          </ul>
        </ul>
      </li>
    );
  }
}

axios.get(SERVER_URL + "/templates/").then(result => {
  let commitsMap = new Map();
  result.data.forEach(async (template) => {
    let slug = (template.owner + "/" + template.repo)
    commitsMap.set(slug, (await axios.get(SERVER_URL + "/commits/" + slug)).data)
    let menu = <div>{
      Array.from(commitsMap.entries()).map((e) => {
        return (<Catrgory key={new Date()} shaList={e[1]} template={template} name={e[0]}/>)
      })
    }</div>
    ReactDOM.render(menu, document.getElementById('side-menu-container'));
  })
})
