import React, { Component } from "react";
import "./signup.scss";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";
import axios from "axios";
import { env } from "../../env/development";
import halfBg from "../../img/aa.png";

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      password: "",
      open: false,
      isNameValid: true,
      isEmailValid: true,
      isPassValid: true,
      pending: true,
      success: false
    };
    this.handleChangePassword = this.handleChangePassword.bind(this);
    this.handleChangeUser = this.handleChangeUser.bind(this);
    this.singup = this.singup.bind(this);
    this.handleChangeForEmail = this.handleChangeForEmail.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  singup(event) {
    this.setState({ open: true, pending: true });
    event.preventDefault();
    axios
      .post(env.apiEndPoint + "/auth/local/register", {
        username: this.state.name,
        email: this.state.email,
        password: this.state.password,
        confirmed: true,
        blocked: false,
        provider: "local",
      })
      .then(() => {
        this.setState({
          success: true,
          pending: false
        });
      })
      .catch((err) => {
        this.setState({
          success: false,
          pending: false
        });
        console.error(err);
      });
  }

  handleChangeForEmail(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
    var pattern = new RegExp(
      /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
    );
    if (!pattern.test(event.target.value)) {
      this.setState({ isEmailValid: false });
    } else {
      this.setState({ isEmailValid: true });
    }
  }

  handleChangePassword(event) {
    this.setState({
      password:
        event.target.name === "password"
          ? event.target.value
          : this.state.password,
    });
    if (event.target.value.length >= 6 && this.state.name.length > 0) {
      this.setState({ isPassValid: true });
    } else {
      this.setState({ isPassValid: false });
    }
  }

  handleChangeUser(event) {
    if (event.target.value.length >= 4 && this.state.name.length > 0) {
      this.setState({ isNameValid: true });
    } else {
      this.setState({ isNameValid: false });
    }
    this.setState({
      name: event.target.name === "name" ? event.target.value : this.state.name,
    });
  }

  handleClose() {
    this.setState({
      name: "",
      email: "",
      password: "",
      open: false,
      isNameValid: true,
      isEmailValid: true,
      isPassValid: true,
      pending: true,
      success: false,
    });
  }

  render() {
    let alertTitle;
    if (this.state.pending) {
      alertTitle = "Registration in Process...";
    } else if (this.state.success) {
      alertTitle = "Sign up Success! Please Login again...";
    } else {
      alertTitle = "Registration Failed! Please check your Information again...";
    }
    let route = this.state.success ? "login" : "signup";
    return (
      <div className="signup">
        <div className="img-bg clearFix">
          <p className="upper">
            A new Language is a New Life
            <span className="under_text">新しい言語は新しい人生の始まり</span>
          </p>
          <img className="img" alt="decorate" src={halfBg}></img>
        </div>
        <form onSubmit={this.singup} className="form">
          <div className="name-wrap">
            <input
              className="input"
              name="name"
              value={this.state.name}
              placeholder="Name"
              onChange={this.handleChangeUser}
            ></input>
            {!this.state.isNameValid && (
              <span className="err_text">
                username must be at least 4 charaters long
              </span>
            )}
          </div>
          <div className="name-wrap">
            <input
              className="input"
              type="email"
              name="email"
              value={this.state.email}
              placeholder="Email"
              onChange={this.handleChangeForEmail}
            ></input>
            {!this.state.isEmailValid && (
              <span className="err_text">invalid Email</span>
            )}
          </div>
          <div className="password-wrap">
            <input
              className="input"
              type="password"
              name="password"
              value={this.state.password}
              placeholder="Password"
              onChange={this.handleChangePassword}
            ></input>
            {!this.state.isPassValid && (
              <span className="err_text">
                password must be at least 6 charaters long
              </span>
            )}
          </div>
          <button
            type="submit"
            className="text-center"
            disabled={
              this.state.name.length === 0 ||
              this.state.password.length === 0 ||
              this.state.email.length === 0 ||
              !this.state.isNameValid ||
              !this.state.isEmailValid ||
              !this.state.isPassValid
            }
          >
            SIGN UP
          </button>
          <a href="/login" className="text-center">
            Already an Account? Login in
          </a>
        </form>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          className="dialog"
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {alertTitle}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Link className="no-link" to={route}>
              <Button
                className="no-link"
                onClick={this.handleClose}
                color="primary"
                autoFocus
              >
                OK
              </Button>
            </Link>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}
export default Signup;
