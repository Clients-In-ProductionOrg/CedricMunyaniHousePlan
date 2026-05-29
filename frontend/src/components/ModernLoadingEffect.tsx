import { Sparkles } from 'lucide-react';

interface ModernLoadingEffectProps {
  title?: string;
  subtitle?: string;
}

const ModernLoadingEffect = ({
  title = 'Refreshing the latest listings',
  subtitle = 'Fresh content and new visuals are loading in the background.',
}: ModernLoadingEffectProps) => {
  return (
    <div className="pointer-events-none w-full">
      <div className="mx-auto max-w-xl overflow-hidden rounded-[2rem] border border-primary/20 bg-card/85 p-6 shadow-2xl shadow-primary/10 backdrop-blur-md">
        <div className="relative isolate flex min-h-[220px] items-center justify-center overflow-hidden rounded-[1.5rem] border border-white/10 bg-gradient-to-br from-primary/10 via-background to-primary/5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(14,116,144,0.24),_transparent_55%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.22),_transparent_40%)]" />

          <div className="loading-wave-ring loading-wave-ring--1" />
          <div className="loading-wave-ring loading-wave-ring--2" />
          <div className="loading-wave-ring loading-wave-ring--3" />
          <div className="loading-wave-core" />

          <div className="relative z-10 flex max-w-md flex-col items-center text-center">
            <div className="mb-4 rounded-full bg-background/80 p-3 text-primary shadow-lg shadow-primary/20">
              <Sparkles className="h-5 w-5" />
            </div>
            <p className="text-lg font-semibold text-foreground">{title}</p>
            <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
            <div className="mt-4 flex items-center gap-2">
              <span className="loading-wave-dot" />
              <span className="loading-wave-dot loading-wave-dot--2" />
              <span className="loading-wave-dot loading-wave-dot--3" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernLoadingEffect;
