import "./App.css";
import Header from "./components/Header";
import FileUpload from "./components/FileUpload";
import ModelSelector from "./components/ModelSelector";
import ActionButtons from "./components/ActionButtons";
import Results from "./components/Results";

function App() {
  return (
    <div className="container">
      <Header />

      <div className="card">
        <FileUpload />
        <ModelSelector />
        <ActionButtons />
      </div>

      <Results />
    </div>
  );
}

export default App;