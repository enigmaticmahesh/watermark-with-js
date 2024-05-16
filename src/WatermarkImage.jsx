import { useRef, useState } from 'react';

const ALLOWED_FILE_TYPES = ['image/png', 'image/jpeg'];

const WatermarkImage = () => {
  const inputFileRef = useRef();
  const userImgRef = useRef();
  const [file, setFile] = useState(null);
  const [watermarkedFile, setWatermarkedFile] = useState(null);

  const watermarkImageWithText = (imgElement, watermarkText) => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const imageWidth = imgElement.width;
    const imageHeight = imgElement.height;
    canvas.width = imageWidth;
    canvas.height = imageHeight;

    context.drawImage(imgElement, 0, 0, imageWidth, imageHeight);

    context.fillStyle = 'blue';
    context.textBaseline = 'middle';
    context.font = 'bold 25px serif';
    context.fillText(watermarkText, imageWidth - 100, imageHeight - 20);

    setWatermarkedFile(canvas.toDataURL());
  };

  const readUserFile = (userFile) => {
    const reader = new FileReader();
    reader.onload = () => {
      setFile(reader.result);
      setTimeout(() => {
        watermarkImageWithText(userImgRef.current, 'Toggle 3D');
      }, 1000);
    };
    reader.readAsDataURL(userFile);
  };

  const selectImage = () => {
    inputFileRef.current.click();
  };

  const handleImage = (e) => {
    const userFile = e.target.files[0];
    // console.log({ userFile });
    if (!userFile) {
      setFile(null);
      return;
    }
    if (!ALLOWED_FILE_TYPES.includes(userFile.type)) {
      setFile(null);
      return;
    }
    readUserFile(userFile);
  };

  const userImage = file && <img src={file} alt="User_Img" />;
  const watermarkedImage = watermarkedFile && (
    <img src={watermarkedFile} alt="Watermarked_User_Img" />
  );

  return (
    <div>
      <input
        ref={inputFileRef}
        type="file"
        name="image"
        style={{ display: 'none' }}
        onChange={handleImage}
        accept=".jpg,.png,.jpeg"
      />
      <img
        style={{ display: 'none' }}
        ref={userImgRef}
        src={file}
        alt="User_Img_alt"
      />
      <button onClick={selectImage}>Select Image</button>
      <h5>User Image</h5>
      {userImage}
      <h5>Watermarked Image</h5>
      {watermarkedImage}
    </div>
  );
};

export default WatermarkImage;
