export default function Navbar() {
  return (
    <nav className="absolute top-0 left-0 w-full z-20 flex justify-between items-center px-8 py-4 bg-transparent">
      <h1 className="text-2xl font-bold text-white">PromptChain</h1>
      <div className="flex gap-6 text-white text-sm font-medium">
        <a href="/login" className="border px-5 py-2 rounded-2xl bg-white text-black font-bold hover:bg-white/90">
          Login
        </a>
        <a href="/signup" className="border px-5 py-2 rounded-2xl bg-white text-black font-bold hover:bg-white/90">
          Sign Up
        </a>
      </div>
    </nav>
  );
}
