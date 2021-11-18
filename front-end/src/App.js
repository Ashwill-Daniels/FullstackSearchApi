// Below I import the ApiComponent
import ApiComponent from "./Components/ApiComponent";
// Here I import the bootstrap module and a custom stylesheet
import "bootstrap/dist/css/bootstrap.min.css";
import "./CSS/myStylesheet.css";

function App() {
  return (
    <div className="App">
      <ApiComponent />
    </div>
  );
}

export default App;
