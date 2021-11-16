import ChatBot from "react-simple-chatbot";
import React from "react";
import { ThemeProvider } from "styled-components";
import "./chat-play.scss";
import { Component } from "react";
import { env } from "../../env/development";
import axios from "axios";
import ShowVideo from "./show-video";
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
      .get(`${env.apiEndPoint}/words-collections`)
      .then((res) => {
        console.log(res.data);
        this.setState({ dummyN5data: res.data });
        res.data.forEach((datas) => {
          if (
            datas.kanji === keyword.value ||
            datas.furigana === keyword.value
          ) {
            this.setState({
              keyword: datas.kanji,
              furigana: datas.furigana,
              meaning: datas.myanmarMeaning,
            });
          }
        });
      })
      .catch((err) => console.error(err));
  }

  render() {
    const { keyword, furigana, meaning } = this.state;
    return (
      <div style={{ width: "100%" }}>
        {this.state.dummyN5data.length > 0 && keyword && (
          <table>
            <tbody>
              <tr>
                <td>Kanji: </td>
                <td>{keyword}</td>
              </tr>
              <tr>
                <td>Furigana: </td>
                <td>{furigana}</td>
              </tr>
              <tr>
                <td>Meaning: </td>
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

export default function ChatPlay() {
  const theme = {
    background: "#f5f8fb",
    fontFamily: "Helvetica Neue",
    headerBgColor: "#EF2F7F",
    headerFontColor: "#fff",
    headerFontSize: "14px",
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
      message: "Soo, do you want me to tell some funny things?",
      trigger: "update-funny",
    },
    {
      id: "update-funny",
      options: [
        { value: "yes", label: "Yes", trigger: "say-fun" },
        { value: "no", label: "No thanks!", trigger: "say-nofun" },
      ],
    },
    {
      id: "say-fun",
      message: "Btw, how many pounds do you have?",
      trigger: "pound",
    },
    {
      id: "say-nofun",
      message: "Do you want any songs to listen?",
      trigger: "update-music",
    },
    {
      id: "update-music",
      options: [
        { value: "yes", label: "Yes", trigger: "listen" },
        { value: "no", label: "No thanks!", trigger: "no-listen" },
      ],
    },
    {
      id: "listen",
      component: <ShowVideo />,
      asMessage: true,
      trigger: "no-listen",
    },
    {
      id: "no-listen",
      message: "hehe, then see you next time..",
      // trigger: "update",
    },
    {
      id: "pound",
      user: true,
      trigger: "4",
    },
    {
      id: "4",
      message: "I only have 2 pounds(left and right), hehe",
      trigger: "say-nofun",
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
      <ChatBot steps={steps} />
    </ThemeProvider>
  );
}
