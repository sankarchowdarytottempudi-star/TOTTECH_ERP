"use client";

import { useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";

export default function ToastProvider() {

  useEffect(() => {

    const originalAlert = window.alert;

    window.alert = (message?: string) => {

      const text = String(message || "");

      if (
        text.toLowerCase().includes("fail") ||
        text.toLowerCase().includes("error")
      ) {

        toast.error(text);

      } else {

        toast.success(text);

      }

    };

    return () => {
      window.alert = originalAlert;
    };

  }, []);

  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
      }}
    />
  );

}
