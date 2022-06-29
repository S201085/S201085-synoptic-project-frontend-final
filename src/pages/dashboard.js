import React, { useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { GetUserSightings } from "../controllers/getSightings.controller";
import SightingCard from "../components/dashboardSightingCard.component";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import HistoryIcon from "@mui/icons-material/History";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import TimelineIcon from "@mui/icons-material/Timeline";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
const Dashboard = () => {
  const navigate = useNavigate();
  const [sighting, setSighting] = useState("");
  const [userSightings, setUserSightings] = useState([]);
  const [frequentSighting, setFrequentSighting] = useState(null);
  const [matches, setMatches] = useState(window.matchMedia("(min-width: 768px)").matches);
  useEffect(() => {
    window.matchMedia("(min-width: 768px)").addEventListener("change", (e) => setMatches(e.matches));
  }, []);

  async function populateUserSightings() {
    GetUserSightings().then((data) => {
      const result = data;

      if (result.length > 0) {
        setSighting(result[0].species);
        setUserSightings(result);
      } else {
        setUserSightings(result);
      }
    });
  }

  function highest(array) {
    if (array.length === 0) return null;
    var modeMap = {};
    var maxEl = array[0],
      maxCount = 1;
    for (var i = 0; i < array.length; i++) {
      var el = array[i].species;
      if (modeMap[el] == null) modeMap[el] = 1;
      else modeMap[el]++;
      if (modeMap[el] > maxCount) {
        maxEl = el;
        maxCount = modeMap[el];
      }
    }
    if (maxCount === 1) return { species: maxEl[0], maxCount };
    return { species: maxEl, maxCount };
  }
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      const user = jwt_decode(token);
      if (!user) {
        sessionStorage.removeItem("token");
        navigate("/login");
      } else {
        populateUserSightings();
      }
    } else {
      alert("No user details found, please log in or create an account");
      navigate("/signIn");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const frequentSighting = highest(userSightings);
    setFrequentSighting(frequentSighting);
  }, [userSightings]);

  return (
    <div>
      <Box
        sx={{
          flexGrow: 1,
          mt: 10,
          padding: "10px",
          borderRadius: "5px",
          maxWidth: "800px",
          display: "flex",
          ml: "auto",
          mr: "auto",
        }}
      >
        <Paper
          elevation={5}
          sx={{
            backgroundColor: "primary.main",
            color: "primary.contrastText",
            padding: "10px 0px",
            borderRadius: "5px",
            width: "100%",
          }}
        >
          {matches ? (
            <Grid container columns={12} spacing={0} sx={{ height: "60px", textAlign: "center", width: "100%" }}>
              <Grid
                item
                xs={4}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <HistoryIcon />
                <b style={{ textTransform: "capitalize" }}>{sighting || "No sightings found"}</b>
                Last Sighting
              </Grid>

              <Divider
                variant='middle'
                orientation='vertical'
                flexItem
                style={{ marginRight: "-1px", backgroundColor: "white" }}
              />

              {frequentSighting ? (
                <Grid
                  item
                  xs={4}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <WhatshotIcon />
                  <b style={{ textTransform: "capitalize" }}>{frequentSighting.species}</b>
                  <span>
                    {frequentSighting.maxCount > 1 ? (
                      <span>
                        <b>{frequentSighting.maxCount}</b> Sightings
                      </span>
                    ) : (
                      <span>No most frequent sighting</span>
                    )}
                  </span>
                </Grid>
              ) : (
                <Grid
                  item
                  xs={4}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <WhatshotIcon />
                  No most frequent sighting
                </Grid>
              )}

              <Divider
                variant='middle'
                orientation='vertical'
                flexItem
                style={{ marginRight: "-1px", backgroundColor: "white" }}
              />

              <Grid
                item
                xs={4}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TimelineIcon />
                <b style={{ textTransform: "capitalize" }}>{userSightings.length}</b> Total Sightings
              </Grid>
            </Grid>
          ) : (
            <Grid container columns={12} spacing={0} sx={{ height: "60px", textAlign: "center", width: "100%" }}>
              <Grid
                item
                xs={4}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: "0.8rem",
                }}
              >
                <HistoryIcon />
                <b style={{ textTransform: "capitalize" }}>{sighting || "No sightings found"}</b>
                Last Sighting
              </Grid>

              <Divider
                variant='middle'
                orientation='vertical'
                flexItem
                style={{ marginRight: "-1px", backgroundColor: "white" }}
              />

              {frequentSighting ? (
                <Grid
                  item
                  xs={4}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: "0.8rem",
                  }}
                >
                  <WhatshotIcon />
                  <b style={{ textTransform: "capitalize" }}>{frequentSighting.species}</b>
                  <span>
                    {frequentSighting.maxCount > 1 ? (
                      <span>
                        <b>{frequentSighting.maxCount}</b> Sightings
                      </span>
                    ) : (
                      <span>No most frequent sighting</span>
                    )}
                  </span>
                </Grid>
              ) : (
                <Grid
                  item
                  xs={4}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: "0.8rem",
                  }}
                >
                  <WhatshotIcon />
                  No most frequent sighting
                </Grid>
              )}

              <Divider
                variant='middle'
                orientation='vertical'
                flexItem
                style={{ marginRight: "-1px", backgroundColor: "white" }}
              />

              <Grid
                item
                xs={4}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: "0.8rem",
                }}
              >
                <TimelineIcon />
                <b style={{ textTransform: "capitalize" }}>{userSightings.length}</b> Total Sightings
              </Grid>
            </Grid>
          )}
        </Paper>
      </Box>
      <Box
        component='div'
        sx={{
          width: "100%",
          maxWidth: "800px",
          height: "100%",
          display: "flex",
          ml: "auto",
          mr: "auto",
          overflow: "auto",
          mb: "80px",
          flexDirection: "column",
        }}
      >
        <Typography
          component='h5'
          variant='h5'
          color='primary'
          sx={{
            textAlign: "center",
            marginTop: "10px",
          }}
        >
          My Reports
        </Typography>
        {userSightings.map((row) => <SightingCard key={row._id} data={row} update={populateUserSightings} />) ||
          "No user sightings"}
        {userSightings.length === 0 && (
          <Card
            className='sighting-card'
            key={"no sightings"}
            sx={{ display: "flex", mb: 2, mr: 1, ml: 1, mt: 2, border: "1px #cccccc solid" }}
            elevation={5}
          >
            <CardContent sx={{width: "100%", padding: "16px !important"}}>
              <Typography variant='h5' color='black' sx={{ textAlign: "center" }}>
                You haven't reported any sightings yet 
              </Typography>
            </CardContent>
          </Card>
        )}
      </Box>
    </div>
  );
};

export default Dashboard;
