import React, { useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Autocomplete from "@mui/material/Autocomplete";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Grid from "@mui/material/Grid";
import { GetAllSpecies } from "../controllers/getSpecies.controller";
import { createFilterOptions } from "@mui/material/Autocomplete";
import FileUpload from "../components/fileUpload.component";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { useMap, useMapEvents } from "react-leaflet/hooks";
import Typography from "@mui/material/Typography";
import { PostImage } from "../controllers/imagePosting.controller";
import { format } from 'date-fns'

const Report = () => {
  const navigate = useNavigate();
  const [allSpecies, setAllSpecies] = useState([]);
  const [value, setValue] = useState([]);
  const [visibilityValue, setVisibilityValue] = useState("everyone");
  const [freedomValue, setFreedomValue] = useState("wild");
  const [numberValue, setNumberValue] = useState("");
  const [open, setOpen] = useState(false);
  const [sightingDateTimeValue, setSightingDateTimeValue] = useState(format(new Date(), "yyyy-MM-dd'T'HH:mm"));
  const [descriptionValue, setDescriptionValue] = useState("");
  const [currentLocation, setCurrentLocation] = useState(null);
  const autocompleteLimit = 1000;
  const ukCentrePosition = [ 54.93335, -3.82309];

  const defaultFilterOptions = createFilterOptions();
  const filterOptions = (options, state) => {
    return defaultFilterOptions(options, state).slice(0, autocompleteLimit);
  };

  const UpdateView = ({ coords }) => {
    const map = useMap();
    map.setView([coords.lat, coords.lng], 15);
    return null;
  };

  const MoveMarker = () => {
    useMapEvents({
      click: (e) => {
        setCurrentLocation({
          lat: e.latlng.lat,
          lng: e.latlng.lng,
        });
      },
    });
    return null;
  };

  useEffect(() => {
    function success(position) {
      setCurrentLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    }

    function fail() {
      // Could not obtain location
      alert("Sorry, could not get your location, please allow access to your location, or move the marker to your location manually");
      setCurrentLocation({
        lat: ukCentrePosition[0],
        lng: ukCentrePosition[1],
      });
    }

    async function populateSpecies() {
      await GetAllSpecies().then((data) => {
        const result = data;

        if (result.length > 0) {
          setAllSpecies(result);
        } else {
          alert("No data returned");
        }
      });
    }
    const token = sessionStorage.getItem("token");
    if (token) {
      const user = jwt_decode(token);
      if (!user) {
        sessionStorage.removeItem("token");
        navigate("/signIn", );
      } else {
        if (navigator.geolocation) {
          // Call getCurrentPosition with success and failure callbacks
          navigator.geolocation.getCurrentPosition(success, fail);
        } else {
          alert("Sorry, your browser does not support geolocation services.");
        }
        populateSpecies();
      }
    } else {
      alert("No user details found, please log in or create an account");
      navigate("/signIn", );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function postSighting(event) {
    event.preventDefault();
    const files = document.querySelector("#select-image").files;
    let imageURL;
    if (files.length > 0) {
      const imageData = new FormData();
      imageData.append("file", document.querySelector("#select-image").files[0]);
      imageData.append("upload_preset", "c3b3kpju");
      imageURL = await await PostImage(imageData);
    }

    const formData = new FormData(event.target);
    const species = formData.get("species");
    const quantity = formData.get("quantity");
    const visibility = formData.get("visibility");
    const freedom = formData.get("freedom");
    const description = formData.get("description");
    const sightingDateTime = formData.get("sightingDateTime");
    const uploadedFile = imageURL?.secure_url;
    const latitude = currentLocation.lat;
    const longitude = currentLocation.lng;
    const req = await fetch(`${process.env.REACT_APP_API_URL}/sighting`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": sessionStorage.getItem("token"),
      },
      body: JSON.stringify({
        species,
        quantity,
        sightingType: "single",
        sightingDateTime: new Date(sightingDateTime),
        visibility,
        latitude,
        longitude,
        freedom,
        description,
        uploadedFile,
      }),
    });
    const data = await req.json();
    if (data.status === "ok") {
      alert("Sighting successfully posted");
      navigate("/dashboard");
    } else {
      alert(data.error);
    }
  }

  return (
    <div>
      <Box m={2}>
      <Typography
          component='h4'
          variant='h4'
          color='black'
          sx={{
            textAlign: "center",
			marginTop: "80px",
      marginBottom: "10px",
          }}
        >
          Report a Sighting
        </Typography>
      <MapContainer
        className='reportMap'
        center={ukCentrePosition}
        zoom={5}
        scrollWheelZoom={true}
        style={{ width: "100%" }}
      >
        {currentLocation && (
          <>
            <UpdateView coords={currentLocation} />
            <MoveMarker />
            <Marker
              eventHandlers={{
                dragend: (e) => {
                  setCurrentLocation({
                    lat: e.target._latlng.lat,
                    lng: e.target._latlng.lng,
                  });
                },
              }}
              position={currentLocation}
              draggable
            ></Marker>
          </>
        )}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />
      </MapContainer>
      <Box
        component='form'
        onSubmit={postSighting}
        sx={{ mt: 1, width: "100%", maxWidth: "400px", mr: "auto", ml: "auto", mb: "80px" }}
      >
        <Autocomplete
          sx={{ mt: "8px", mb: "4px" }}
          disablePortal
          id='species'
          label='species'
          name='species'
          isOptionEqualToValue={(option, value) => option.id === value.id}
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
          filterOptions={filterOptions}
          getOptionLabel={(option) => option.species || ""}
          options={allSpecies}
          open={open}
          onInputChange={(_, value) => {
            if (value.length === 0) {
              if (open) setOpen(false);
            } else {
              if (!open) setOpen(true);
            }
          }}
          onClose={() => setOpen(false)}
          renderOption={(props, option) => {
            return (
              <div key={option._id}>
                <Box {...props} sx={{display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start !important"}}>
                  <Typography sx={{textTransform: "capitalize"}} variant="h6">{option.species}</Typography>
                  <Typography sx={{fontStyle: "italic"}} variant="h7">{option.latinname}</Typography>
                </Box>
              </div>
            );
          }}
          renderInput={(params) => <TextField {...params} required label='Species' name='species' />}
        />

        <TextField
          margin='dense'
          fullWidth
          required
          name='quantity'
          value={numberValue}
          min={1}
          max={500}
          size='small'
          type='number'
          onChange={(e) => setNumberValue(e.target.value === "" ? "" : Number(e.target.value))}
          label='Estimated number spotted'
          inputProps={{
            min: 1,
            max: 500,
          }}
        />
        <TextField
          InputLabelProps={{ shrink: true }}
          label='Time and date of sighting'
          margin='dense'
          fullWidth
          required
          name='sightingDateTime'
          type='datetime-local'
          value={sightingDateTimeValue}
          inputProps={{
            min: "2022-01-01T00:00",
            max: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
          }}
          onChange={(e) => setSightingDateTimeValue(e.target.value)}
        />
        <TextField
          InputLabelProps={{ shrink: true }}
          margin='dense'
          fullWidth
          id='description'
          label='Description'
          name='description'
          multiline
          value={descriptionValue}
          rows={4}
          onChange={(e) => setDescriptionValue(e.target.value)}
          inputProps={{
            maxLength: 150,
          }}
        />

        <FileUpload />

        <Grid>
          <Grid item xs={6}>
            <FormControl margin='dense'>
              <FormLabel id='demo-controlled-radio-buttons-group'>Wild or Captive?</FormLabel>
              <RadioGroup
                aria-labelledby='demo-controlled-radio-buttons-group'
                value={freedomValue}
                onChange={(e) => setFreedomValue(e.target.value)}
                required
                id='freedom'
                label='freedom'
                type='freedom'
                name='freedom'
              >
                <FormControlLabel value='wild' control={<Radio />} label='Wild' labelPlacement='end' />
                <FormControlLabel value='captive' control={<Radio />} label='Captive' labelPlacement='end' />
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl margin='dense'>
              <FormLabel id='demo-controlled-radio-buttons-group'>Who can see this report?</FormLabel>
              <RadioGroup
                aria-labelledby='demo-controlled-radio-buttons-group'
                value={visibilityValue}
                onChange={(e) => setVisibilityValue(e.target.value)}
                required
                id='visibility'
                label='visibility'
                type='visibility'
                name='visibility'
              >
                <FormControlLabel value='everyone' control={<Radio />} label='Everyone' labelPlacement='end' />
                <FormControlLabel value='only me' control={<Radio />} label='Only Me' labelPlacement='end' />
              </RadioGroup>
            </FormControl>
          </Grid>
        </Grid>
        <Button
          className='submitSightingButton'
          type='submit'
          value='Submit Sighting'
          fullWidth
          variant='contained'
          sx={{ mt: 3, mb: 2 }}
        >
          Submit Sighting
        </Button>
      </Box>
      </Box>
    </div>
  );
};
export default Report;
