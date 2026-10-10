"use client";

import { useEffect, useState } from "react";
import { errorMessage } from "@/lib/api";
import { weddingTimestamp } from "./format";
import type { InvitationInteractions, InvitationViewData } from "./types";

export function useCountdown(date: string | null, time: string | null) {
  const target = weddingTimestamp(date, time);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!target) return;
    const tick = () => {
      const diff = Math.max(0, target - Date.now());
      setTimeLeft({
        days: Math.floor(diff / 86_400_000),
        hours: Math.floor((diff % 86_400_000) / 3_600_000),
        minutes: Math.floor((diff % 3_600_000) / 60_000),
        seconds: Math.floor((diff % 60_000) / 1000),
      });
      return diff;
    };
    if (tick() <= 0) return;
    const id = setInterval(() => {
      if (tick() <= 0) clearInterval(id);
    }, 1000);
    return () => clearInterval(id);
  }, [target]);

  return timeLeft;
}

/**
 * Shared RSVP + wishes state for every template, so each template only
 * decides how things look.
 */
export function useInvitationActions(data: InvitationViewData, actions: InvitationInteractions) {
  const disabled = actions.mode === "preview";
  const knownName = data.guestName ?? "";

  // ---- wishes
  const [wishName, setWishName] = useState(knownName);
  const [wishText, setWishText] = useState("");
  const [wishSending, setWishSending] = useState(false);
  const [wishError, setWishError] = useState("");
  const [wishSent, setWishSent] = useState(false);

  const askWishName = !actions.guestIdentified && !knownName;

  const submitWish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (disabled) return;
    const name = (actions.guestIdentified || knownName ? knownName : wishName).trim();
    if (!wishText.trim() || !name) {
      setWishError(!name ? "Please enter your name." : "Please write a wish.");
      return;
    }
    setWishSending(true);
    setWishError("");
    try {
      await actions.submitWish(name, wishText.trim());
      setWishText("");
      setWishSent(true);
    } catch (error) {
      setWishError(errorMessage(error));
    } finally {
      setWishSending(false);
    }
  };

  // ---- RSVP
  const [rsvpAttend, setRsvpAttend] = useState<boolean | null>(
    actions.rsvp && actions.rsvp.status !== "pending" ? actions.rsvp.status === "attending" : null,
  );
  const [rsvpCount, setRsvpCount] = useState(Math.max(1, actions.rsvp?.headCount ?? 1));
  const [rsvpName, setRsvpName] = useState(knownName);
  const [rsvpSubmitted, setRsvpSubmitted] = useState(Boolean(actions.rsvp && actions.rsvp.status !== "pending"));
  const [rsvpSending, setRsvpSending] = useState(false);
  const [rsvpError, setRsvpError] = useState("");

  const askRsvpName = !actions.guestIdentified;

  const submitRsvp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (disabled || rsvpAttend === null) return;
    const name = (actions.guestIdentified ? knownName : rsvpName).trim();
    if (!name) {
      setRsvpError("Please enter your name.");
      return;
    }
    setRsvpSending(true);
    setRsvpError("");
    try {
      await actions.submitRsvp({ attending: rsvpAttend, headCount: rsvpCount, name });
      setRsvpSubmitted(true);
    } catch (error) {
      setRsvpError(errorMessage(error));
    } finally {
      setRsvpSending(false);
    }
  };

  return {
    disabled,
    wishes: actions.wishes,
    wish: {
      name: wishName,
      setName: setWishName,
      askName: askWishName,
      text: wishText,
      setText: setWishText,
      sending: wishSending,
      error: wishError,
      sent: wishSent,
      submit: submitWish,
    },
    rsvp: {
      attend: rsvpAttend,
      setAttend: setRsvpAttend,
      count: rsvpCount,
      increment: () => setRsvpCount((c) => Math.min(20, c + 1)),
      decrement: () => setRsvpCount((c) => Math.max(1, c - 1)),
      name: rsvpName,
      setName: setRsvpName,
      askName: askRsvpName,
      submitted: rsvpSubmitted,
      edit: () => setRsvpSubmitted(false),
      sending: rsvpSending,
      error: rsvpError,
      submit: submitRsvp,
    },
  };
}
