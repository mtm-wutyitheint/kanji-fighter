import React, { useEffect } from 'react';
import AppBar from '@material-ui/core/AppBar';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import { useHistory } from 'react-router-dom';
import Toolbar from '@material-ui/core/Toolbar';
import './top-nav.scss';
import { isNil } from 'lodash';
import { env } from "../../env/development";
import { Button } from '@material-ui/core';

export default function TopNav() {
  const [auth, setAuth] = React.useState(true);
  const [guest, setUser] = React.useState(true);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const history = useHistory();
  const loginUser = JSON.parse(localStorage.getItem('loginUser'));

  const currentLoginUser = () => {
    const loginUser = JSON.parse(localStorage.getItem('loginUser'));
    const guestUser = JSON.parse(sessionStorage.getItem('loginUser'));
    if(guestUser) {
      setUser(true);
    } else {
      setUser(false);
    }
    if (isNil(loginUser) || isNil(loginUser.jwt) || isNil(loginUser.user)) {
      setAuth(false);
    } else {
      setAuth(true);
    }
  }

 

  useEffect(() => {
    currentLoginUser();
  })

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.clear();
    history.push('/login');
    setAnchorEl(null);
  }

  const handleProfile = () => {
    history.push('/profile');
    setAnchorEl(null);
  }

  function setLevel(level) {
    localStorage.setItem('level', level);
  }

  return (
    <div className="root">
      {(auth || guest) &&(
        <AppBar position="static">
          <Toolbar>
            <div className="nav-list title">
              <a className="space-between" href="/top">Top</a>
              <div className="dropdown">
                <button className="dropbtn">Content</button>
                <div className="dropdown-content">
                  <a href="/content" onClick={() => setLevel('N4')}>N4</a>
                  <a href="/content" onClick={() => setLevel('N5')}>N5</a>
                </div>
              </div>
              <a className="space-between" href="/comming-soon">Game</a>
              {guest &&
                <a className="space-between" href="/signup">Sign up</a>
              }
            </div>
            <div>
              {auth &&
                <>
                  <Button
                    className="righ-btn"
                    onClick={handleMenu}                 
                  >
                    {
                      loginUser && loginUser.user && loginUser.user.profile && loginUser.user.profile.url ?
                      <div className="profile-image">
                        <div
                          className="image"
                          style={{
                            backgroundImage: `url(${env.apiEndPoint + loginUser?.user?.profile?.url})`,
                          }}
                        ></div>
                      </div>
                      :
                      <AccountCircle />
                    }
                  </Button>
                  <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    open={open}
                    onClose={handleClose}
                  >
                    <MenuItem onClick={handleProfile}>Profile</MenuItem>
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                  </Menu>
                </>
              }
            </div>
          </Toolbar>
        </AppBar>
      )}
    </div >
  )
}