import React, {useCallback, useMemo, useRef, useState} from "react";
import CountryFlagRenderer from "../CountryFlagRenderer";
import {AgGridReact} from "ag-grid-react";
import {ColDef, NewValueParams} from "ag-grid-community";
import CountriesSearchInput from "../CountriesSearchInput";
import CountryDetailsDialog from "../CountryDetailsDialog";

export interface ICountryRowData {
    cca2: string;
    name: string;
    flag: string;
    population: number;
    languages: string;
    currencies: string;
    favourite: boolean;
    officialName: string;
    capital: string;
    region: string;
    subregion: string;
    area: number;
    googleMaps: string;
}

interface ICountryAPIResponse {
    cca2: string;
    name: { common: string, official: string };
    flags: { svg: string };
    population: number;
    languages: Record<string, string>;
    currencies: Record<string, { name: string }>;
    capital: string[];
    region: string;
    subregion: string;
    area: number;
    maps: { googleMaps: string; };
}

const getFavourites = (): string[] => {
    return (localStorage.getItem("favourites") || "").split(',')
}

const setFavourites = (favourites: string[]) => {
    localStorage.setItem("favourites", favourites.toString())
}

const inFavourites = (cca2: string): boolean => {
    return getFavourites().includes(cca2)
}

const onFavouriteChanged = (newValue: NewValueParams) => {
    const favourites = getFavourites()
    const cca2 = newValue.data.cca2
    if (newValue.data.favourite) {
        if (!inFavourites(cca2)) {
            favourites.push(cca2)
            setFavourites(favourites)
        }
    } else {
        if (inFavourites(cca2)) {
            setFavourites(favourites.filter(favourite => favourite !== cca2))
        }
    }
}

const CountriesGrid: React.FC = () => {
    const gridRef = useRef<AgGridReact>(null);
    const containerStyle = useMemo(() => ({width: "100%", height: "600px"}), []);
    const gridStyle = useMemo(() => ({height: "100%", width: "100%"}), []);
    const [rowData, setRowData] = useState<ICountryRowData[]>([]);
    const [colDefs] = useState<ColDef[]>([
        {
            headerName: "⭐",
            field: "favourite",
            cellEditor: "agCheckboxCellEditor",
            editable: true,
            onCellValueChanged: onFavouriteChanged,
            filter: true
        },
        {
            headerName: "Country Name",
            field: "name",
            sort: "asc",
            initialSortIndex: 1,
            filter: true,
        },
        {field: "flag", cellRenderer: CountryFlagRenderer},
        {field: "population", filter: true, valueFormatter: (params) => params.value.toLocaleString()},
        {field: "languages", filter: true},
        {field: "currencies", filter: true},
        {cellRenderer: CountryDetailsDialog}
    ]);
    const defaultColDef: ColDef = useMemo(() => ({
        flex: 1,
    }), []);

    const onGridReady = useCallback(() => {
        fetch("https://restcountries.com/v3.1/all?fields=name,flags,population,languages,currencies,cca2,capital,region,subregion,area,maps")
            .then((response) => response.json())
            .then((data: ICountryAPIResponse[]) => {
                const countriesData: ICountryRowData[] = data.map((country) => ({
                    cca2: country.cca2,
                    name: country.name.common,
                    flag: country.flags.svg,
                    population: country.population,
                    languages: Object.values(country.languages).join(", ") || "N/A",
                    currencies: Object.keys(country.currencies).join(", ") || "N/A",
                    favourite: inFavourites(country.cca2),
                    officialName: country.name.official,
                    capital: country.capital.join(", ") || "N/A",
                    region: country.region,
                    subregion: country.subregion,
                    area: country.area,
                    googleMaps: country.maps.googleMaps
                }));
                setRowData(countriesData);
            })
            .catch((error) => {
                console.error("Error fetching data: ", error);
            });
    }, []);

    return (
        <div style={containerStyle}>
            <CountriesSearchInput gridRef={gridRef}/>
            <div style={gridStyle} className={"ag-theme-quartz-dark"}>
                <AgGridReact
                    ref={gridRef}
                    rowData={rowData}
                    columnDefs={colDefs}
                    defaultColDef={defaultColDef}
                    onGridReady={onGridReady}
                    pagination={true}
                />
            </div>
        </div>
    );
};

export default CountriesGrid;
