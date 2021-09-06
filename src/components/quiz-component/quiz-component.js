import React from "react";
import _ from "lodash";
import "./quiz-component.scss";
import { Link } from "react-router-dom";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import Button from "@material-ui/core/Button";
import axios from "axios";
import { env } from "../../env/development";
import ErrorHandleDialog from "../../components/error-handle-dialog/error-handle-dialog";

class QuizComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: "",
      kind: "",
      count: 0,
      level: "",
      chapters: [],
      data: [],
      showAnswer: false,
      listAnswer: [],
      dialogOpen: false,
      scoreText: "",
      isError: false,
      errorMessage: "",
      errorStatus: 0,
    };
    this.allComplete = this.allComplete.bind(this);
    this.backToQuiz = this.backToQuiz.bind(this);
    this.handleCloseDialog = this.handleCloseDialog.bind(this);
    this.errorDialogClose = this.errorDialogClose.bind(this);
  }

  componentDidMount() {
    this.setDataToAllQiz();
  }

  setDataToAllQiz() {
    const quizData = [];
    if (
      this.props.answerWithMeaning &&
      this.props.answerWithMeaning.length > 0
    ) {
      quizData.push({
        head: "Answer with Meaning",
        data: this.props.answerWithMeaning,
      });
    }

    if (this.props.answerWithKanji && this.props.answerWithKanji.length > 0) {
      quizData.push({
        head: "Answer with Kanji",
        data: this.props.answerWithKanji,
      });
    }

    if (
      this.props.answerWithKunyomi &&
      this.props.answerWithKunyomi.length > 0
    ) {
      quizData.push({
        head: "Answer with Kunyomi",
        data: this.props.answerWithKunyomi,
      });
    }

    if (this.props.answerWithOnyomi && this.props.answerWithOnyomi.length > 0) {
      quizData.push({
        head: "Answer with Onyomi",
        data: this.props.answerWithOnyomi,
      });
    }
    this.setState({
      mode: this.props.mode,
      kind: this.props.kind,
      count: this.props.count,
      level: this.props.level,
      chapters: this.props.chapters,
      data: quizData,
    });
  }

  chooseAnswer(correct, ans, mainIndex, index, childIndex) {
    let changeState = _.cloneDeep(this.state.data);
    const restToFalse = changeState[mainIndex].data[index].answer_list.map(
      (lst) => {
        if (correct === lst.meaning) {
          lst.isCorrect = true;
        }
        lst.disable = true;
        return lst;
      }
    );
    changeState[mainIndex].data[index].answer_list = restToFalse;
    changeState[mainIndex].data[index].answer_list[childIndex].ischoose =
      !ans.ischoose;
    this.setState({ data: changeState });
  }

  recordAnswer(ans, mainIndex, index, childIndex) {
    let changeState = _.cloneDeep(this.state.data);
    const restToFalse = changeState[mainIndex].data[index].answer_list.map(
      (lst) => {
        lst.ischoose = false;
        return lst;
      }
    );
    changeState[mainIndex].data[index].answer_list = restToFalse;
    changeState[mainIndex].data[index].answer_list[childIndex].ischoose =
      !ans.ischoose;
    this.setState({ data: changeState });
  }

  allComplete() {
    const stateData = _.cloneDeep(this.state.data);
    let total = 0;
    let correct = 0;
    // change style
    _.map(stateData, (snap) => {
      if (snap.data && snap.data.length > 0) {
        total += snap.data.length;
        _.map(snap.data, (snapShot) => {
          _.map(snapShot.answer_list, (answer) => {
            if (answer.ischoose && answer.meaning === snapShot.correct) {
              correct += 1;
              answer.isCorrect = true;
            }
            if (answer.meaning === snapShot.correct) {
              answer.isCorrect = true;
            }
            answer.disable = true;
          });
        });
      }
    });
    // record history
    let data = {};
    const user = JSON.parse(localStorage.getItem("loginUser"));
    const cha_lst = _.cloneDeep(this.state.chapters);
    let cha_text = "";
    _.forEach(cha_lst, (lst) => {
      cha_text += lst.label + ",";
    });
    data.user = user.user.id;
    data.score = correct;
    data.total = total;
    data.level = this.state.level;
    data.answer_date = new Date().toISOString();
    if (this.state.mode === "practise") {
      data.kind = this.state.kind;
      if (data.kind === "random") {
        data.random_count = this.state.count;
      } else {
        data.chapters = cha_text;
      }
      const route = "/practise-scores";
      this.saveRecord(data, route);
    }
    if (this.state.mode === "exam") {
      const route = "/exam-scores";
      this.saveRecord(data, route);
      this.updateCurrentScore(user.user.id, correct, this.state.level);
    }
    const scoreResult = `You score is ${correct} of total ${total}`;
    this.setState({
      data: stateData,
      showAnswer: true,
      dialogOpen: true,
      scoreText: scoreResult,
    });
  }

  saveRecord(data, route) {
    const loginUser = JSON.parse(localStorage.getItem("loginUser"));
    let jwt = loginUser && loginUser.jwt ? loginUser.jwt : "";
    const headers = { Authorization: `Bearer ${jwt}` };
    axios
      .post(`${env.apiEndPoint}${route}`, data, { headers })
      .then((res) => {
        console.log("save record success", res);
      })
      .catch((err) => {
        console.error(err);
        if (err.response) {
          console.error("Error in setState : ", err.response);
          const errorDict = err.response;
          this.setState({
            isError: true,
            errorMessage: errorDict.statusText,
            errorStatus: errorDict.status,
          });
        }
      });
  }

  updateCurrentScore(id, score, level) {
    const loginUser = JSON.parse(localStorage.getItem("loginUser"));
    let jwt = loginUser && loginUser.jwt ? loginUser.jwt : "";
    const headers = { Authorization: `Bearer ${jwt}` };
    let data = {};
    if (level === "N5") {
      data.current_n5_score = String(score);
    } else {
      data.current_n4_score = String(score);
    }
    axios
      .put(`${env.apiEndPoint}/users/${id}`, data, { headers })
      .then(() => {})
      .catch((err) => {
        console.error(err);
        if (err.response) {
          console.error("Error in setState : ", err.response);
          const errorDict = err.response;
          this.setState({
            isError: true,
            errorMessage: errorDict.statusText,
            errorStatus: errorDict.status,
          });
        }
      });
  }

  handleCloseDialog() {
    this.setState({
      dialogOpen: false,
    });
  }

  backToQuiz() {
    this.setState({
      mode: "",
      data: [],
      showAnswer: false,
      listAnswer: [],
    });
  }

  errorDialogClose(close) {
    this.setState({
      isError: close,
      errorMessage: "",
      errorStatus: 0,
    });
  }

  render() {
    return (
      <div>
        {this.state.data.map((data, mainIndex) => {
          return (
            <div className="quiz-component" key={mainIndex}>
              {data.data.length > 0 && (
                <div className="container">
                  <h2 className="quiz-header">{data.head}</h2>
                  {this.state.mode === "test" && (
                    <div className="container-flex">
                      {data.data.map((snap, index) => {
                        return (
                          <div className="block" key={index}>
                            <div className="question">{snap.head}</div>
                            <div className="answer-list">
                              {snap.answer_list.map((ans, i) => {
                                let choose = "choose-btn";
                                let correct = "correct-btn";
                                let normal = "normal-btn";
                                let btn;
                                if (!ans.ischoose && !ans.isCorrect) {
                                  btn = normal;
                                } else if (!ans.isCorrect && ans.ischoose) {
                                  btn = choose;
                                } else if (ans.isCorrect && !ans.ischoose) {
                                  btn = correct;
                                } else if (ans.isCorrect && ans.ischoose) {
                                  btn = correct;
                                }
                                return (
                                  <button
                                    className={"answer " + btn}
                                    key={i}
                                    disabled={ans.disable}
                                    onClick={() =>
                                      this.chooseAnswer(
                                        snap.correct,
                                        ans,
                                        mainIndex,
                                        index,
                                        i
                                      )
                                    }
                                  >
                                    {ans.meaning}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {this.state.mode !== "test" && !this.state.showAnswer && (
                    <div className="container-flex">
                      {data.data.map((snap, index) => {
                        return (
                          <div className="block" key={index}>
                            <div className="question">{snap.head}</div>
                            <div className="answer-list">
                              {snap.answer_list.map((ans, i) => {
                                let choose = "choose-record-btn";
                                let normal = "normal-btn";
                                let btn;
                                if (!ans.ischoose && !ans.isCorrect) {
                                  btn = normal;
                                } else if (!ans.isCorrect && ans.ischoose) {
                                  btn = choose;
                                }
                                return (
                                  <button
                                    className={"answer " + btn}
                                    key={i}
                                    disabled={ans.disable}
                                    onClick={() =>
                                      this.recordAnswer(
                                        ans,
                                        mainIndex,
                                        index,
                                        i
                                      )
                                    }
                                  >
                                    {ans.meaning}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {this.state.mode !== "test" && this.state.showAnswer && (
                    <div className="container-flex">
                      {data.data.map((snap, index) => {
                        return (
                          <div className="block" key={index}>
                            <div className="question">{snap.head}</div>
                            <div className="answer-list">
                              {snap.answer_list.map((ans, i) => {
                                let normal = "normal-btn";
                                let choose = "choose-btn";
                                let correct = "correct-btn";
                                let btn;
                                if (!ans.ischoose && !ans.isCorrect) {
                                  btn = normal;
                                } else if (!ans.isCorrect && ans.ischoose) {
                                  btn = choose;
                                } else if (ans.isCorrect && ans.ischoose) {
                                  btn = correct;
                                } else if (ans.isCorrect && !ans.ischoose) {
                                  btn = correct;
                                } else {
                                }
                                return (
                                  <button
                                    className={"answer " + btn}
                                    key={i}
                                    disabled={ans.disable}
                                    onClick={() =>
                                      this.recordAnswer(
                                        ans,
                                        mainIndex,
                                        index,
                                        i
                                      )
                                    }
                                  >
                                    {ans.meaning}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
        {this.state.mode !== "test" && !this.state.showAnswer && (
          <button className="complete-btn" onClick={this.allComplete}>
            Complete
          </button>
        )}
        {this.state.mode !== "test" && this.state.showAnswer && (
          <Link className="no-link" to="/content">
            <button className="complete-btn" onClick={() => this.backToQuiz()}>
              Back to content
            </button>
          </Link>
        )}
        {this.state.mode === "test" && (
          <Link className="no-link" to="/content">
            <button className="complete-btn" onClick={() => this.backToQuiz()}>
              Back to content
            </button>
          </Link>
        )}
        <Dialog
          open={this.state.dialogOpen}
          onClose={this.handleCloseDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {this.state.scoreText}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleCloseDialog} color="primary" autoFocus>
              OK
            </Button>
          </DialogActions>
        </Dialog>

        {this.state.isError && (
          <ErrorHandleDialog
            message={this.state.errorMessage}
            status={this.state.errorStatus}
            open={this.state.isError}
            close={this.errorDialogClose}
          />
        )}
      </div>
    );
  }
}

export default QuizComponent;
