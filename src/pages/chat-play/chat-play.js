import ChatBot from "react-simple-chatbot";
import React from "react";
import { ThemeProvider } from "styled-components";
// import ChatBot from '../../lib/index';
import "./chat-play.scss";
import { Component } from "react";
import PropTypes from "prop-types";
import { env } from "../../env/development";
import axios from "axios";

class Review extends Component {
  constructor(props) {
    super(props);
    this.state = {
      keyword: "",
      furigana: "",
      meaning: "",
      dummyN5data: [],
    };
  }

  componentDidMount() {
    console.log(this.props);
    const { steps } = this.props;
    console.log(steps);
    const { keyword } = steps;
    axios
      .get(`${env.apiEndPoint}/lone-twals`)
      .then((res) => {
        console.log(res.data);
        this.setState({ dummyN5data: res.data });
        res.data.forEach((datas) => {
          if (datas.kanji === keyword.value) {
            this.setState({
              keyword: datas.kanji,
              furigana: datas.furigana,
              meaning: "",
            });
          }
        });
      })
      .catch((err) => console.error(err));
  }

  render() {
    const { keyword, furigana, meaning } = this.state;
    console.log(keyword, furigana);
    return (
      <div style={{ width: "100%" }}>
        {this.state.dummyN5data.length > 0 && keyword && (
          <table>
            <tbody>
              <tr>
                <td>Keyword : </td>
                <td>{keyword}</td>
              </tr>
              <tr>
                <td>Furigana : </td>
                <td>{furigana}</td>
              </tr>
              <tr>
                <td>Meaning : </td>
                <td>{meaning}</td>
              </tr>
            </tbody>
          </table>
        )}
        {this.state.dummyN5data.length > 0 && !keyword && (
          <p style={{ padding: "0", margin: "0" }}>
            I am sorry. I can't find this keyword
          </p>
        )}
      </div>
    );
  }
}

Review.propTypes = {
  steps: PropTypes.object,
  scrollValue: PropTypes.array,
};

Review.defaultProps = {
  steps: undefined,
  scrollValue: undefined,
};

export default function ChatPlay() {
  const theme = {
    background: "#f5f8fb",
    fontFamily: "Helvetica Neue",
    headerBgColor: "#EF2F7F",
    headerFontColor: "#fff",
    headerFontSize: "15px",
    botBubbleColor: "#EF2F7F",
    botFontColor: "#fff",
    userBubbleColor: "#fff",
    userFontColor: "#4a4a4a",
  };

  const steps = [
    {
      id: "1",
      message: "Hey Welcome, How are you?",
      trigger: "name",
    },
    {
      id: "name",
      user: true,
      trigger: "2",
    },
    {
      id: "2",
      message: "Is there anything to ask?",
      trigger: "gender",
    },
    {
      id: "gender",
      options: [
        { value: "yes", label: "Yes", trigger: "say-yes" },
        { value: "no", label: "No thanks!", trigger: "say-no" },
      ],
    },
    {
      id: "say-yes",
      message: "Go ahead.. I will answer if I know the keyword..",
      trigger: "keyword",
    },
    {
      id: "keyword",
      user: true,
      trigger: "3",
    },
    {
      id: "say-no",
      message: "Opps! what you want to do then..",
      // trigger: "update-fields"
    },

    {
      id: "3",
      component: <Review />,
      asMessage: true,
      trigger: "update",
    },
    {
      id: "update",
      message: "Would you like to ask some more?",
      trigger: "update-question",
    },
    {
      id: "update-question",
      options: [
        { value: "yes", label: "Yes", trigger: "say-yes" },
        { value: "no", label: "No", trigger: "end-message" },
      ],
    },
    {
      id: "end-message",
      message: "Thank you for asking!",
      end: true,
    },
  ];

  return (
    <ThemeProvider theme={theme}>
      <ChatBot steps={steps} />;
    </ThemeProvider>
  );
}
