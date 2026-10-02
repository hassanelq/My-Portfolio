import { simulate, type SimulationInputs } from "@/lib/math/simulation";
self.onmessage = (event: MessageEvent<SimulationInputs>) => {
  try {
    self.postMessage({ result: simulate(event.data) });
  } catch (error) {
    self.postMessage({
      error: error instanceof Error ? error.message : "Simulation failed.",
    });
  }
};
