"use client";

import dynamic from "next/dynamic";

const LabCanvas = dynamic(() => import("./LabCanvas"), { ssr: false });

export function BottleLab() {
  return <LabCanvas />;
}
