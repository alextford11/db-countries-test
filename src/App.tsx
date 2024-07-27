import './App.css';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import {useCallback, useMemo, useState} from "react";
import {AgGridReact} from "ag-grid-react";
import {ColDef} from "ag-grid-community"
import CountryFlagRenderer from "./Components/CountryFlagRenderer.tsx";

interface ICountryRowData {
    name: string
    flag: string
    population: number
    languages: string
    currencies: string
}

const CountriesGrid = () => {
    const containerStyle = useMemo(() => ({width: "100%", height: "500px"}), []);
    const gridStyle = useMemo(() => ({height: "100%", width: "100%"}), []);
    const [rowData, setRowData] = useState<ICountryRowData[]>([]);
    const [colDefs] = useState<ColDef[]>([
        {headerName: "Country Name", field: "name", sort: "asc", initialSortIndex: 1},
        {field: "flag", cellRenderer: CountryFlagRenderer},
        {field: "population"},
        {field: "languages"},
        {field: "currencies"},
    ]);
    const defaultColDef = useMemo(() => ({
        flex: 1,
    }), []);

    const onGridReady = useCallback(() => {
        fetch("https://restcountries.com/v3.1/all?fields=name,flags,population,languages,currencies")
            .then((response) => response.json())
            .then((data) => {
                const countriesData: ICountryRowData[] = data.map((country: any) => ({
                    name: country.name.common,
                    flag: country.flags.svg,
                    population: country.population,
                    languages: Object.values(country.languages).join(', '),
                    currencies: Object.keys(country.currencies).join(', '),
                }));
                setRowData(countriesData);
            })
            .catch((error) => {
                console.error("Error fetching data: ", error);
            });
    }, []);


    return (
        <div style={containerStyle}>
            <div style={gridStyle} className={"ag-theme-quartz-dark"}>
                <AgGridReact
                    rowData={rowData}
                    columnDefs={colDefs}
                    defaultColDef={defaultColDef}
                    onGridReady={onGridReady}
                />
            </div>
        </div>
    );
};

function App() {
    return (
        <>
            <h1>Countries List</h1>
            <CountriesGrid/>
        </>
    )
}

export default App
