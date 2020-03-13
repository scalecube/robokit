import React, { Component } from 'react'
import './UserCard.css'
import UserData from './UserData'
class User extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: '',
            display_data: false
        }
    }
    getUserData = (event, data) => {
        this.setState({
            display_data: false
        })
        setTimeout(() => {

            this.setState({
                data: data,
                display_data: true
            })

        }, 500);
    }

    render() {
        let user_data = ''
        if (this.state.data && this.state.display_data) {
            user_data = <UserData data={this.state.data} />
        }
        return (
            <div className='user-profile'>
                <div className="user-profile-grid">
                    <div className='user-img'>
                        <img className='user-img' src={'' + this.props.user.avatar_url} alt="" />
                    </div>
                    <div className="profile-user-settings">
                        <h1 className='user-name'>{this.props.user.login}</h1>
                        <a className="btn-visit" href={this.props.user.html_url} >Visit Profile</a>
                    </div>
                    {user_data}
                </div>
            </div>
        )
    }
}

export default User