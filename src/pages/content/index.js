import "./content.scss"
import { Link } from "react-router-dom";

function Content() {
  return (
    <div className="content">
      <div className="content-logo clearFix">
        <div className="logo1">
          <div className="content-log1"></div>
        </div>
        <div className="content-log2"></div>
      </div>
      <div className="content-section">
        <div className="main-section">
          <div className="section">
            <Link to={{
              pathname: "/learn",
            }}>
              <div className="link">
                <p>Learn</p>
              </div>
            </Link>
          </div>
          <div className="section">
            <Link to="/quiz">
              <div className="link">
                <p>Quiz</p>
              </div>
            </Link>
          </div>
          <div className="section">
            <Link to="/comming-soon">
              <div className="link">
                <p>Game</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Content;