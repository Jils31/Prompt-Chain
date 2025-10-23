import BeamsBackground from "./ui/BeamsBackground";

export default function HeroSection() {
  return (
    <section className="relative w-full h-screen overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 ">
        <BeamsBackground />
      </div>
    </section>
  );
}
