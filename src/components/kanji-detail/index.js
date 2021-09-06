import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import kanjiPic from '../../img/kanji.png';
import './kanji-detail-dialog.scss';
import _, { isNil } from 'lodash';
import { env } from '../../env/development';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function KanjiDetail(props) {
  const [kanjiItem, setKanjiItem] = React.useState(null);
  const [currentIndex, setCurrentIndex] = React.useState(null);
  const { open, close, data, index } = props;
  console.log(kanjiItem)
  const imgUrl = env.apiEndPoint + kanjiItem?.logoPicture.formats.thumbnail.url;
console.log(imgUrl)
  const setCurrent = () => {
    if (!isNil(currentIndex)) {
      setCurrentIndex(currentIndex);
    } else if (data && data.length > 0) {
      const current = _.findIndex(data, { id: index });
      if (current !== -1) {
        setCurrentIndex(current);
      }
    }
  }

  const setDetail = (current) => {
    const res = current === -1 ? null : data[current];
    setKanjiItem(res);
  }

  const handlePrevious = () => {
    const previousIndex = currentIndex - 1;
    if (previousIndex >= 0 && previousIndex < data.length) {
      setCurrentIndex(previousIndex);
      setKanjiItem(data[currentIndex]);
    }
  }

  const handleNext = () => {
    const nextIndex = currentIndex + 1;
    if (nextIndex >= 0 && nextIndex < data.length) {
      setCurrentIndex(nextIndex);
      setKanjiItem(data[currentIndex]);
    }
  }

  const dialogClose = () => {
    setCurrentIndex(null);
    setKanjiItem(null);
    close();
  }

  React.useEffect(() => {
    setCurrent();
    setDetail(currentIndex);
  });

  let pageCount = String(currentIndex + 1) + " of " + String(data.length);
  return (
    <div>
      {kanjiItem ?
        <Dialog
          open={open}
          TransitionComponent={Transition}
          keepMounted
          onClose={() => dialogClose()}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle id="alert-dialog-slide-title">{kanjiItem.kanji} [ {kanjiItem.kunRomaji} ]</DialogTitle>
          <DialogContent>
            <div className="clearFix">
              <img className="kanji-example" src={ kanjiItem?.logoPicture ? imgUrl : kanjiPic} alt={kanjiItem.kunRomaji}></img>
              <ul className="meaning-lst">
                <li>Meaning</li>
                <ul>
                  <li>{kanjiItem.meaning}</li>
                </ul>
                <li>Onyomi</li>
                <ul>
                  <li>{kanjiItem.onyomi}</li>
                  <li>{kanjiItem.onRomaji}</li>
                </ul>
                <li>Kunyomi</li>
                <ul>
                  <li>{kanjiItem.kunyomi}</li>
                  <li>{kanjiItem.kunRomaji}</li>
                </ul>
                {/* <li>Examples</li>
                <ul>
                  <li>This is an example text.</li>
                  <li>This is an example text.</li>
                </ul> */}
              </ul>
              {/* <img className="kanji-example" src={kanjiPic} alt={kanjiItem.kunRomaji}></img> */}

            </div>
            <p className="page-count">
              <button onClick={handlePrevious}>Previous</button>
              {pageCount}
              <button onClick={handleNext}>Next</button>
            </p>

          </DialogContent>
          <DialogActions>
            <Button className="right-corner" onClick={() => dialogClose()} color="primary">
              close
            </Button>
          </DialogActions>
        </Dialog> : <div></div>}
    </div>
  );
}
