import { RedirectButton } from "@/components";
import Canvas from "@/components/Canvas";
import { durations } from "@/constants/durations";

export default function Home() {

  return (
    <main className="flex flex-col h-screen w-screen">
      <Canvas>
       {/* Pass server components */}
        { durations.map((duration)=>
          <RedirectButton key={duration} duration={duration} />
        ) }
      </Canvas>
    </main>     
  );
}