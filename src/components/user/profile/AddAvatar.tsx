import React, { useState, useRef, useEffect, useCallback, memo } from "react";
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  Crop,
  PixelCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { useDispatch } from "react-redux";
import { Socket } from "socket.io-client";

import { cropImage } from "../../../utils";

// UI //
import styles from "./AddAvatar.module.css";
import { Button } from "@mui/material";
import { changeAvatar } from "../../../redux/user/userSlice";
import ImageIcon from "@mui/icons-material/Image";
import SaveIcon from "@mui/icons-material/Save";
import { changeAvatar_emitter } from "../../../socket-io/emitters";
import { imageTypes } from "../../chat/ImageInput";

interface Props {
  socket: Socket | undefined;
  handleCloseModal: () => void;
}

function AddAvatar({ socket, handleCloseModal }: Props): JSX.Element {
  const dispatch = useDispatch();

  const [imgSrc, setImgSrc] = useState("");
  const imgRef = useRef<any>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();

  const [sizeExceeded, setSizeExceeded] = useState<boolean>(false);
  const [notSupported, setNotSupported] = useState<boolean>(false);

  const [croppedImageBlob, setCroppedImageBlob] = useState<Blob | null>(null);

  function onSelectFile(e: React.ChangeEvent<HTMLInputElement>) {
    setSizeExceeded(false);
    setNotSupported(false);

    if (e.target.files && e.target.files.length > 0) {
      setCrop(undefined); // Makes crop preview update between images.

      const file = e.target.files[0];
      // 1 MB max size
      if (file.size > 1000000) {
        setSizeExceeded(true);
        return;
      }

      if (!imageTypes.includes(file.type)) {
        setNotSupported(true);
        return;
      }

      const reader = new FileReader();
      reader.addEventListener("load", () => {
        if (reader.result) {
          setImgSrc(reader.result.toString() || "");
        }
      });
      reader.readAsDataURL(file);
    }
  }

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    imgRef.current = e.currentTarget;
    const { width, height } = e.currentTarget;

    // This is to demonstate how to make and center a % aspect crop
    // which is a bit trickier so we use some helper functions.
    const crop = centerCrop(
      makeAspectCrop({ unit: "%", width: 50 }, 1, width, height),
      width,
      height
    );
    setCrop(crop);
  }

  async function changeAvatarHandler() {
    if (socket && croppedImageBlob) {
      const imageObject = {
        buffer: croppedImageBlob,
        type: croppedImageBlob.type,
      };

      changeAvatar_emitter(socket, imageObject);
      dispatch(changeAvatar(URL.createObjectURL(croppedImageBlob)));
    }
    console.log("changing avatar !!!");

    handleCloseModal();
  }

  const cropImageCallback = useCallback(async (completedCrop: PixelCrop) => {
    if (completedCrop) {
      const blob = await cropImage(imgRef.current, completedCrop);
      if (blob !== null) {
        setCroppedImageBlob(blob);
      }
    }
  }, []);

  // whenever the image is cropped, update the blob
  useEffect(() => {
    if (completedCrop) {
      cropImageCallback(completedCrop);
    }
  }, [completedCrop, cropImageCallback]);

  return (
    <main className={styles.main}>
      {!Boolean(imgSrc) && (
        <div className={styles.button_wrapper}>
          <label htmlFor="select-image" className={styles.label}>
            <Button
              variant="outlined"
              className={styles.button}
              component="span"
            >
              <ImageIcon />
              Upload a picture
            </Button>
          </label>
          <input
            id="select-image"
            type="file"
            accept="image/png, image/jpeg, image/jpg, image/gif"
            onChange={onSelectFile}
            style={{ display: "none" }}
          />
        </div>
      )}

      {Boolean(imgSrc) && (
        <div className={styles.crop_image_wrapper}>
          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={1}
            circularCrop={true}
          >
            <img
              alt="Crop me"
              src={imgSrc}
              onLoad={onImageLoad}
              className={styles.crop_image}
            />
          </ReactCrop>
        </div>
      )}

      {sizeExceeded && (
        <div>Image size exceeds maximum allowable size (1 MB).</div>
      )}
      {notSupported && <div>Please only select PNG, GIF, or JPG picture.</div>}

      {Boolean(imgSrc) && (
        <div className={styles.button_wrapper}>
          <Button
            variant="outlined"
            onClick={changeAvatarHandler}
            className={styles.button}
          >
            <SaveIcon />
            change avatar
          </Button>
        </div>
      )}
    </main>
  );
}

export default memo(AddAvatar);

// NOTE //
/*
(1) I tried to use HTTP request to post the avatar image and parse it using 
    Multer. But DONT FUKKING know why, any file larger than 10KB?-15KB?, the post request
    stuck in pending. And sometimes, an Error - "blocked by CORS policy: No 'Access-Control-Allow-Origin' 
    header is present on the requested resource." occcured after multiple uploads
    So I have to use the socket to send the image file
*/
