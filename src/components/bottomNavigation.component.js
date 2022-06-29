import { useEffect, useState } from "react";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import HomeIcon from "@mui/icons-material/Home";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ExploreIcon from "@mui/icons-material/Explore";
import SearchIcon from "@mui/icons-material/Search";
// import RouteIcon from '@mui/icons-material/Route';
import { useNavigate, useLocation } from "react-router-dom";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";

export default function SimpleBottomNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const [value, setValue] = useState(location.pathname);

  useEffect(() => {
    setValue(location.pathname);
  }, [location.pathname]);

  return (
    <Container>
      <Paper sx={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 1000 }} elevation={5}>
        <BottomNavigation
          showLabels
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
            navigate(newValue);
          }}
        >
          <BottomNavigationAction value='/' label='Home' icon={<HomeIcon />} />
          <BottomNavigationAction value='/sightings' label='Sightings' icon={<SearchIcon />} />
          <BottomNavigationAction value='/report' label='Submit' icon={<ExploreIcon />} />
          <BottomNavigationAction value='/dashboard' label='Dashboard' icon={<DashboardIcon />} />
          {/* <BottomNavigationAction
              value="/surveys"
              label="Surveys"
              icon={<RouteIcon />}
            /> */}
        </BottomNavigation>
      </Paper>
    </Container>
  );
}
