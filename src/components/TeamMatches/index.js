import {Component} from 'react'

import {PieChart, Pie, Legend, Cell, Tooltip} from 'recharts'

import Loader from 'react-loader-spinner'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'

import LatestMatch from '../LatestMatch'
import MatchCard from '../MatchCard'

import './index.css'

const teamMatchesApiUrl = 'https://apis.ccbp.in/ipl/'

class TeamMatches extends Component {
  state = {
    matchesData: [],
    isLoading: true,
    won: 0,
    lost: 0,
    draw: 0,
  }

  componentDidMount() {
    this.getTeamMatches()
  }

  getTeamMatches = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params
    const response = await fetch(`${teamMatchesApiUrl}${id}`)
    const fetchedData = await response.json()
    const updatedData = {
      teamBannerUrl: fetchedData.team_banner_url,
      latestMatchDetails: {
        id: fetchedData.latest_match_details.id,
        competingTeam: fetchedData.latest_match_details.competing_team,
        competingTeamLogo: fetchedData.latest_match_details.competing_team_logo,
        date: fetchedData.latest_match_details.date,
        firstInnings: fetchedData.latest_match_details.first_innings,
        manOfTheMatch: fetchedData.latest_match_details.man_of_the_match,
        matchStatus: fetchedData.latest_match_details.match_status,
        result: fetchedData.latest_match_details.result,
        secondInnings: fetchedData.latest_match_details.second_innings,
        umpires: fetchedData.latest_match_details.umpires,
        venue: fetchedData.latest_match_details.venue,
      },
      recentMatches: fetchedData.recent_matches.map(recentMatch => ({
        umpires: recentMatch.umpires,
        result: recentMatch.result,
        manOfTheMatch: recentMatch.man_of_the_match,
        id: recentMatch.id,
        date: recentMatch.date,
        venue: recentMatch.venue,
        competingTeam: recentMatch.competing_team,
        competingTeamLogo: recentMatch.competing_team_logo,
        firstInnings: recentMatch.first_innings,
        secondInnings: recentMatch.second_innings,
        matchStatus: recentMatch.match_status,
      })),
    }

    const {recentMatches} = updatedData
    let won = 0
    let lost = 0
    let draw = 0

    recentMatches.forEach(matching => {
      if (matching.matchStatus === 'Won') {
        won += 1
      } else if (matching.matchStatus === 'Lost') {
        lost += 1
      } else {
        draw += 1
      }
    })

    // console.log('Won:', won, 'Lost:', lost, 'Draw:', draw)

    this.setState({matchesData: updatedData, isLoading: false, won, lost, draw})
  }

  onClickBack = () => {
    const {history} = this.props
    history.replace('/')
  }

  renderPieGraph = (won, lost, draw) => {
    const info = [
      {count: won, name: 'Won'},
      {count: lost, name: 'Lost'},
      {count: draw, name: 'Draw'},
    ]

    return (
      <>
        <h1 className="team-statistics-heading">Team Statistics</h1>
        <div className="pie-chart-container">
          <PieChart width={300} height={300}>
            <Pie
              cx="50%"
              cy="60%"
              data={info}
              startAngle={360}
              endAngle={0}
              innerRadius="30%"
              outerRadius="70%"
              dataKey="count"
              label
            >
              <Cell key={info.count} name="Won" fill="#2ecc71" />
              <Cell key={info.count} name="Lost" fill="#e74c3c" />
              <Cell key={info.count} name="Draw" fill="#254fcc" />
            </Pie>
            <Tooltip />
            <Legend
              iconType="circle"
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
              wrapperStyle={{
                fontSize: 14,
                fontFamily: 'Roboto',
                paddingTop: '30px',
              }}
            />
          </PieChart>
        </div>
      </>
    )
  }

  renderRecentMatchesList = () => {
    const {matchesData} = this.state
    const {recentMatches} = matchesData
    return (
      <ul className="recent-matches-list">
        {recentMatches.map(eachMatch => (
          <MatchCard matchData={eachMatch} key={eachMatch.id} />
        ))}
      </ul>
    )
  }

  renderTeamMatches = () => {
    const {matchesData, won, lost, draw} = this.state
    const {teamBannerUrl, latestMatchDetails} = matchesData

    return (
      <div className="team-matches-container">
        <button
          type="button"
          className="back-button"
          onClick={this.onClickBack}
        >
          Back
        </button>
        <img src={teamBannerUrl} alt="team banner" className="team-banner" />
        <LatestMatch latestMatch={latestMatchDetails} />
        {this.renderRecentMatchesList()}
        {this.renderPieGraph(won, lost, draw)}
      </div>
    )
  }

  renderLoader = () => (
    <div data-testid="loader" className="loader-container">
      <Loader type="Oval" color="#ffffff" height={50} width={50} />
    </div>
  )

  render() {
    const {isLoading} = this.state
    const {match} = this.props
    const {params} = match
    const {id} = params
    return (
      <div className={`app-team-matches-container ${id}`}>
        {isLoading ? this.renderLoader() : this.renderTeamMatches()}
      </div>
    )
  }
}

export default TeamMatches
