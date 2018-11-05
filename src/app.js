'use strict'

import React, { Component } from 'react'
import AppContent from './components/app-content'
import ajax from '@fdaciuk/ajax'

class App extends Component {
  constructor () {
    super()
    this.state = {
      userinfo: null,
      repos: [],
      starred: [],
      isFetching: false
    }
  }

  getGitHupApiUrl (username, type) {
    const internalUser = username ? `/${username}` : ''
    const internalType = type ? `/${type}` : ''
    return `https://api.github.com/users${internalUser}${internalType}`
  }

  handleSearch (e) {
    const value = e.target.value
    const keyCode = e.which || e.keyCode
    const ENTER = 13

    if (keyCode === ENTER) {
      this.setState({ isFetching: true })
      ajax().get(this.getGitHupApiUrl(value)).then((result) => {
        this.setState({
          userinfo: {
            username: result.name,
            login: result.login,
            photo: result.avatar_url,
            repos: result.public_repos,
            followers: result.followers,
            following: result.following
          },
          repos: [],
          starred: []
        })
      }).always(() => this.setState({ isFetching: false }))
    }
  }

  getRepos (type) {
    return (e) => {
      ajax().get(this.getGitHupApiUrl(this.state.userinfo.login, type)).then((result) => {
        const repositorios = result.map((repos) => {
          return {
            key: repos.id,
            name: repos.name,
            link: repos.html_url
          }
        })
        this.setState({
          [type]: repositorios
        })
      })
    }
  }

  render () {
    return <AppContent
      userinfo={this.state.userinfo}
      repos={this.state.repos}
      starred={this.state.starred}
      photo={this.state.photo}
      isFetching={this.state.isFetching}
      handleSearch={(e) => this.handleSearch(e)}
      getRepos={this.getRepos('repos')}
      getStarred={this.getRepos('starred')}

    />
  }
}

export default App
