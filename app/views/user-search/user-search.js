import React, { Component } from 'react';
import User from './components/User'
import './App.css';
import Loading from './components/Loading'
class UserSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: '',
      loading: false
    }
  }
  getUser = () => {
    this.setState({
      loading: true
    })
    let name = this.refs.name.value;
    setTimeout( () => {
      fetch(`https://api.github.com/search/users?q=${name}&page=1&per_page=30`)
      .then(response => response.json())
      .then(data => {
        this.setState({
          users: data,
          loading: false
        });
      })
    },1000)
  }
  render() {   
    let userProfiles = [];
    if( this.state.loading === true)  {
       userProfiles = <div className='loading-user-card'><Loading /></div>
    }else if (this.state.users && this.state.users.items && this.state.users.items.length > 0 ) {
      this.state.users.items.map((user,index)=>{
        userProfiles.push( <User key={index} user={user} /> )
      })
    }
    return (
      <div className="App">
        <div className="wrapper">
          <div id='search-bar'>
            <input type="text" placeholder='Enter UserName' ref="name" />
            <button className='searchButton' onClick={this.getUser}>
              <i className="fas fa-search"></i>
            </button>
          </div>
        </div>
        {userProfiles}
      </div>
    );
  }
}

export default UserSearch;
