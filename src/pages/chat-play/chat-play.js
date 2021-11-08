import ChatBot from "react-simple-chatbot";
import React from "react";
import { ThemeProvider } from "styled-components";
// import ChatBot from '../../lib/index';
import "./chat-play.scss";
import { Component } from "react";
import PropTypes from "prop-types";
import { DataUsageSharp } from "@material-ui/icons";

class Review extends Component {
  constructor(props) {
    super(props);

    this.state = {
      keyword: "",
      furigana: "",
      meaning: "",
    };
  }

  dummyN5data = [
    {
      kanji: "会社",
      furigana: "かいしゃ",
    },
    {
      kanji: "会話",
      furigana: "かいわ",
    },
    {
      kanji: "食事",
      furigana: "しょくじ",
    },
    {
      kanji: "用事",
      furigana: "ようじ",
    },
    {
      kanji: "発見",
      furigana: "はっけん",
    },
    {
      kanji: "開発",
      furigana: "かいはつ",
    },
    {
      kanji: "発音 ",
      furigana: "はつおん",
    },
    {
      kanji: "新聞",
      furigana: "しんぶん",
    },
    {
      kanji: "私立",
      furigana: "しりつ",
    },
    {
      kanji: "開始",
      furigana: "かいし",
    },
    {
      kanji: "歌手",
      furigana: "かしゅ",
    },
    {
      kanji: "通院",
      furigana: "つういん",
    },
    {
      kanji: "全体",
      furigana: "ぜんたい",
    },
    {
      kanji: "作家",
      furigana: "さっか",
    },
    {
      kanji: "制作",
      furigana: "せいさく",
    },
    {
      kanji: "作者",
      furigana: "さくしゃ",
    },
    {
      kanji: "工作",
      furigana: "こうさく",
    },
    {
      kanji: "動作",
      furigana: "どうさ",
    },
    {
      kanji: "主人",
      furigana: "しゅじん",
    },
    {
      kanji: "主要",
      furigana: "しゅよう",
    },
    {
      kanji: "地主",
      furigana: "じぬし",
    },
    {
      kanji: "公園",
      furigana: "こうえん",
    },
    {
      kanji: "公正",
      furigana: "こうせい",
    },
    {
      kanji: "以上",
      furigana: "いじょう",
    },
    {
      kanji: "以下",
      furigana: "いか",
    },
  ];

  componentWillMount() {
    const { steps } = this.props;
    console.log(steps)
    const { keyword } = steps;
    this.dummyN5data.forEach((datas) => {
      if (datas.kanji === keyword.value) {
        this.setState({
          keyword: datas.kanji,
          furigana: datas.furigana,
          meaning: "",
        });
      }
    });
  }

  render() {
    const { keyword, furigana, meaning } = this.state;
    console.log(keyword, furigana, meaning);
    return (
      <div style={{ width: "100%" }}>
        {/* <h3>Summary</h3> */}
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
      </div>
    );
  }
}

Review.propTypes = {
  steps: PropTypes.object,
};

Review.defaultProps = {
  steps: undefined,
};

export default function ChatPlay() {
  const theme = {
    background: "#f5f8fb",
    fontFamily: "Helvetica Neue",
    headerBgColor: "#EF6C00",
    headerFontColor: "#fff",
    headerFontSize: "15px",
    botBubbleColor: "#EF6C00",
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
      trigger: "3",
    },
    {
      id: "3",
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
      trigger: "7",
    },
    {
      id: "say-no",
      message: "Opps! what you want to do then..",
      // trigger: "update-fields"
    },

    {
      id: "7",
      component: <Review />,
      asMessage: true,
    },
    // {
    //   id: "review",
    //   component: <Review />,
    //   asMessage: true,
    //   trigger: "update"
    // },

    // {
    //   id: "5",
    //   message: "How old are you?",
    //   trigger: "age"
    // },
    // {
    //   id: "age",
    //   user: true,
    //   trigger: "7",
    //   validator: value => {
    //     if (isNaN(value)) {
    //       return "value must be a number";
    //     } else if (value < 0) {
    //       return "value must be positive";
    //     } else if (value > 120) {
    //       return `${value}? Come on!`;
    //     }

    //     return true;
    //   }
    // },
    // {
    //   id: "7",
    //   message: "Great! Check out your summary",
    //   trigger: "review"
    // },
    // {
    //   id: "review",
    //   component: <Review />,
    //   asMessage: true,
    //   trigger: "update"
    // },
    // {
    //   id: "update",
    //   message: "Would you like to update some field?",
    //   trigger: "update-question"
    // },
    // {
    //   id: "update-question",
    //   options: [
    //     { value: "yes", label: "Yes", trigger: "update-yes" },
    //     { value: "no", label: "No", trigger: "end-message" }
    //   ]
    // },
    // {
    //   id: "update-yes",
    //   message: "What field would you like to update?",
    //   trigger: "update-fields"
    // },
    // {
    //   id: "update-fields",
    //   options: [
    //     { value: "name", label: "Name", trigger: "update-name" },
    //     { value: "gender", label: "Gender", trigger: "update-gender" },
    //     { value: "age", label: "Age", trigger: "update-age" }
    //   ]
    // },
    // {
    //   id: "update-name",
    //   update: "name",
    //   trigger: "7"
    // },
    // {
    //   id: "update-gender",
    //   update: "gender",
    //   trigger: "7"
    // },
    // {
    //   id: "update-age",
    //   update: "age",
    //   trigger: "7"
    // },
    {
      id: "end-message",
      message: "Thanks! Your data was submitted successfully!",
      end: true,
    },
  ];

  return (
    <ThemeProvider theme={theme}>
      <ChatBot steps={steps} />;
    </ThemeProvider>
  );
}
