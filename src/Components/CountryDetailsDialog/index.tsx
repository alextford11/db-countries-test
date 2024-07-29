import "./index.css"
import React, {useState} from "react";
import {
    FloatingFocusManager,
    FloatingOverlay,
    FloatingPortal,
    useClick,
    useDismiss,
    useFloating,
    useInteractions,
    useRole
} from "@floating-ui/react";
import {CustomCellRendererProps} from "ag-grid-react";

const CountryDetailsDialog: React.FC<CustomCellRendererProps> = (props) => {
    const [isOpen, setIsOpen] = useState(false);

    const {refs, context} = useFloating({
        open: isOpen,
        onOpenChange: setIsOpen
    });

    const click = useClick(context);
    const role = useRole(context);
    const dismiss = useDismiss(context, {outsidePressEvent: "mousedown"});

    const {getReferenceProps, getFloatingProps} = useInteractions([click, role, dismiss]);

    return (
        <>
            <button ref={refs.setReference} {...getReferenceProps()}>
                View more
            </button>
            <FloatingPortal>
                {isOpen && (
                    <FloatingOverlay className="dialog-overlay" lockScroll>
                        <FloatingFocusManager context={context}>
                            <div
                                className="dialog"
                                ref={refs.setFloating}
                                {...getFloatingProps()}
                            >
                                <img
                                    alt={`${props.data.name} Flag`}
                                    src={props.data.flag}
                                    className="details-flag"
                                />
                                <h2>{props.data.name}</h2>
                                <div className="details-container">
                                    <span><strong>Official Name:</strong> {props.data.officialName}</span>
                                    <span><strong>Capital:</strong> {props.data.capital}</span>
                                    <span><strong>Region:</strong> {props.data.region}</span>
                                    <span><strong>Subregion:</strong> {props.data.subregion}</span>
                                    <span><strong>Languages:</strong> {props.data.languages}</span>
                                    <span><strong>Currencies:</strong> {props.data.currencies}</span>
                                    <span><strong>Area:</strong> {props.data.area}km&#178;</span>
                                    <span><strong>Population:</strong> {props.data.population}</span>
                                    <span><strong>Google Maps:</strong> <a href={props.data.googleMaps}>View here</a></span>
                                </div>
                            </div>
                        </FloatingFocusManager>
                    </FloatingOverlay>
                )}
            </FloatingPortal>
        </>
    );
}

export default CountryDetailsDialog;