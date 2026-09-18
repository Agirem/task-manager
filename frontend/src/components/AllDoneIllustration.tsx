import * as LottieModule from "lottie-react";
import taskDoneAnimation from "@/assets/task-done.json";

// Vite CJS/ESM interop: the component lands under `.default` or `.default.default` depending on the case.
const rawModule = LottieModule as unknown as { default: unknown };
const Lottie = (
  typeof rawModule.default === "function"
    ? rawModule.default
    : (rawModule.default as { default: unknown }).default
) as (props: { animationData: unknown; loop?: boolean; autoplay?: boolean; className?: string }) => React.ReactElement;

export function AllDoneIllustration() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-40 h-40">
        <Lottie animationData={taskDoneAnimation} loop={false} autoplay />
      </div>
      <p className="font-medium mt-2">Toutes les taches sont terminees</p>
      <p className="text-sm text-muted-foreground">Bravo !</p>
    </div>
  );
}
