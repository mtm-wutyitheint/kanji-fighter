import React from "react";
import { env } from "../../env/development";
import axios from "axios";
import "./top-scorer.scss";

class TopScorers extends React.Component {
  constructor() {
    super();
    this.state = {
      data: [],
      level: "",
      errorText: null,
    };
  }

  componentDidMount() {
    const level = localStorage.getItem("level");
    const loginUser = JSON.parse(localStorage.getItem("loginUser"));
    let jwt = loginUser && loginUser.jwt ? loginUser.jwt : "";

    const data = {
      _limit: 3,
    };
    if (level === "N4") {
      data._sort = "current_n4_score:DESC";
    } else if (level === "N5") {
      data._sort = "current_n5_score:DESC";
    } else {
    }
    const headers = { Authorization: `Bearer ${jwt}` };
    axios
      .get(env.apiEndPoint + "/users", { params: data, headers })
      .then((res) => {
        this.setState({
          data: res.data,
          level,
          errorText: null,
        });
      })
      .catch((err) => {
        if (err.response) {
          console.error("Error in setState : ", err.response);
          this.setState({
            errorText: "Could not load top score users (" + err.message + ")",
          });
        }
      });
  }

  render() {
    return (
      <div className="top-scorers">
        {!this.state.errorText ? (
          <>
            {this.state.data.map((top, i) => {
              var playerPrize = "prize-img prize" + (i + 1);
              return (
                <div className="top-player" key={i}>
                  <div className={playerPrize}></div>
                  <div className="player-name">{top.username}</div>
                  {this.state.level === "N4" ? (
                    <div className="player-score">{top.current_n4_score}</div>
                  ) : (
                    <div className="player-score">{top.current_n5_score}</div>
                  )}
                </div>
              );
            })}
          </>
        ) : (
          <>
            <p className="error">{this.state.errorText}</p>
          </>
        )}
      </div>
    );
  }
}

export default TopScorers;
