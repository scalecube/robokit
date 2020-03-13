import React from 'react'
import Loading from './Loading'
import './UserData.css'
import UserDataList from './UserDataList'
import InfiniteScroll from "react-infinite-scroll-component"
class UserData extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            data: '',
            hasMore: true,
            nextDataPage: 2
        }
        this.fetchData = this.fetchData.bind(this);
    }
    componentDidMount() {
        console.log("I'm")
        this.setState({
            loading: true
        })
        this.fetchData(this.props.data)
    }
    componentDidUpdate(prevProps, prevState) {
        if (prevProps.data !== this.props.data) {
            this.setState({
                display: false,
                loading: true
            })
            this.fetchData(this.props.data)
        }

    }
    fetchData(data_url) {
        this.setState({
            loading: true,
            display: false
        })
        setTimeout(() => {
        fetch(data_url)
            .then(response => response.json())
            .then(data => {
                this.setState({
                    loading: false,
                    display: true,
                    data
                })
            })
            .catch(function (error) {
                console.log(error);
            });
        }, 500);
    }
    // infinite scrolling
    fetchMoreData = () => {
        if (this.state.hasMore === true) {
            let num = this.state.nextDataPage;
            setTimeout(() => {
                fetch(`${this.props.data}?page=${num}`)
                    .then(response => response.json())
                    .then(data => {
                        if (data.length > 0) {
                            this.setState((prevState) => ({
                                hasMore: true,
                                nextDataPage: num + 1,
                                data: prevState.data.concat(data)
                            }))
                        } else {
                            this.setState({
                                hasMore: false,
                                nextDataPage: 2,

                            })
                        }
                    })
            }, 500);
        }
    }


    render() {
        if (this.state.loading === true) {
            return <div className='user-data-loading'><Loading /></div>
        } else if (this.state.display === false) {
            return <div></div>
        }

        let user_data_list;
        if (this.state.data[0].full_name) {
            user_data_list = < UserDataList repos={true} data={this.state.data} />
        }else{
            user_data_list = < UserDataList data={this.state.data} />
        }
        return (
            <div className='user-data-grid'>
                <InfiniteScroll
                    dataLength={this.state.data.length}
                    next={this.fetchMoreData}
                    hasMore={this.state.hasMore}
                    loader={<div className='user-data-scrolling-loading'><Loading /></div>}
                >
                    {this.state.loading === true
                        ? <Loading />
                        :
                        <div className="data-wrapper">
                            {user_data_list}
                        </div>
                    }
                </InfiniteScroll>
            </div>
        )
    }
}

export default UserData