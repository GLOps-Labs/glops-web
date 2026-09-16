"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Site } from "@/components/HomeClient";
import { writeLocaleCookie } from "@/lib/locale";

export function EnHome() {
  const router = useRouter();

  useEffect(() => {
    document.documentElement.lang = "en";
  }, []);

  return (
    <Site
      locale="en"
      onLocale={(nextLocale) => {
        writeLocaleCookie(nextLocale);
        void router.push(nextLocale === "en" ? "/en" : "/");
      }}
    />
  );
}
