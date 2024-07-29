import './App.css';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import CountriesGrid from "./Components/CountriesGrid";



function App() {
    return (
        <div className="">
            <h1>Countries List</h1>
            <CountriesGrid/>
        </div>
    )
}

export default App
