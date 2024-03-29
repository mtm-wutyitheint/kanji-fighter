import React, { Component } from "react";
import "../signup/signup.scss";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";
import { env } from "../../env/development";
import axios from "axios";
import halfBg from "../../img/aa.png";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      password: "",
      open: false,
      setOpen: false,
      pending: true,
      success: false,
      notFound: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.singup = this.singup.bind(this);
    this.loginInAsGuest = this.loginInAsGuest.bind(this);
    sessionStorage.setItem('game', false);
  }
  singup(event) {
    this.setState({ open: true, pending: true });
    event.preventDefault();
    let name = this.state.name;
    let trimName = name.trim();
    try {
      axios
        .post(env.apiEndPoint + "/auth/local", {
          identifier: trimName,
          password: this.state.password,
        })
        .then((response) => {
          console.log(response.status)
          if (response.status === 200) {
            this.setState({ success: true, pending: false });
            console.log(response.data)
            localStorage.setItem("loginUser", JSON.stringify(response.data));
          } else {
            this.setState({ success: false, pending: false });
          }
        })
        .catch((err) => {
          console.error(err);
          this.setState({ success: false, pending: false });
        });
    } catch (error) {
      console.error(error);
      this.setState({ success: false, pending: false });
    }
  }
  handleChange(event) {
    this.setState({
      name: event.target.name === "name" ? event.target.value : this.state.name,
    });
    this.setState({
      password:
        event.target.name === "password"
          ? event.target.value
          : this.state.password,
    });
  }
  handleClose = () => {
    this.setState({ open: false, name: "", password: "" });
  };
  loginInAsGuest() {
    this.setState({ success: true });
    sessionStorage.setItem("loginUser", JSON.stringify({ id: "guest" }));
    sessionStorage.setItem('game', false);
  }
  render() {
    console.log (this.state.notFound)
    let alertTitle;
    if (this.state.pending) {
      alertTitle = "Please wait! Login is Processing...";
    } else if (this.state.success) {
      alertTitle = "Login Sucess!";
    }  else {
      alertTitle = "User not found!";
    }
    let route = this.state.success ? "/top" : "/login";
    return (
      <div className="signup">
        <div className="img-bg clearFix">
          <p className="upper">
            A new Language is a New Life
            <span className="under_text">新しい言語は新しい人生の始まり</span>
          </p>
          <img className="img" src={halfBg} alt="decorate"></img>
        </div>
        <form onSubmit={this.singup} className="form">
          <div className="name-wrap">
            <input
              className="input"
              name="name"
              value={this.state.name}
              placeholder="Name or Email"
              onChange={this.handleChange}
            ></input>
          </div>
          <div className="password-wrap">
            <input
              className="input"
              type="password"
              name="password"
              value={this.state.password.trim()}
              placeholder="Password"
              onChange={this.handleChange}
            ></input>
          </div>
          <button
            className="text-center"
            disabled={
              this.state.name.trim().length === 0 || this.state.password.trim().length === 0
            }
          >
            Login
          </button>

          <Link to="/signup" className="text-center">
            Create New One?
          </Link>
          <Link to="/forget-password" className="text-center">
            Forget your password?
          </Link>
          <span className="text-center">OR</span>
          <Link onClick={this.loginInAsGuest} to="/top" className="text-center">
            <div>Login As Guest</div>
          </Link>
        </form>
        <Dialog
          open={this.state.open}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          style={{ color: "red" }}
        >
          <DialogContent
            style={{
              width: "230px",
              height: "35px",
              color: "black",
              padding: "15px 10px -5px 10px",
            }}
          >
            <DialogContentText
              style={{
                color: "black",
                fontSize: "14px",
              }}
              id="alert-dialog-description"
            >
              {alertTitle}
            </DialogContentText>
          </DialogContent>
          {!this.state.pending && (
            <DialogActions
              style={{
                padding: "0",
              }}
            >
              <Link className="no-link" to={route}>
                <Button onClick={this.handleClose} color="primary" autoFocus>
                  OK
                </Button>
              </Link>
            </DialogActions>
          )}
        </Dialog>
      </div>
    );
  }
}
export default Login;
