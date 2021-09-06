import React from 'react';
import './score-result.scss';
import _ from "lodash";
import { Link } from 'react-router-dom'

class ScoreResult extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      mode: null,
      showMore: false,
      level: null,
      showMoreRoute: '',
      playerId: 0
    }
  }

  componentDidMount() {
    this.setState({
      data: this.props.data,
      mode: this.props.mode,
      level: this.props.level
    });
  }

  componentDidUpdate() {
    if (this.state.data.length > 5) {
      this.setShowMore();
    }
  }

  setShowMore() {
    const stateClone = _.cloneDeep(this.state.data);
    const showItem = _.slice(stateClone, 0, 5);
    const loginUser = JSON.parse(localStorage.getItem('loginUser'));
    const route = '/score-detail';
    this.setState({
      data: showItem,
      showMore: true,
      showMoreRoute: route,
      playerId: loginUser.user.id
    })
  }

  render() {
    return (
      <div className="exam-result">
        {(this.state.data.length > 0 && this.state.mode === "exam") &&
          <table className="exam-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Score</th>
                <th>Total</th>
                <th>Answer Date</th>
              </tr>
            </thead>
            <tbody>
              {this.state.data.map((result, i) => {
                return (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{result.score}</td>
                    <td>{result.total}</td>
                    <td>{new Date(result.answer_date).toLocaleDateString()}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        }

        {(this.state.data.length > 0 && this.state.mode === "practise") &&
          <table className="practise-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Score</th>
                <th>Total</th>
                <th>Kind</th>
                <th>Chapters</th>
                <th>Random Words</th>
                <th>Answer Date</th>
              </tr>
            </thead>
            <tbody>
              {this.state.data.map((result, i) => {
                return (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{result.score}</td>
                    <td>{result.total}</td>
                    <td>{result.kind}</td>
                    <td>
                      {result.chapters.length > 0 &&
                        <select className="chapter-select-box">
                          {result.chapters.map((r, i) => {
                            return (
                              <option key={i} value={r}>{r}</option>
                            )
                          })}
                        </select>
                      }
                    </td>
                    <td>{result.random_count}</td>
                    <td>{new Date(result.answer_date).toLocaleDateString()}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        }

        {this.state.showMore &&
          <Link
            className="show-more-link"
            to={{
              pathname: this.state.showMoreRoute,
              state: {
                level: this.state.level,
                mode: this.state.mode,
                playerId: this.state.playerId
              }
            }}>
            <button className="show-more-btn">Show More</button>
          </Link>
        }
      </div>
    )
  }
}

export default ScoreResult;