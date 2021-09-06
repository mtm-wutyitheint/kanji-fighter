import React from "react";
import _ from "lodash";
import axios from "axios";
import { env } from "../../env/development";
import Pagination from "../../components/pagination/pagination";
import "./score-detail.scss";

export default function ScoreDetail(props) {
  const routeParas = props.location.state;
  const [record, setRecord] = React.useState([]);
  const [showItems, setShowItems] = React.useState([]);

  const checkRecordItem = () => {
    if (record.length <= 0) {
      getPlayerRecord();
    }
  };

  const chapterToList = (practiseItems) => {
    _.map(practiseItems, (practise) => {
      practise.chapters = practise.chapters ? practise.chapters.split(",") : [];
      practise.answer_date = new Date(practise.answer_date).toLocaleString();
    });
    return practiseItems;
  };

  const getPlayerRecord = () => {
    if (
      !_.isNil(routeParas) &&
      !_.isNil(routeParas.level) &&
      !_.isNil(routeParas.mode) &&
      !_.isNil(routeParas.playerId)
    ) {
      const apiMode =
        routeParas.mode === "exam" ? "/exam-scores" : "/practise-scores";
      const apiPara = {
        level: routeParas.level,
        user: routeParas.playerId,
        _sort: "answer_date:DESC",
      };
      const loginUser = JSON.parse(localStorage.getItem("loginUser"));
      let jwt = loginUser && loginUser.jwt ? loginUser.jwt : "";
      const headers = { Authorization: `Bearer ${jwt}` };
      axios
        .get(env.apiEndPoint + apiMode, { params: apiPara, headers })
        .then((res) => {
          let data = res.data;
          data = chapterToList(data);
          setRecord(data);
        })
        .catch((err) => console.error(err));
    }
  };

  React.useEffect(() => {
    checkRecordItem();
  });

  const onChangePage = (showItems, currentPage) => {
    setShowItems(showItems);
  };

  return (
    <>
      {routeParas &&
        routeParas.level &&
        routeParas.mode &&
        routeParas.playerId && (
          <div className="score-result-detail">
            <h1>
              {"Score Result of " + routeParas.mode + " " + routeParas.level}
            </h1>
            {routeParas.mode === "exam" ? (
              <table>
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Score</th>
                    <th>Total</th>
                    <th>Answer Date</th>
                  </tr>
                </thead>
                <tbody>
                  {showItems.map((r, i) => {
                    return (
                      <tr key={i}>
                        <td>{r.id}</td>
                        <td>{r.score}</td>
                        <td>{r.total}</td>
                        <td>{r.answer_date}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <table>
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
                  {showItems.map((r, i) => {
                    return (
                      <tr key={i}>
                        <td>{r.id}</td>
                        <td>{r.score}</td>
                        <td>{r.total}</td>
                        <td>{r.kind}</td>
                        <td>
                          {r.chapters && r.chapters.length > 0 && (
                            <select className="chapter-select-box">
                              {r.chapters.map((re, index) => {
                                return (
                                  <option key={index} value={re}>
                                    {re}
                                  </option>
                                );
                              })}
                            </select>
                          )}
                        </td>
                        <td>{r.random_count}</td>
                        <td>{r.answer_date}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}

            <Pagination
              data={record}
              showPage="true"
              onChangePage={onChangePage}
            ></Pagination>
          </div>
        )}
    </>
  );
}
