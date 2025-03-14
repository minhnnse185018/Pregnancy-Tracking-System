const [previewImage, setPreviewImage] = useState(null);
const [img, setImg] = useState(null); // ✅ Ensure state exists

const handleUploadFile = (e) => {
  const file = e.target.files[0];

  if (file) {
    const fileType = file.type;
    const validTypes = ["image/jpeg", "image/jpg", "image/png"];

    if (validTypes.includes(fileType)) {
      setPreviewImage(URL.createObjectURL(file));
      setImg(file);
    } else {
      alert("Invalid file type! Please upload a JPG or PNG image.");
      e.target.value = ""; // Reset input field
    }
  } else {
    setPreviewImage(null);
  }

  console.log(file);
};
