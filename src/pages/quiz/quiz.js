import React from "react";
import "./quiz.scss";
import axios from "axios";
import _ from "lodash";
import { env } from "../../env/development";
import QuizComponent from "../../components/quiz-component/quiz-component";
import qs from "qs";
import Select from "react-select";
import TopScorers from "../../components/top-scorer/top-scores";
import ErrorHandleDialog from "../../components/error-handle-dialog/error-handle-dialog";

const checkBoxItems = [
  { name: "Answer with meaning", value: "answerWithMeaning" },
  { name: "Answer with kanji", value: "answerWithKanji" },
  { name: "Answer with kunyoumi", value: "answerWithKunyoumi" },
  { name: "Answer with onyoumi", value: "answerWithOnyoumi" },
  { name: "Answer with pictures", value: "answerWithPictures" },
];

class Quiz extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isGuest: true,
      showForm: true,
      showQuiz: false,
      totalKanji: 0,
      level: "N5",
      answerWithMeaning: [],
      answerWithKanji: [],
      answerWithKunyomi: [],
      answerWithOnyomi: [],
      mode: "test",
      kind: "random",
      count: 20,
      allChapters: [],
      remainChapters: [],
      selectedChapters: [],
      options: [
        "answerWithMeaning",
        "answerWithKanji",
        "answerWithKunyoumi",
        "answerWithOnyoumi",
        "answerWithPictures",
      ],
      isError: false,
      errorMessage: "",
      errorStatus: 0,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeForCheck = this.handleChangeForCheck.bind(this);
    this.handeleSubmit = this.handeleSubmit.bind(this);
    this.allComplete = this.allComplete.bind(this);
    this.errorDialogClose = this.errorDialogClose.bind(this);
  }

  componentDidMount() {
    const level = localStorage.getItem("level");
    const loginUser = JSON.parse(localStorage.getItem("loginUser"));
    if (loginUser.id === "guest") {
      this.setState({ isGuest: true });
    } else {
      this.setState({ isGuest: false });
    }
    this.setState({
      level,
    });
    axios
      .get(env.apiEndPoint + "/kanjis/count", {
        params: {
          level,
          _limit: -1,
        },
        paramsSerializer: (params) => {
          return qs.stringify(params);
        },
      })
      .then((res) => {
        this.setState({
          totalKanji: Number(res.data),
        });
        const chaps = [];
        const first = [];
        const remain = [];
        let countChapter = this.state.totalKanji / 10;
        countChapter = parseInt(countChapter, 10);
        if (this.state.totalKanji % 10 !== 0) {
          countChapter += 1;
        }
        for (let i = 1; i <= countChapter; i++) {
          let end = i * 10;
          const start = end - 10;
          end = end < this.state.totalKanji ? end : this.state.totalKanji;
          chaps.push({
            label: "Chapter " + i,
            value: i,
            start,
            end,
          });
          if (i === 1) {
            first.push({
              label: "Chapter " + i,
              value: i,
              start,
              end,
            });
          } else {
            remain.push({
              label: "Chapter " + i,
              value: i,
              start,
              end,
            });
          }
        }
        this.setState({
          allChapters: chaps,
          selectedChapters: first,
          remainChapters: remain,
        });
      })
      .catch((error) => {
        console.error("Error in setState : ", error);
        if (error.response) {
          const errorDict = error.response;
          this.setState({
            isError: true,
            errorMessage: errorDict.statusText,
            errorStatus: errorDict.status,
          });
        }
      });
  }

  chooseAnswer(correct, ans, mainIndex, childIndex) {
    let changeState = _.cloneDeep(this.state.answerWithKanji);
    const restToFalse = changeState[mainIndex].answer_list.map((lst) => {
      if (correct === lst.meaning) {
        lst.isCorrect = true;
      }
      lst.disable = true;
      return lst;
    });
    changeState[mainIndex].answer_list = restToFalse;
    changeState[mainIndex].answer_list[childIndex].ischoose = !ans.ischoose;
    this.setState({ answerWithKanji: changeState });
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleSelectRemove(selectChap) {
    if (selectChap) {
      const select = _.cloneDeep(this.state.selectedChapters);
      _.remove(select, (s) => {
        return s.value === selectChap.value;
      });
      const remain = _.cloneDeep(this.state.remainChapters);
      remain.push(selectChap);
      this.setState({
        selectedChapters: select,
        remainChapters: remain,
      });
    }
  }

  handleSelectAdd(event) {
    if (event.value !== "") {
      const value = parseInt(event.value);
      const remain = _.cloneDeep(this.state.remainChapters);
      const select = _.cloneDeep(this.state.selectedChapters);
      const addIndex = _.findIndex(remain, (re) => {
        return re.value === value;
      });
      select.push(remain[addIndex]);
      _.remove(remain, (r) => {
        return r.value === value;
      });
      this.setState({
        selectedChapters: select,
        remainChapters: remain,
      });
    }
  }

  handleChangeForCheck(event, i) {
    const index = this.state.options.indexOf(event.target.value);
    let checkItem = _.cloneDeep(this.state.options);
    if (!event.target.checked) {
      checkItem.splice(index, 1);
      this.setState({
        options: checkItem,
      });
    } else {
      checkItem.push(event.target.value);
      this.setState({
        options: checkItem,
      });
    }
  }

  definePara() {
    let para = {};
    if (this.state.mode !== "exam") {
      const chapter = _.map(this.state.selectedChapters, (seleChap) => {
        return {
          start: seleChap.start,
          end: seleChap.end,
        };
      });
      para = {
        level: this.state.level,
        mode: this.state.mode,
        kind: this.state.kind,
        options: this.state.options,
      };
      if (this.state.kind === "random") {
        para.count = this.state.count;
      } else {
        para.chapter = chapter;
      }
    } else {
      const allOptions = _.map(checkBoxItems, (i) => i.value);
      para = {
        level: this.state.level,
        mode: this.state.mode,
        kind: "random",
        count: 30,
        options: allOptions,
      };
    }
    return para;
  }

  handeleSubmit() {
    const para = this.definePara();
    axios
      .get(env.apiEndPoint + "/quiz", {
        params: para,
        paramsSerializer: (params) => {
          return qs.stringify(params);
        },
      })
      .then((res) => {
        this.setState({
          answerWithMeaning: res.data.answer_with_meaning,
          answerWithKanji: res.data.answer_with_kanji,
          answerWithKunyomi: res.data.answer_with_kunyomi,
          answerWithOnyomi: res.data.answer_with_onyomi,
          showForm: false,
          showQuiz: true,
        });
      })
      .catch((error) => {
        if (error.response) {
          console.error("Error in setState : ", error.response);
          const errorDict = error.response;
          this.setState({
            isError: true,
            errorMessage: errorDict.statusText,
            errorStatus: errorDict.status,
          });
        }
      });
  }

  errorDialogClose(close) {
    this.setState({
      isError: close,
      errorMessage: "",
      errorStatus: 0,
    });
  }

  allComplete() {
    this.setState({
      answerWithMeaning: [],
      answerWithKanji: [],
      answerWithKunyomi: [],
      answerWithOnyomi: [],
      showForm: true,
      showQuiz: false,
    });
  }

  render() {
    return (
      <div className="quiz">
        <div className="main">
          {!this.state.isGuest && <TopScorers />}
          <h1 className="head">Quiz for {this.state.level}</h1>
          {this.state.showForm && (
            <form className="form">
              {!this.state.isGuest && (
                <div>
                  <label className="form-label">Mode</label>
                  <label className="form-field" htmlFor="test">
                    <input
                      type="radio"
                      id="test"
                      name="mode"
                      checked={this.state.mode === "test"}
                      onChange={this.handleChange}
                      value="test"
                    />
                    Test
                  </label>
                  <label className="form-field" htmlFor="practise">
                    <input
                      type="radio"
                      id="practise"
                      name="mode"
                      checked={this.state.mode === "practise"}
                      onChange={this.handleChange}
                      value="practise"
                    />
                    Practise
                  </label>
                  <label className="form-field" htmlFor="exam">
                    <input
                      type="radio"
                      id="exam"
                      name="mode"
                      checked={this.state.mode === "exam"}
                      onChange={this.handleChange}
                      value="exam"
                    />
                    Exam
                  </label>
                </div>
              )}

              {this.state.mode !== "exam" && (
                <div>
                  <div>
                    <label className="form-label">Kind</label>
                    <label className="form-field" htmlFor="random">
                      <input
                        type="radio"
                        id="random"
                        name="kind"
                        checked={this.state.kind === "random"}
                        onChange={this.handleChange}
                        value="random"
                      />
                      Random
                    </label>
                    <label className="form-field" htmlFor="chapter">
                      <input
                        type="radio"
                        id="chapter"
                        name="kind"
                        checked={this.state.kind === "chapter"}
                        onChange={this.handleChange}
                        value="chapter"
                      />
                      Chapter
                    </label>
                  </div>

                  {this.state.kind === "random" && (
                    <div>
                      <label className="form-label">Count</label>
                      <input
                        type="number"
                        className="form-field input-range"
                        name="count"
                        value={this.state.count}
                        min={10}
                        max={50}
                        onChange={this.handleChange}
                      ></input>
                      {(this.state.count < 10 || this.state.count > 50) && (
                        <p className="error-message">
                          *** Count must be number between 10 and 50 range ***
                        </p>
                      )}
                    </div>
                  )}

                  {this.state.kind === "chapter" && (
                    <div>
                      <label className="form-label">Chapters</label>
                      <Select
                        value={this.state.remainChapters.value}
                        options={this.state.remainChapters}
                        defaultValue={this.state.remainChapters[1]}
                        className="form-field input-range"
                        name="chapters"
                        id="chapters"
                        onChange={(e) => this.handleSelectAdd(e)}
                      />
                      <div>
                        {this.state.selectedChapters.map(
                          (selectedChapter, i) => {
                            return (
                              <p className="select-chapter-box" key={i}>
                                {selectedChapter.label}
                                <span
                                  onClick={() =>
                                    this.handleSelectRemove(selectedChapter)
                                  }
                                  className="cross"
                                >
                                  &#10060;
                                </span>
                              </p>
                            );
                          }
                        )}
                      </div>
                      {this.state.selectedChapters.length === 0 && (
                        <p className="error-message">
                          *** Choose at least one chapter ***
                        </p>
                      )}
                    </div>
                  )}

                  <div>
                    <label className="form-label">Options</label>
                    {checkBoxItems.map((opt, i) => {
                      return (
                        <label
                          key={opt.value}
                          className="form-field check-btn"
                          htmlFor={opt.value}
                        >
                          <input
                            type="checkbox"
                            id={opt.value}
                            name="options"
                            checked={
                              this.state.options.indexOf(opt.value) === -1
                                ? false
                                : true
                            }
                            onChange={(e) => this.handleChangeForCheck(e, i)}
                            disabled={opt.value === "answerWithPictures"}
                            value={opt.value}
                          />
                          {opt.name}
                        </label>
                      );
                    })}
                    {this.state.options.length < 2 && (
                      <p className="error-message">
                        *** Choose at least one option ***
                      </p>
                    )}
                  </div>
                </div>
              )}
              <button
                className="btn-submit"
                type="button"
                disabled={
                  this.state.options.length < 2 ||
                  this.state.count < 10 ||
                  this.state.count > 50 ||
                  this.state.selectedChapters.length === 0
                }
                onClick={this.handeleSubmit}
              >
                Let Start
              </button>
            </form>
          )}
          {this.state.showQuiz && (
            <QuizComponent
              mode={this.state.mode}
              kind={this.state.kind}
              count={this.state.count}
              level={this.state.level}
              chapters={this.state.selectedChapters}
              answerWithMeaning={this.state.answerWithMeaning}
              answerWithKanji={this.state.answerWithKanji}
              answerWithKunyomi={this.state.answerWithKunyomi}
              answerWithOnyomi={this.state.answerWithOnyomi}
            ></QuizComponent>
          )}
          {this.state.isError && (
            <ErrorHandleDialog
              message={this.state.errorMessage}
              status={this.state.errorStatus}
              open={this.state.isError}
              close={this.errorDialogClose}
            />
          )}
        </div>
      </div>
    );
  }
}

export default Quiz;
