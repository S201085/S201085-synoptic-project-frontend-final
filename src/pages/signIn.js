import { useNavigate } from "react-router-dom";
import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
// import FormControlLabel from "@mui/material/FormControlLabel";
// import Checkbox from "@mui/material/Checkbox";
// import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import PersonIcon from "@mui/icons-material/Person";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useEffect } from "react";

export default function SignIn() {
  const navigate = useNavigate();
  async function handleSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get("email");
    const password = data.get("password");
    const response = await fetch(`${process.env.REACT_APP_API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const res = await response.json();
    if (res.user) {
      sessionStorage.setItem("token", res.user);
      navigate("/sightings");
    } else {
      alert(res.message);
    }
  }

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      alert("You are already logged in");
      navigate("/sightings");
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ display: "flex", alignItems: "center", height: "calc(100vh - 152px)" }}>
      <Container component='main' maxWidth='xs'>
        <CssBaseline />
        <Box
          sx={{
            marginTop: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Avatar sx={{ m: 1, height: 70, width: 70 }}>
            <PersonIcon sx={{ height: 50, width: 50 }} />
          </Avatar>
          <Typography component='h1' variant='h5'>
            Sign in
          </Typography>
          <Box component='form' onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin='normal'
              fullWidth
              id='email'
              label='Email Address'
              type='email'
              name='email'
              required
              autoComplete='email'
              autoFocus
            />
            <TextField
              margin='normal'
              fullWidth
              name='password'
              label='Password'
              type='password'
              id='password'
              required
              autoComplete='current-password'
              inputProps={{ minLength: 8}}
              helperText="Passwords contain at least one number, one uppercase and lowercase letter, and be at least 8 characters long"
            />
            <Button
              className='signInButton'
              type='submit'
              value='Sign In'
              fullWidth
              variant='contained'
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>

            <p className='createAccountText'>Don't have an account?</p>
            <Button
              className='createAccountRedirectButton'
              type='button'
              value='Sign Up'
              fullWidth
              variant='contained'
              color='secondary'
              sx={{ mt: 1, mb: 2 }}
              onClick={() => navigate("/signUp")}
            >
              Create an Account
            </Button>
          </Box>
        </Box>
      </Container>
    </div>
  );
}
