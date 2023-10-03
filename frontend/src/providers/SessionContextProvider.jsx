import * as React from 'react';
import useGet from '../hooks/useGet';
import { useParams } from 'react-router-dom';
import {request} from "../utils/request";


export const SessionContext = React.createContext(undefined);

export default function SessionContextProvider({children}) {
  
    const { studyId } = useParams();
    const {
        data: sessions,
        isLoading: sessionLoading,
        refresh: refreshSession
    } = useGet(`/session/list/${studyId}`, [])

    const { data: studyParticipantInfo } = useGet(`/study-participants/${studyId}`, []);
    
    async function addSession (newSession) {
        const sessionResponse = await request.post(`/session/${studyId}`, newSession)
        refreshSession();
        return sessionResponse.data
    }

    async function updateSession (updateData) {
        
        const sessionId = updateData._id
        const response = await request.put(`/session/${sessionId}`, updateData)
        console.log(response)
        refreshSession();
        return response.data
    }

    const context = {
        studyId,
        sessions,
        sessionLoading,
        studyParticipantInfo,
        addSession,
        updateSession,
        refreshSession
    }

    return (
        <SessionContext.Provider value={context}>
            {children}
        </SessionContext.Provider>
    )

}
