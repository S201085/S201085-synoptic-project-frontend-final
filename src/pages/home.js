import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { GetNumberOfPublicSightings } from "../controllers/getSightings.controller";
import SightingCard from "../components/sightingCard.component";

function App() {
  const [allSightings, setAllSightings] = useState([]);

  async function populateAllSightings() {
    GetNumberOfPublicSightings().then((data) => {
      const result = data;
      if (result.length > 0) {
        setAllSightings(result);
      } else {
        alert("Couldn't fetch latest sightings");
      }
    });
  }

  useEffect(() => {
    populateAllSightings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <Typography
        component='h3'
        variant='h3'
        sx={{
          textAlign: "center",
          mt: "80px",
        }}
      >
        Welcome to Wildlife Mapper
      </Typography>
      <Typography
        component='h6'
        variant='h6'
        gutterBottom
        sx={{
          fontWeight: "500",
          fontSize: "0.875rem",
          textAlign: "center",
        }}
      >
        A Wildlife Sighting App by Jordan Shaddick
      </Typography>
    
      <Typography
        component='h6'
        variant='h6'
        color='primary'
        sx={{
          textAlign: "center",
          marginTop: "20px",
        }}
      >
        Most Recent Reports
      </Typography>
      <Box
        component='div'
        sx={{
          width: "90%",
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
        {allSightings.map((row) => (
          <SightingCard key={row._id} data={row} />
        ))}
      </Box>
    </div>
  );
}

export default App;
