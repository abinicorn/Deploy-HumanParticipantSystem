import { createContext, useState, useEffect} from 'react';
import {request} from "../utils/request";

export const PotentialParticipantContext = createContext();

export function PotentialParticipantProvider({ children }) {

    const [selectedRows, setSelectedRows] = useState([]); // datagrid selected rows
    const [studyParticipants, setStudyParticipants] = useState([]); // participants who are willing to be contact in future
    const [loading, setLoading] = useState(true); // datagrid loading parm

    // Use an effect hook to fetch potential participants data once on component mount
    useEffect(() => {
        
        fetchPotentialParticipants();
        
    }, []);

    // Asynchronous function to fetch potential participants from the server
    async function fetchPotentialParticipants() {

        setLoading(true);
        const response = await request.get(`/participant/to-contact`);
        if (response.status === 204) {
            setStudyParticipants([]);
        } else if (response.status === 200) {
            setStudyParticipants(response.data);
        } else {
            alert("Can not get potential participants list!")
        }
        setLoading(false);
    };

    const contextValue = {
        selectedRows, setSelectedRows,
        studyParticipants, setStudyParticipants,
        loading, setLoading
    };

    return (
        <PotentialParticipantContext.Provider value={contextValue}>
            {children}
        </PotentialParticipantContext.Provider>
    );
}
