import { useNavigate } from "react-router-dom";
import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";

export default function SignUp() {
  const navigate = useNavigate();
  async function handleSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const username = data.get("username");
    const email = data.get("email");
    const password = data.get("password");

    const response = await fetch(`${process.env.REACT_APP_API_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        email,
        password,
      }),
    });

    const res = await response.json();
    if (res.status === "User created successfully") {
      navigate("/signIn");
    } else {
      alert(res.message);
    }
  }

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
            <PersonAddIcon sx={{ height: 50, width: 50 }} />
          </Avatar>

          <Typography component='h1' variant='h5'>
            Create an Account
          </Typography>
          <Box component='form' onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  autoComplete='given-name'
                  name='username'
                  required
                  fullWidth
                  id='username'
                  label='Username'
                  autoFocus
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id='email'
                  label='Email Address'
                  name='email'
                  type='email'
                  autoComplete='email'
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name='password'
                  label='Password'
                  type='password'
                  id='password'
                  autoComplete='new-password'
                  inputProps={{ minLength: 8, pattern: "^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}"}}
                  helperText="Passwords must contain at least one number, one uppercase and lowercase letter, and be at least 8 characters long"
                />
              </Grid>
            </Grid>
            <Button
              className='signUpRedirectButton'
              type='submit'
              value='Create Account'
              fullWidth
              variant='contained'
              sx={{ mt: 3, mb: 2 }}
            >
              Create Account
            </Button>

            <p className='signInText'>Already have an account?</p>
            <Button
              className='signInRedirectButton'
              type='button'
              value='Sign In'
              fullWidth
              variant='contained'
              color='secondary'
              sx={{
                mt: 1,
                mb: 2,
              }}
              onClick={() => navigate("/signIn")}
            >
              Sign In
            </Button>
          </Box>
        </Box>
      </Container>
    </div>
  );
}
