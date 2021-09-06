import React from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';
import { env } from '../../env/development';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Button from '@material-ui/core/Button';

import halfBg from '../../img/aa.png';


class ForgetPassword extends React.Component {
  constructor() {
    super();
    this.state = {
      email: '',
      open: false,
      setOpen: false,
      success: false
    }
    this.resetPassword = this.resetPassword.bind(this);
    this.loginInAsGuest = this.loginInAsGuest.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }
  resetPassword(event) {
    event.preventDefault();
    this.setState({ open: true });
    const resetMail = this.state.email;
    axios.post(`${env.apiEndPoint}/auth/forgot-password`, { email: resetMail })
      .then(res => {
        this.setState({ success: true });
        console.log('reset password OK ', res);
      }).catch(err => {
        this.setState({success: false});
        console.error(err);
      })
  }
  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    })
  }
  loginInAsGuest() {
    this.setState({ success: true });
    localStorage.setItem('loginUser', JSON.stringify({ id: 'guest' }));
  }
  handleClose() {
    this.setState({ open: false })
  }
  render() {
    let alertTitle = this.state.success === true ? 'Password reset mail sent successful!' : 'ForgetPassword Failed! Please Try again...';
    // let route = this.state.success === true ? '/top' : '/login';
    return (
      <div className="signup">
        <div className="img-bg clearFix">
          <p className="upper">A new Language is a New Life
            <span className="under_text">新しい言語は新しい人生の始まり</span>
          </p>
          <img className="img" src={halfBg} alt="decorate"></img>
        </div>
        <form onSubmit={this.resetPassword} className="form">
          <div className="name-wrap">
            <input className="input" name="email" value={this.state.name} placeholder="Email" onChange={this.handleChange}></input>
          </div>
          <button className="text-center" disabled={(this.state.email.length === 0)}>SENT EMAIL</button>
          <span className="text-center">OR</span>
          {/* <a href="/top" className="text-center">Login As Guest</a> */}
          <Link onClick={this.loginInAsGuest} to="/top" className="text-center">
            <div>Login As Guest</div>
          </Link>
        </form>
        <Dialog
          open={this.state.open}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {alertTitle}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary" autoFocus>
              OK
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    )
  }
}

export default ForgetPassword;