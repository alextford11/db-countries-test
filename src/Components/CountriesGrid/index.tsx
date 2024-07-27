import React, { useCallback, useMemo, useRef, useState } from "react";
import CountryFlagRenderer from "../CountryFlagRenderer";
import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";
import CountriesSearchInput from "../CountriesSearchInput";

interface ICountryRowData {
    name: string;
    flag: string;
    population: number;
    languages: string;
    currencies: string;
}

interface ICountryAPIResponse {
    name: { common: string };
    flags: { svg: string };
    population: number;
    languages: Record<string, string>;
    currencies: Record<string, { name: string }>;
}

const CountriesGrid: React.FC = () => {
    const gridRef = useRef<AgGridReact>(null);
    const containerStyle = useMemo(() => ({ width: "100%", height: "500px" }), []);
    const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
    const [rowData, setRowData] = useState<ICountryRowData[]>([]);
    const [colDefs] = useState<ColDef[]>([
        { headerName: "Country Name", field: "name", sort: "asc", initialSortIndex: 1 },
        { field: "flag", cellRenderer: CountryFlagRenderer },
        { field: "population" },
        { field: "languages" },
        { field: "currencies" },
    ]);
    const defaultColDef: ColDef = useMemo(() => ({
        flex: 1,
    }), []);

    const onGridReady = useCallback(() => {
        fetch("https://restcountries.com/v3.1/all?fields=name,flags,population,languages,currencies")
            .then((response) => response.json())
            .then((data: ICountryAPIResponse[]) => {
                const countriesData: ICountryRowData[] = data.map((country) => ({
                    name: country.name.common,
                    flag: country.flags.svg,
                    population: country.population,
                    languages: Object.values(country.languages).join(", ") || "N/A",
                    currencies: Object.keys(country.currencies).join(", ") || "N/A",
                }));
                setRowData(countriesData);
            })
            .catch((error) => {
                console.error("Error fetching data: ", error);
            });
    }, []);

    return (
        <div style={containerStyle}>
            <CountriesSearchInput gridRef={gridRef} />
            <div style={gridStyle} className={"ag-theme-quartz-dark"}>
                <AgGridReact
                    ref={gridRef}
                    rowData={rowData}
                    columnDefs={colDefs}
                    defaultColDef={defaultColDef}
                    onGridReady={onGridReady}
                />
            </div>
        </div>
    );
};

export default CountriesGrid;
