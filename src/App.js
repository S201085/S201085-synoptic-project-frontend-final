import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import SignIn from "./pages/signIn";
import SignUp from "./pages/signUp";
import Dashboard from "./pages/dashboard";
import Sightings from "./pages/sightings";
import Report from "./pages/report";
import EditReport from "./pages/editReport";
import SimpleBottomNavigation from "./components/bottomNavigation.component";
import { ThemeProvider } from "@mui/material/styles";
import Box from "@mui/material/Box";
import ButtonAppBar from "./components/responsiveAppBar.component";
import createTheme from "./styles/theme";
import "./App.css";

const App = () => {
  return (
    <ThemeProvider theme={createTheme}>
    {/* Remove below basename prop for dev */}
      <BrowserRouter basename="/WildlifeMapper">
        <ButtonAppBar />
        <Box style={{ marginTop: 70 }}>
          <Routes>
            <Route path='/' exact element={<Home />} />
            <Route path='/signIn' exact element={<SignIn />} />
            <Route path='/signUp' exact element={<SignUp />} />
            <Route path='/dashboard' exact element={<Dashboard />} />
            <Route path='/sightings' exact element={<Sightings />} />
            <Route path='/report' exact element={<Report />} />
            <Route path='/editReport' exact element={<EditReport />} />
          </Routes>
        </Box>
        {/* <Toolbar/> */}
        <SimpleBottomNavigation />
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
