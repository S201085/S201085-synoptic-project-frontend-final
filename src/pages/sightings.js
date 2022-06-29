import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Popup, Marker } from "react-leaflet";
import { useMap } from "react-leaflet/hooks";
import { useNavigate } from "react-router-dom";
import { GetUserSightings , GetAllPublicSightings } from "../controllers/getSightings.controller";
import jwt_decode from 'jwt-decode'
import * as L from "leaflet";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Autocomplete from "@mui/material/Autocomplete";
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import iconUrl from "../images/MarkerPrimary.png";
import { GetAllSpecies } from "../controllers/getSpecies.controller";
import { createFilterOptions } from "@mui/material/Autocomplete";
import Typography from "@mui/material/Typography";

const icon = L.icon({
  iconUrl: iconUrl,
  iconSize: [30, 30],
  iconAnchor: [15, 15],
  popupAnchor: [0, -10],
});

const UpdateView = ({ coords }) => {
  const map = useMap();
  map.setView([coords.lat, coords.lng], 5);
  return null;
};

const Sightings = () => {
  const navigate = useNavigate();
  const ukCentrePosition = [54.93335, -3.82309];
  const [currentLocation, setCurrentLocation] = useState(null);
  const [allSightings, setAllSightings] = useState([]);
  const [userSightings, setUserSightings] = useState([]);
  const [sightingsChoice, setSightingsChoice] = useState('allSightings');
  const [allSpecies, setAllSpecies] = useState([]);
  const [value, setValue] = useState(null);
  const [open, setOpen] = useState(false);
  const autocompleteLimit = 1000;

  const defaultFilterOptions = createFilterOptions();
  const filterOptions = (options, state) => {
    return defaultFilterOptions(options, state).slice(0, autocompleteLimit);
  };

  const handleSightingsChoiceChange = (event, newChoice) => {
    if (newChoice !== null) {
    setSightingsChoice(newChoice);
    }
  };

  useEffect(() => {
    const token = sessionStorage.getItem('token')
    if (token) {
        const user = jwt_decode(token)
        if (!user) {
            sessionStorage.removeItem('token')

            navigate("/signIn", );
        } else {
          if (navigator.geolocation) {
            // Call getCurrentPosition with success and failure callbacks
            navigator.geolocation.getCurrentPosition(success, fail);
          } else {
            alert("Sorry, your browser does not support geolocation services.");
          }
            populateUserSightings();
            populateAllSightings();
            populateSpecies();
        }
    }
    else {
        alert('No user details found, please log in or create an account')
        navigate("/signIn", );
        
    }

    function success(position) {
      setCurrentLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    }

    function fail() {
      // Could not obtain location
      alert("Sorry, could not get your location, please allow access to your location in order to more easily see sightings around you.");
    }
    async function populateSpecies() {
      await GetAllSpecies().then((data) => {
        const result = data;

        if (result.length > 0) {
          setAllSpecies(result);
        } else {
        }
      });
    }


   

    async function populateUserSightings() {
		GetUserSightings().then((data) => {
		const result = data
		if (result.length > 0) {
      setUserSightings(result)
		} else {
		}
	})}

  async function populateAllSightings() {
		GetAllPublicSightings().then((data) => {
		const result = data
		if (result.length > 0) {
      setAllSightings(result)
		} else {
		}
	})}

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  

  return (
    <div style={{position: "relative", height: "100%", width: "100%"}} className="sightingsMap">
      <ToggleButtonGroup
      color="primary"
      value={sightingsChoice}
      exclusive
      onChange={handleSightingsChoiceChange}
      sx={{width: '100%'}}
    >
      <ToggleButton value={'allSightings'}  sx={{width: '50%'}}>All Sightings</ToggleButton>
      <ToggleButton value={'userSightings'}  sx={{width: '50%'}}>My Sightings</ToggleButton>
      
    </ToggleButtonGroup>
    <Autocomplete
          sx={{position: "absolute", top: "58px", left: "10px", width: "calc(100% - 20px)", zIndex: "500", backgroundColor: "white"}}
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
          renderInput={(params) => <TextField {...params} placeholder='Filter by species' name='species' />}
        />
    <MapContainer center={ukCentrePosition} zoom={5} scrollWheelZoom={true}>
      {currentLocation && (
        <>
          <UpdateView coords={currentLocation} />
          <Marker position={currentLocation}>
            <Popup>Your Location</Popup>
          </Marker>
        </>
      )}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {sightingsChoice === 'allSightings' & value === null &&
      allSightings.map((sighting) => (
        <Marker key={sighting._id} position={[sighting.latitude, sighting.longitude]} icon={icon}>
          <Popup position={[sighting.latitude, sighting.longitude]}>
            <div>
              <h2 style={{textTransform: 'capitalize' }}>{"Species: " + sighting.species}</h2>
              <p>{"Reported by " + sighting.username}</p>
              <p>
                {"Seen at " +
                
                  new Date(sighting.sightingDateTime)
                    .toLocaleString("en-GB", {
                      hour12: false,
                      year: "numeric",
                      month: "numeric",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                    .replace(",", "")}
              </p>
            </div>
          </Popup>
        </Marker>
      ))}

      {sightingsChoice === 'userSightings' & value === null &&
        userSightings.map((sighting) => (
          <Marker key={sighting._id} position={[sighting.latitude, sighting.longitude]} icon={icon}>
            <Popup position={[sighting.latitude, sighting.longitude]}>
              <div>
                <h2 style={{textTransform: 'capitalize' }}>{"Species: " + sighting.species}</h2>
                <p>{"Reported by " + sighting.username}</p>
                <p>
                  {"Seen at " +
                  
                    new Date(sighting.sightingDateTime)
                      .toLocaleString("en-GB", {
                        hour12: false,
                        year: "numeric",
                        month: "numeric",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                      .replace(",", "")}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}

        {value !== null & sightingsChoice === 'allSightings' &&
         allSightings.filter((sighting) => sighting.species === value.species).map((sighting) => (
          <Marker key={sighting._id} position={[sighting.latitude, sighting.longitude]} icon={icon}>
            <Popup position={[sighting.latitude, sighting.longitude]}>
              <div>
                <h2 style={{textTransform: 'capitalize' }}>{"Species: " + sighting.species}</h2>
                <p>{"Reported by " + sighting.username}</p>
                <p>
                  {"Seen at " +
                  
                    new Date(sighting.sightingDateTime)
                      .toLocaleString("en-GB", {
                        hour12: false,
                        year: "numeric",
                        month: "numeric",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                      .replace(",", "")}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}            
    {value !== null & sightingsChoice === 'userSightings' &&
         userSightings.filter((sighting) => sighting.species === value.species).map((sighting) => (
          <Marker key={sighting._id} position={[sighting.latitude, sighting.longitude]} icon={icon}>
            <Popup position={[sighting.latitude, sighting.longitude]}>
              <div>
                <h2 style={{textTransform: 'capitalize' }}>{"Species: " + sighting.species}</h2>
                <p>{"Reported by " + sighting.username}</p>
                <p>
                  {"Seen at " +
                  
                    new Date(sighting.sightingDateTime)
                      .toLocaleString("en-GB", {
                        hour12: false,
                        year: "numeric",
                        month: "numeric",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                      .replace(",", "")}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}            
    </MapContainer>
    </div>
  );
};

export default Sightings;
