import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import ArrowBack from "@mui/icons-material/ArrowBack";
import Logo from "../images/LogoWhite.png";
import { useNavigate, useLocation } from "react-router-dom";

export default function ButtonAppBar() {
  const token = sessionStorage.getItem("token");
  const navigate = useNavigate();
  const location = useLocation();

  async function logOut() {
    sessionStorage.removeItem("token");
    navigate("/", );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position='fixed'>
        <Toolbar>
          <Box sx={{ width: 50, maxWidth: 50, minWidth: 50, mr: "30px" }}>
            {location.pathname !== "/" && location.pathname !== "/signIn" && (
              <IconButton size='large' edge='start' color='inherit' aria-label='back' onClick={() => navigate(-1)}>
                <ArrowBack />
              </IconButton>
            )}
            {location.pathname === "/signIn" && (
              <IconButton size='large' edge='start' color='inherit' aria-label='back' onClick={() => navigate("/")}>
                <ArrowBack />
              </IconButton>
            )}
          </Box>
          <Box
            component='div'
            sx={{
              width: "100%",
              height: "100%",
              display: "flex",
            }}
          >
            <Box
              component='img'
              sx={{
                paddingRight: "-10px",
                minHeight: "70px",
                minWidth: "60px",
                maxHeight: "60px",
                maxWidth: "60px",
                marginLeft: "auto",
                marginRight: "auto",
              }}
              alt='Widlife Mapper Logo'
              src={Logo}
              className='appBarLogo'
            />
          </Box>
          <Box sx={{ width: 86, maxWidth: 86, minWidth: 86}}>
            {location.pathname !== "/signIn" && token && (
              <Button sx={{float: "right"}} variant='contained' id='logoutBtn' color='white' onClick={logOut}>
                LogOut
              </Button>
            )}
            {location.pathname !== "/signIn" && location.pathname !== "/signUp" && !token && (
              <Button sx={{float: "right"}} variant='contained' id='loginButton' color='white' onClick={() => navigate("/signIn")}>
                Login
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
