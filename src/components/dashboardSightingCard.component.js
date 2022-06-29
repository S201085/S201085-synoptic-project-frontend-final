import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import * as L from "leaflet";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import sightingIcon from "../images/MarkerPrimary.png";
import { useState, useEffect } from "react";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { DeleteSightingById } from "../controllers/getSightings.controller";


const icon = L.icon({
  iconUrl: sightingIcon,
  iconSize: [30, 30],
  iconAnchor: [20, 20],
});
function secondsToDhms(seconds) {
  seconds = Number(seconds);
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const dDisplay = d > 0 ? d + (d === 1 ? " day, " : " days, ") : "";
  const hDisplay = h > 0 ? h + (h === 1 ? " hour, " : " hours, ") : "";
  const mDisplay = m > 0 ? m + (m === 1 ? " minute " : " minutes ") : "";
  if(d + h + m === 0) {  
    return " just now";
  }
  return dDisplay + hDisplay + mDisplay + "ago";
}

export default function SightingCard({ data, update }) {

  const navigate = useNavigate();
  const [matches, setMatches] = useState(window.matchMedia("(min-width: 768px)").matches);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleEdit = () => {
    navigate("/editReport", {
      state: {
        sighting: data._id,
      },
    });
  };
  const handleDelete = (props) => {
    DeleteSightingById(data._id).then((data) => {
      if (data.success === true) {
        alert("Sighting deleted");
        update();
        // window.location.reload(false);
      } else {
        alert("Failed to delete sighting");
      }
    });
  };
  useEffect(() => {
    window.matchMedia("(min-width: 768px)").addEventListener("change", (e) => setMatches(e.matches));
  }, []);

  return (
    <Card
      className='sighting-card'
      key={data._id}
      sx={{ display: "flex", mb: 2, mr: 1, ml: 1, mt: 1, border: "1px #cccccc solid" }}
      elevation={5}
    >
      {matches && (
        <MapContainer
          className='sighting-card-map'
          center={[data.latitude, data.longitude]}
          zoom={13}
          zoomControl={false}
          doubleClickZoom={false}
          closePopupOnClick={false}
          dragging={false}
          zoomDelta={false}
          touchZoom={false}
          scrollWheelZoom={false}
          style={{ minWidth: "20%", width: "20%", height: "auto", display: "flex", margin: "5px", borderRadius: "5px" }}
        >
          <TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />
          <Marker key={data._id} position={[data.latitude, data.longitude]} icon={icon} />
        </MapContainer>
      )}

      {data.image !== undefined ? (
        <>
          {matches ? (
            <>
              <Box sx={{ width: "40%", display: "flex", flexDirection: "column" }}>
                <CardContent sx={{ flex: "1 0 auto", padding: "10px !important" }}>
                  <Typography component='div' color='primary' variant='h5' sx={{ textTransform: "capitalize" }}>
                    {data.species}
                  </Typography>
                  <Typography sx={{ fontSize: "10pt" }}>Individuals: {data.quantity}</Typography>
                  <Typography sx={{ fontSize: "10pt", wordWrap: "break-word", wordBreak: "break-all" }}>
                    {data.description ? "Description: " + data.description : "No description available"}
                  </Typography>
                  <Typography color='primary' sx={{ fontSize: "10pt" }}>
                    Seen{" "}
                    {" " + secondsToDhms(Math.abs((new Date().getTime() - new Date(data.sightingDateTime)) / 1000))}
                  </Typography>
                </CardContent>
              </Box>
              <Box sx={{ width: "40%", display: "flex", flexDirection: "column" }}>
                <CardContent
                  sx={{
                    flex: "1 0 auto",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                   <a href={data.image}>
                    <img
                      src={data.image}
                      alt={'Image of ' + data.species}
                      style={{ width: "100%", height: "100px", objectFit: "cover", borderRadius: "5px" }}
                    />
                    </a>
                  </Box>
                </CardContent>
              </Box>
            </>
          ) : (
            <>
              <Box sx={{ width: "60%", display: "flex", flexDirection: "column" }}>
                <CardContent sx={{ flex: "1 0 auto", padding: "10px !important" }}>
                  <Typography component='div' color='primary' variant='h5' sx={{ textTransform: "capitalize" }}>
                    {data.species}
                  </Typography>
                  <Typography sx={{ fontSize: "10pt" }}>Individuals: {data.quantity}</Typography>
                  <Typography sx={{ fontSize: "10pt", wordWrap: "break-word", wordBreak: "break-all" }}>
                    {data.description ? "Description: " + data.description : "No description available"}
                  </Typography>
                  <Typography color='primary' sx={{ fontSize: "10pt" }}>
                    Seen{" "}
                    {" " + secondsToDhms(Math.abs((new Date().getTime() - new Date(data.sightingDateTime)) / 1000))}
                  </Typography>
                </CardContent>
              </Box>
              <Box sx={{ width: "40%", display: "flex", flexDirection: "column" }}>
                <CardContent
                  sx={{
                    flex: "1 0 auto",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Box mt={2}>
                  <a href={data.image}>
                    <img
                      src={data.image}
                      alt={'Image of ' + data.species}
                      style={{ width: "100%", height: "100px", objectFit: "cover", borderRadius: "5px" }}
                    />
                    </a>
                  </Box>
                </CardContent>
              </Box>
            </>
          )}
        </>
      ) : (
        <>
          {matches === false ? (
            <Box sx={{ width: "100%", display: "flex", flexDirection: "column" }}>
              <CardContent sx={{ flex: "1 0 auto", padding: "10px !important" }}>
                <Typography component='div' color='primary' variant='h5' sx={{ textTransform: "capitalize" }}>
                  {data.species}
                </Typography>
                <Typography sx={{ fontSize: "10pt" }}>Individuals: {data.quantity}</Typography>
                <Typography sx={{ fontSize: "10pt", wordWrap: "break-word", wordBreak: "break-all" }}>
                  {data.description ? "Description: " + data.description : "No description available"}
                </Typography>
                <Typography color='primary' sx={{ fontSize: "10pt" }}>
                  Seen {" " + secondsToDhms(Math.abs((new Date().getTime() - new Date(data.sightingDateTime)) / 1000))}
                </Typography>
              </CardContent>
            </Box>
          ) : (
            <Box sx={{ width: "80%", display: "flex", flexDirection: "column" }}>
              <CardContent sx={{ flex: "1 0 auto", padding: "10px !important" }}>
                <Typography component='div' color='primary' variant='h5' sx={{ textTransform: "capitalize" }}>
                  {data.species}
                </Typography>
                <Typography sx={{ fontSize: "10pt" }}>Individuals: {data.quantity}</Typography>
                <Typography sx={{ fontSize: "10pt", wordWrap: "break-word", wordBreak: "break-all" }}>
                  {data.description ? "Description: " + data.description : "No description available"}
                </Typography>
                <Typography color='primary' sx={{ fontSize: "10pt" }}>
                  Seen {" " + secondsToDhms(Math.abs((new Date().getTime() - new Date(data.sightingDateTime)) / 1000))}
                </Typography>
              </CardContent>
            </Box>
          )}
        </>
      )}

      <IconButton
        aria-label='more'
        id='long-button'
        aria-controls={open ? "long-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup='true'
        onClick={handleClick}
        sx={{ height: "40px" }}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id='edit/deleteMenu'
        MenuListProps={{
          "aria-labelledby": "demo-customized-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem onClick={(e) => handleEdit()} disableRipple>
          <EditIcon sx={{ color: "#555555", mr: "5px" }} />
          <span style={{ color: "#555555" }}>Edit</span>
        </MenuItem>

        <MenuItem onClick={(e) => handleDelete()} disableRipple>
          <DeleteIcon sx={{ color: "#555555", mr: "5px" }} />
          <span style={{ color: "#555555" }}>Delete</span>
        </MenuItem>
      </Menu>
    </Card>
  );
}
