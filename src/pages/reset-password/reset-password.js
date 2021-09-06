import React from 'react';
import halfBg from '../../img/aa.png';
import { Link } from "react-router-dom";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Button from '@material-ui/core/Button';
import qs from 'qs';
import axios from 'axios';
import { env } from '../../env/development';

class ResetPassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      code: null,
      newPassword: '',
      confirmPassword: '',
      privateCode: '',
      success: false,
      open: false
    }
    this.reset = this.reset.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  componentDidMount() {
    const routePara = qs.parse(this.props.location.search, { ignoreQueryPrefix: true });
    if (routePara && routePara.code) {
      this.setState({
        code: routePara.code
      })
    }
  }

  reset(event) {
    this.setState({ open: true });
    event.preventDefault();
    const data = {
      code: this.state.code,
      password: this.state.newPassword,
      passwordConfirmation: this.state.confirmPassword,
    }
    axios.post(`${env.apiEndPoint}/auth/reset-password`, data)
      .then(res => {
        this.setState({ success: true });
        console.log('Password reset successful ', res);
      }).catch(err => {
        this.setState({ success: false });
        console.error(err);
      })
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  render() {
    let alertTitle = this.state.success === true ? 'Password Reset Sucess!' : 'Password Reset Failed! Please Try again...';
    let route = this.state.success === true ? '/login' : '/reset-password';
    return (
      <div className="signup">
        <div className="img-bg clearFix">
          <p className="upper">A new Language is a New Life
            <span className="under_text">新しい言語は新しい人生の始まり</span>
          </p>
          <img className="img" src={halfBg} alt="decorate"></img>
        </div>
        <form onSubmit={this.reset} className="form">
          <div className="name-wrap">
            <input className="input" type="password" name="newPassword" value={this.state.newPassword} placeholder="New Password" onChange={this.handleChange}></input>
          </div>
          <div className="password-wrap">
            <input className="input" type="password" name="confirmPassword" value={this.state.confirmPassword} placeholder="Confirm New Password" onChange={this.handleChange}></input>
          </div>
          <button className="text-center" disabled={(this.state.newPassword.length === 0 || this.state.confirmPassword.length === 0 || this.state.newPassword !== this.state.confirmPassword)}>OK</button>
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
            <Link className="no-link" to={route}>
              <Button onClick={this.handleClose} color="primary" autoFocus>
                OK
              </Button>
            </Link>
          </DialogActions>
        </Dialog>
      </div>
    )
  }
}

export default ResetPassword;