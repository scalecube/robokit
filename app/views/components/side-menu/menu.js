import React from "react";
import ReactDOM from "react-dom";
import {CopyToClipboard} from 'react-copy-to-clipboard';
import axios from 'axios';


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
      padding: '2px',
      color: 'white'
    }
    const ul= {
      padding: 1,
      margin: 1,
      color: 'white'
    }
    const ul2= {
      padding: 3,
      margin: 3,
      color: 'white'
    }
    return (
      <div style={ul}>
        <strong style={ul}>{name}</strong>
        <ul style={ul2}>
          <strong style={ul}>{this.state.template.title}</strong>
          <ul style={ul2}>
          {
            items.map((item,i) => {
              return (<div key={i} style={style} onClick={() => this.itemSelected(item)}>
                <CopyToClipboard text={item.sha} onCopy={() => this.setState({copied: true})}>
                  <img src={'./plotly/components/side-menu/clipboard.png'} style={{width:"13px", height:"13px"}}></img>
                </CopyToClipboard>
                <label>{"..."+item.sha.slice(item.sha.length - 20)}</label>
                <br/>
                <li style={{fontSize:'9px'}} key={item.id}>{item.date}</li>
              </div>)
            })
          }
          </ul>
        </ul>
      </div>
    );
  }
}
function login(err) {
  if(err.message.includes("403"))
    document.location.href = "/auth/github/";

}
axios.get("/templates/").then(result => {
  let commitsMap = new Map();
  result.data.forEach((template) => {
    let slug = (template.owner + "/" + template.repo)
    let commits = []
    axios.get("/commits/" + slug).then(res=>{
      commitsMap.set(slug, res.data)
      let menu = <div>{
        Array.from(commitsMap.entries()).map((e) => {
          return (<Catrgory key={new Date()} shaList={e[1]} template={template} name={e[0]}/>)
        })
      }</div>
      ReactDOM.render(menu, document.getElementById('side-menu-container'));
    })
  })
}).catch(err=> {
  login(err)
})
