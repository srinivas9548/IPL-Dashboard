import {Component} from 'react'

import './index.css'

class MatchCard extends Component {
  render() {
    const {matchData} = this.props
    const {result, competingTeam, competingTeamLogo, matchStatus} = matchData

    return (
      <li className={`match-card ${matchStatus}`}>
        <img
          src={competingTeamLogo}
          alt={competingTeam}
          className="match-card-logo"
        />
        <h1 className="match-card-name">{competingTeam}</h1>
        <p className="match-card-result">{result}</p>
        <p className="match-status">{matchStatus}</p>
      </li>
    )
  }
}

export default MatchCard
