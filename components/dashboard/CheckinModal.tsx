"use client";

import { useState, useRef, useEffect } from "react";
import { X, Camera, MapPin } from "lucide-react";
import { ButtonPrimary, ButtonSecondary } from "@/components/ui/Button";
import { attendanceService } from "@/services/attendances.service";
import type { WorkoutSchedule } from "@/types/dashboard";

interface CheckinModalProps {
  schedule: WorkoutSchedule;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CheckinModal({ schedule, onClose, onSuccess }: CheckinModalProps) {
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [latitude, setLatitude] = useState<string>("");
  const [longitude, setLongitude] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLatitude(pos.coords.latitude.toFixed(6));
          setLongitude(pos.coords.longitude.toFixed(6));
        },
        () => setError("Location access denied. Enable GPS to check in."),
      );
    } else {
      setError("Geolocation not available.");
    }
  }, []);

  useEffect(() => {
    if (photoPreview) return () => URL.revokeObjectURL(photoPreview);
  }, [photoPreview]);

  function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  }

  async function handleSubmit() {
    if (!latitude || !longitude) {
      setError("Location is required. Please enable GPS.");
      return;
    }

    setLoading(true);
    setError("");

    const fd = new FormData();
    fd.append("latitude", latitude);
    fd.append("longitude", longitude);
    if (photo) fd.append("photo", photo);

    try {
      await attendanceService.checkin(fd);
      window.dispatchEvent(new Event("fitness:streak-updated"));
      onSuccess();
    } catch (err: any) {
      const msg = err?.response?.data?.message;
      if (msg) setError(msg);
      else setError("Check-in failed. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 sm:items-center">
      <div className="flex w-full flex-col rounded-t-2xl bg-white p-5 sm:w-110 sm:rounded-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold">Check In</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-surface">
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
            <label className="mb-1.5 block text-[13px] font-semibold text-ink">Photo</label>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handlePhoto}
              className="hidden"
            />
            {photoPreview ? (
              <div className="relative">
                <img src={photoPreview} alt="Preview" className="h-40 w-full rounded-xl object-cover" />
                <button
                  onClick={() => { setPhoto(null); setPhotoPreview(null); }}
                  className="absolute right-2 top-2 rounded-full bg-black/50 p-1 text-white"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-line py-8 text-sm text-ink-soft hover:border-orange/50 hover:text-orange-deep"
              >
                <Camera size={20} />
                Take or upload photo
              </button>
            )}
          </div>

          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-[13px] font-semibold text-ink">
              <MapPin size={14} /> Location
            </label>
            {latitude && longitude ? (
              <div className="rounded-xl bg-surface px-3.5 py-2.5 text-sm text-ink">
                {latitude}, {longitude}
              </div>
            ) : (
              <div className="rounded-xl bg-surface px-3.5 py-2.5 text-sm text-ink-soft">
                Detecting location...
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
          <ButtonSecondary type="button" onClick={onClose} className="flex-1 py-2.75 text-[13.5px]">
            Cancel
          </ButtonSecondary>
          <ButtonPrimary
            type="button"
            onClick={handleSubmit}
            disabled={loading || !latitude}
            className="flex-1 py-2.75 text-[13.5px]"
          >
            {loading ? "Checking in..." : "Check In"}
          </ButtonPrimary>
        </div>
      </div>
    </div>
  );
}
