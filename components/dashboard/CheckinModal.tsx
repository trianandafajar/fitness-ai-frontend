"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { X, Camera, MapPin, ImageIcon } from "lucide-react";
import { ButtonPrimary, ButtonSecondary } from "@/components/ui/Button";
import { attendanceService } from "@/services/attendances.service";
import type { WorkoutSchedule } from "@/types/dashboard";
import {
  openCamera,
  stopCamera,
  attachCamera,
  capturePhoto,
} from "@/lib/camera";

interface CheckinModalProps {
  schedule: WorkoutSchedule;
  onClose: () => void;
  onSuccess: () => void;
}

type PhotoMode = "camera" | "gallery";

export default function CheckinModal({ schedule, onClose, onSuccess }: CheckinModalProps) {
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoMode, setPhotoMode] = useState<PhotoMode>("camera");
  const [stream, setStream] = useState<MediaStream | null>(null);

  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  const [loading, setLoading] = useState(false);
  const [cameraLoading, setCameraLoading] = useState(false);
  const [error, setError] = useState("");

  const videoRef = useRef<HTMLVideoElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const cameraRequestRef = useRef(0);

  const closeCamera = useCallback(() => {
    cameraRequestRef.current += 1;

    stopCamera(streamRef.current);
    streamRef.current = null;

    setStream(null);
    setCameraLoading(false);
  }, []);

  const handleOpenCamera = useCallback(async () => {
    stopCamera(streamRef.current);
    streamRef.current = null;
    setStream(null);

    const requestId = ++cameraRequestRef.current;

    setError("");
    setCameraLoading(true);

    try {
      const mediaStream = await openCamera("user");

      if (requestId !== cameraRequestRef.current) {
        stopCamera(mediaStream);
        return;
      }

      streamRef.current = mediaStream;
      setStream(mediaStream);
    } catch {
      if (requestId === cameraRequestRef.current) {
        setError("Camera access denied or unavailable.");
      }
    } finally {
      if (requestId === cameraRequestRef.current) {
        setCameraLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    if (!stream) return;

    attachCamera(videoRef.current, stream);
  }, [stream]);

  const handleChangeMode = useCallback(
    (mode: PhotoMode) => {
      if (mode === photoMode) return;

      setPhotoMode(mode);
      setError("");

      if (mode === "gallery") {
        closeCamera();
        return;
      }

      void handleOpenCamera();
    },
    [photoMode, closeCamera, handleOpenCamera],
  );

  const handleTakePhoto = useCallback(async () => {
    if (!videoRef.current) return;

    try {
      const file = await capturePhoto(
        videoRef.current,
        `checkin-${Date.now()}.jpg`,
        true,
      );

      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));

      closeCamera();
    } catch {
      setError("Failed to capture photo.");
    }
  }, [closeCamera]);

  const handleGalleryPhoto = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      closeCamera();

      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    },
    [closeCamera],
  );

  const handleRemovePhoto = useCallback(() => {
    setPhoto(null);
    setPhotoPreview(null);

    if (galleryRef.current) {
      galleryRef.current.value = "";
    }

    if (photoMode === "camera") {
      void handleOpenCamera();
    }
  }, [photoMode, handleOpenCamera]);

  const handleClose = useCallback(() => {
    closeCamera();
    onClose();
  }, [closeCamera, onClose]);

  const handleSubmit = useCallback(async () => {
    setLoading(true);
    setError("");

    const fd = new FormData();
    if (latitude) fd.append("latitude", latitude);
    if (longitude) fd.append("longitude", longitude);
    if (photo) fd.append("photo", photo);

    try {
      await attendanceService.checkin(fd);

      closeCamera();

      window.dispatchEvent(new Event("fitness:streak-updated"));

      onSuccess();
    } catch (err: unknown) {
      const responseError = err as {
        response?: {
          data?: {
            message?: string;
          };
        };
      };

      setError(
        responseError.response?.data?.message ?? "Check-in failed. Try again.",
      );
    } finally {
      setLoading(false);
    }
  }, [latitude, longitude, photo, closeCamera, onSuccess]);

  useEffect(() => {
    if (!("geolocation" in navigator)) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude.toFixed(6));
        setLongitude(position.coords.longitude.toFixed(6));
      },
      () => {},
    );
  }, []);

  useEffect(() => {
    const cameraStart = window.setTimeout(() => {
      void handleOpenCamera();
    }, 0);

    return () => {
      window.clearTimeout(cameraStart);
      cameraRequestRef.current += 1;

      stopCamera(streamRef.current);
      streamRef.current = null;
    };
  }, [handleOpenCamera]);

  useEffect(() => {
    if (!photoPreview) return;

    return () => {
      URL.revokeObjectURL(photoPreview);
    };
  }, [photoPreview]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 sm:items-center">
      <div className="flex w-full flex-col rounded-t-2xl bg-white p-5 sm:w-110 sm:rounded-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold">Check In</h2>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg p-1.5 hover:bg-surface"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mb-4 rounded-xl bg-orange-tint p-3.5">
          <div className="flex items-center gap-2 text-sm font-semibold text-orange-deep">
            {schedule.day_of_week.charAt(0).toUpperCase() + schedule.day_of_week.slice(1)}
            {schedule.scheduled_time && <span>• {schedule.scheduled_time.slice(0, 5)}</span>}
          </div>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {schedule.exercises.map((ex) => (
              <span key={ex.name} className="rounded-lg bg-white/70 px-2 py-0.5 text-xs font-medium text-ink">
                {ex.name}{ex.sets ? ` ${ex.sets}×${ex.reps ?? ""}` : ""}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-3.5">
          <div>
            <label className="mb-1.5 block text-[13px] font-semibold text-ink">
              Photo
            </label>

            {!photoPreview && (
              <div className="mb-3 grid grid-cols-2 rounded-xl bg-surface p-1">
                <button
                  type="button"
                  onClick={() => handleChangeMode("camera")}
                  className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
                    photoMode === "camera"
                      ? "bg-orange text-white shadow-sm"
                      : "text-ink-soft hover:text-ink"
                  }`}
                >
                  <Camera size={16} />
                  Camera
                </button>

                <button
                  type="button"
                  onClick={() => handleChangeMode("gallery")}
                  className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
                    photoMode === "gallery"
                      ? "bg-orange text-white shadow-sm"
                      : "text-ink-soft hover:text-ink"
                  }`}
                >
                  <ImageIcon size={16} />
                  Gallery
                </button>
              </div>
            )}

            <input
              ref={galleryRef}
              type="file"
              accept="image/*"
              onChange={handleGalleryPhoto}
              className="hidden"
            />

            {photoPreview ? (
              <div className="relative">
                <img
                  src={photoPreview}
                  alt="Preview"
                  className="h-64 w-full rounded-xl object-cover"
                />

                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="absolute right-2 top-2 rounded-full bg-black/50 p-1 text-white"
                >
                  <X size={14} />
                </button>
              </div>
            ) : photoMode === "camera" ? (
              stream ? (
                <div className="space-y-3">
                  <div className="overflow-hidden rounded-xl bg-black">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="h-72 w-full scale-x-[-1] object-cover"
                    />
                  </div>

                  <ButtonPrimary
                    type="button"
                    onClick={handleTakePhoto}
                    className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold"
                  >
                    <Camera size={18} />
                    Take Selfie
                  </ButtonPrimary>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => void handleOpenCamera()}
                  disabled={cameraLoading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-line py-8 text-sm text-ink-soft hover:border-orange/50 hover:text-orange-deep disabled:opacity-50"
                >
                  <Camera size={20} />

                  {cameraLoading ? "Opening camera..." : "Open Camera"}
                </button>
              )
            ) : (
              <button
                type="button"
                onClick={() => galleryRef.current?.click()}
                className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-line py-8 text-sm text-ink-soft hover:border-orange/50 hover:text-orange-deep"
              >
                <ImageIcon size={20} />
                Choose from gallery
              </button>
            )}
          </div>

          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-[13px] font-semibold text-ink">
              <MapPin size={14} />
              Location
              <span className="font-normal text-ink-soft">(Optional)</span>
            </label>

            {latitude && longitude ? (
              <div className="rounded-xl bg-surface px-3.5 py-2.5 text-sm text-ink">
                {latitude}, {longitude}
              </div>
            ) : (
              <div className="rounded-xl bg-surface px-3.5 py-2.5 text-sm text-ink-soft">
                Location unavailable
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="mt-3 rounded-[10px] border border-danger/30 bg-danger/5 px-3.5 py-2.5 text-[13px] font-medium text-danger">
            {error}
          </div>
        )}

        <div className="mt-4 flex gap-2.5">
          <ButtonSecondary
            type="button"
            onClick={handleClose}
            className="flex-1 py-2.75 text-[13.5px]"
          >
            Cancel
          </ButtonSecondary>

          <ButtonPrimary
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 py-2.75 text-[13.5px]"
          >
            {loading ? "Checking in..." : "Check In"}
          </ButtonPrimary>
        </div>
      </div>
    </div>
  );
}
