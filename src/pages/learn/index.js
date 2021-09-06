import React from 'react';
import kanjiPic from '../../img/kanji.png';
import "./learn.scss";
import KanjiDetail from '../../components/kanji-detail';
import { withRouter } from 'react-router-dom';
import Pagination from "../../components/pagination/pagination";
import axios from 'axios';
import { env } from '../../env/development';
import { repeat } from 'lodash';

const defaultProps = {
  data: [],
  pageOfItems: [],
  level: '',
  currentChapter: 1
}

class Learn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dialogOpen: false,
      selectedIndex: null,
      data: [],
      pageOfItems: [],
      inputvalue: '',
      currentChapter: 1
    }
    defaultProps.level = localStorage.getItem('level')
    this.kind = defaultProps.level;
    this.closeDialog = this.closeDialog.bind(this);
    this.onChangePage = this.onChangePage.bind(this);
    this.search = this.search.bind(this)
  }
  componentDidMount() {
    axios.get(env.apiEndPoint + '/kanjis', { params: { level: this.kind, _limit: -1 } })
      .then((response) => {
        this.setState({ data: response.data })
        defaultProps.data = response.data;
      })
      .catch((error) => console.error(error));
  }
  openDialog(id) {
    this.setState({ dialogOpen: true, selectedIndex: id });
  }
  closeDialog() {
    this.setState({ dialogOpen: false, selectedIndex: null });
  }
  search = (event) => {
    this.setState({
      data: defaultProps.data.filter(item => {
        return item.kunRomaji.toLowerCase().includes(event.target.value.toLowerCase()) ||
          item.kanji.toLowerCase().includes(event.target.value.toLowerCase()) ||
          item.meaning.toLowerCase().includes(event.target.value.toLowerCase())
      })
    });
    this.setState({
      pageOfItems: this.state.data.filter(item => {
        return item.kunRomaji.toLowerCase().includes(event.target.value.toLowerCase())
      })
    })
    if (event.target.value.length < 1) {
      this.setState({ pageOfItems: defaultProps.pageOfItems, data: defaultProps.data })
    }
  }
  onChangePage(pageOfItems, currentChapter) {
    this.setState({ pageOfItems: pageOfItems, currentChapter: currentChapter })
    defaultProps.pageOfItems = pageOfItems;
    defaultProps.currentChapter = currentChapter;
  }
  render() {
    return (
      <div className="learn">
        <h1 className="header">Learn {this.kind} kanji </h1>
        <div className="chapter-selection clearFix">
          <input
            className="find clearFix"
            type="text"
            placeholder="Search"
            onChange={this.search}
          ></input>
        </div>
        <h2 className="chapter">Chapter {this.state.currentChapter}</h2>
        <div className="container clearFix">
          {this.state.pageOfItems.map((words) => {
            const imgUrl = env.apiEndPoint + words.logoPicture?.formats.thumbnail.url;
            return (
              <div
              style={{ 
                background: `url(${imgUrl}) white no-repeat right` 
              }}
                onClick={() => this.openDialog(words.id)}
                key={words.id}
                className="block clearFix">
                <div className="mean">
                  <span className="kanji">{words.kanji}</span>
                  ({words.kunRomaji}) = {words.meaning}</div>
                {/* <img className="logo" src={words.logoPicture ? imgUrl : kanjiPic} alt="kanji logo"></img> */}
              </div>
            )
          })}
        </div>
        <div>
          {this.state.data.length > 0 &&
            <Pagination data={this.state.data} showPage='true' onChangePage={this.onChangePage} />
          }
        </div>
        {this.state.pageOfItems.length > 0 &&
          <KanjiDetail
            open={this.state.dialogOpen}
            close={this.closeDialog}
            data={this.state.pageOfItems}
            index={this.state.selectedIndex} />
        }
      </div>
    )
  }
}

export default withRouter(Learn);