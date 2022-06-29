import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

export default function FileUpload({defaultValue}) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  

  useEffect(() => {
    const checkFileExtension = () => {
      const fileName = selectedImage.name;
      const substring =
        fileName.substring(fileName.lastIndexOf(".") + 1, fileName.length) ||
        fileName;
      console.log("substring", substring);
      if (substring !== "jpg" && substring !== "jpeg" && substring !== "png") {
        alert("Please upload a jpg, jpeg or png file");
        document.querySelector("#select-image").value = "";
        setImageUrl(null)
        return false;
      } else {
        setImageUrl(URL.createObjectURL(selectedImage));
        return true;
      }
    };

    if (selectedImage) {
      checkFileExtension();
     
    }
  }, [selectedImage]);

  return (
    <>
      <input
        accept='.png, .jpg, .jpeg'
        type='file'
        id='select-image'
        name='fileUpload'
        style={{ display: "none" }}
        onChange={(e) => setSelectedImage(e.target.files[0])}
      />
      <label htmlFor='select-image'>
        <Button
          variant='contained'
          color='secondary'
          component='span'
          sx={{ mt: "8px", mb: "4px", mr: "auto", ml: "auto" }}
        >
          Upload Image
        </Button>
      </label>
      {((imageUrl && selectedImage) || defaultValue) &&  (
        <Box mt={2} textAlign='center'>
          <div>Image Preview:</div>
          <img src={imageUrl || defaultValue} alt={selectedImage?.name} height='100px' />
        </Box>
      )}
    </>
  );
}
