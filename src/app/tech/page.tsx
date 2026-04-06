export default function TechPage() {
  return (
    <div className="flex flex-col flex-1 items-center py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full space-y-16">
        
        {/* Header Section */}
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            Design <span className="text-[var(--color-primary)]">System</span>
          </h1>
          <p className="text-xl opacity-80 max-w-2xl">
            A look into the foundational elements comprising the Slashdot brand language.
          </p>
        </div>

        {/* Color Palette */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold border-b border-black/10 dark:border-white/10 pb-4">Color Palette</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Primary Teal */}
            <div className="rounded-lg overflow-hidden border border-black/10 dark:border-white/10 shadow-sm">
              <div className="h-32 bg-[#0291B2]"></div>
              <div className="p-4 bg-[var(--color-bg)]">
                <p className="font-bold text-lg">Primary Teal</p>
                <code className="text-sm opacity-80 block mt-1">HEX: #0291B2</code>
                <code className="text-sm opacity-80 block">CSS: var(--color-primary)</code>
              </div>
            </div>

            {/* Dark Background */}
            <div className="rounded-lg overflow-hidden border border-black/10 dark:border-white/10 shadow-sm">
              <div className="h-32 bg-[#262626]"></div>
              <div className="p-4 bg-[var(--color-bg)]">
                <p className="font-bold text-lg">Dark Mode Surface</p>
                <code className="text-sm opacity-80 block mt-1">HEX: #262626</code>
                <code className="text-sm opacity-80 block">CSS: var(--color-bg) (in .dark)</code>
              </div>
            </div>

          </div>
        </div>

        {/* Typography */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold border-b border-black/10 dark:border-white/10 pb-4">Typography</h2>
          
          <div className="p-8 rounded-lg border border-black/10 dark:border-white/10 dark:bg-white/5 space-y-8">
            <div style={{ fontFamily: "'Arista Pro', sans-serif" }}>
              <p className="text-sm text-[var(--color-primary)] uppercase tracking-wider mb-2 font-sans font-bold">Arista Pro Bold</p>
              <h3 className="text-5xl md:text-7xl mb-4 leading-tight">Ag</h3>
              <p className="text-xl opacity-80">
                A B C D E F G H I J K L M N O P Q R S T U V W X Y Z <br className="hidden md:block" />
                a b c d e f g h i j k l m n o p q r s t u v w x y z <br className="hidden md:block" />
                0 1 2 3 4 5 6 7 8 9
              </p>
            </div>
            
            <div className="font-sans">
              <p className="text-sm text-[var(--color-primary)] uppercase tracking-wider mb-2 font-bold">System Sans (Geist)</p>
              <p className="text-lg opacity-80 max-w-2xl leading-relaxed">
                We use the system sans-serif stack (Geist/Inter/Arial) for improved readability 
                in long-form paragraph texts, gracefully falling back dependent on the user's OS 
                while keeping our custom typography for important headings and branding.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
