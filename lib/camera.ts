export type CameraFacingMode = "user" | "environment";

export async function openCamera(
  facingMode: CameraFacingMode = "user",
): Promise<MediaStream> {
  if (typeof window === "undefined") {
    throw new Error("Camera can only be accessed in the browser.");
  }

  if (!navigator.mediaDevices?.getUserMedia) {
    throw new Error("Camera is not supported in this browser.");
  }

  return navigator.mediaDevices.getUserMedia({
    video: {
      facingMode,
    },
    audio: false,
  });
}

export function stopCamera(stream?: MediaStream | null) {
  stream?.getTracks().forEach((track) => track.stop());
}

export function attachCamera(
  video: HTMLVideoElement | null,
  stream: MediaStream,
) {
  if (!video) return;

  video.srcObject = stream;
  void video.play();
}

export async function capturePhoto(
  video: HTMLVideoElement,
  fileName = "selfie.jpg",
  mirror = false,
): Promise<File> {
  if (!video.videoWidth || !video.videoHeight) {
    throw new Error("Camera is not ready.");
  }

  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Failed to access canvas.");
  }

  if (mirror) {
    context.translate(canvas.width, 0);
    context.scale(-1, 1);
  }

  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (result) => {
        if (!result) {
          reject(new Error("Failed to capture image."));
          return;
        }

        resolve(result);
      },
      "image/jpeg",
      0.9,
    );
  });

  return new File([blob], fileName, {
    type: "image/jpeg",
  });
}
