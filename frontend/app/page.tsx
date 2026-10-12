import { Suspense } from "react";
import Hero from "@/components/Hero";
import JobList from "@/components/JobList";

export default function HomePage() {
  return (
    <>
      <Hero
        eyebrow="Dicoding Jobs"
        title="Temukan lowongan yang cocok untuk kamu"
      />
      <Suspense>
        <JobList />
      </Suspense>
    </>
  );
}
