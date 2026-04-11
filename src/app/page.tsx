export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl w-full space-y-12 text-center">
        
        {/* Header Section */}
        <div className="space-y-6">
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight">
            Welcome to the <br className="hidden sm:block" />
            <span className="text-[var(--color-primary)]">Slashdot</span> Competition
          </h1>
          <p className="text-xl opacity-80 max-w-2xl mx-auto">
            Experience our new responsive design system featuring smooth 0.3s theme transitions, 
            built with Next.js 15, Tailwind v4, and next-themes perfectly tailored for mobile and PC.
          </p>
        </div>

        {/* Call to action buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 mt-8">
          <a
            href="#join-us"
            className="inline-flex justify-center items-center px-8 py-3 text-base font-medium rounded-md text-white bg-[var(--color-primary)] hover:opacity-90 transition-opacity duration-300 shadow-md"
          >
            Join Competition
          </a>
          <a
            href="#learn"
            className="inline-flex justify-center items-center px-8 py-3 text-base font-medium rounded-md text-[var(--color-primary)] bg-transparent border-2 border-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white transition-all duration-300"
          >
            Learn More
          </a>
        </div>

        {/* Feature Grid to showcase layout responsiveness */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 text-left">
          <div className="p-6 rounded-lg border border-black/10 dark:border-white/10 dark:bg-white/5 hover:border-[var(--color-primary)] transition-colors duration-300">
            <h3 className="text-xl font-bold mb-2">Modern Stack</h3>
            <p className="opacity-80">Built on the latest Next.js App Router for optimal performance.</p>
          </div>
          <div className="p-6 rounded-lg border border-black/10 dark:border-white/10 dark:bg-white/5 hover:border-[var(--color-primary)] transition-colors duration-300">
            <h3 className="text-xl font-bold mb-2">Dark Mode</h3>
            <p className="opacity-80">Smooth 0.3s transitions between light and custom dark surfaces (#262626).</p>
          </div>
          <div className="p-6 rounded-lg border border-black/10 dark:border-white/10 dark:bg-white/5 hover:border-[var(--color-primary)] transition-colors duration-300">
            <h3 className="text-xl font-bold mb-2">Mobile First</h3>
            <p className="opacity-80">Fully responsive design that adapts gracefully to any screen size.</p>
          </div>
        </div>

      </div>
    </div>
  );
}
