import { PipelineUI } from "./ui";
import { NodePannel } from "./nodePannel";

function App() {
  return (
    <div className="flex flex-col md:flex-row w-full h-screen">
      <PipelineUI />
      <NodePannel />
    </div>
  );
}

export default App;
