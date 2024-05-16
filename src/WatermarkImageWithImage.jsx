import { useEffect, useRef, useState } from 'react';
import dracula from './assets/badam-pak-2.jpg';

const ALLOWED_FILE_TYPES = ['image/png', 'image/jpeg'];

const watermarkImageWithImage = async (dataUrl) => {
  const imgElement = document.createElement('img');
  imgElement.src = dataUrl;
  const imageWidth = imgElement.width;
  const imageHeight = imgElement.height;
  const canvas = document.createElement('canvas');
  // const canvas = new OffscreenCanvas(imageWidth, imageHeight);
  const context = canvas.getContext('2d');
  canvas.width = imageWidth;
  canvas.height = imageHeight;

  context.drawImage(imgElement, 0, 0, imageWidth, imageHeight);

  // console.log(dracula);
  const res = await fetch(dracula);
  // console.log({ res });
  const blob = await res.blob();
  // console.log({ blob });
  const image = await createImageBitmap(blob);
  // console.log({ image });
  const pattern = context.createPattern(image, 'no-repeat');

  context.translate(imageWidth - image.width, imageHeight - image.height);
  context.rect(0, 0, imageWidth, imageHeight);
  context.fillStyle = pattern;

  context.fill();
  canvas.remove();
  imgElement.remove();

  return canvas.toDataURL();
};

const WatermarkedImage = ({ dataUrl }) => {
  const [image, setImage] = useState(null);

  useEffect(() => {
    const attachWatermark = async (imgDataUrl) => {
      const wImage = await watermarkImageWithImage(imgDataUrl);
      setImage(wImage);
    };
    if (dataUrl) {
      attachWatermark(dataUrl);
    }
  }, [dataUrl]);

  return image ? <img src={image} alt="Watermarked_User_Img" /> : null;
};

const WatermarkImageWithImage = () => {
  const inputFileRef = useRef();
  const userImgRef = useRef();
  const [file, setFile] = useState(null);

  const readUserFile = (userFile) => {
    const reader = new FileReader();
    reader.onload = () => {
      setFile(reader.result);
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
  const watermarkedImage = file && <WatermarkedImage dataUrl={file} />;

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

export default WatermarkImageWithImage;
