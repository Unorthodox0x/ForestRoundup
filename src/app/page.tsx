import { FetchRedirectToken } from "@/components";
import Canvas from "@/components/Canvas";
import { durations } from "@/constants/durations";



export default function Home() {

  return (
    <main className="flex flex-col h-cameraHeight w-cameraWidth">
      <Canvas>
       {/* Pass server components */}
        { durations.map((duration)=>
          <FetchRedirectToken key={duration} duration={duration} />
        ) }
      </Canvas>
    </main>     
  );
}