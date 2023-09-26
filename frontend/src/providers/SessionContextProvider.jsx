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
    } = useGet(`http://test-2-backend-env.eba-p2c8ucse.ap-southeast-2.elasticbeanstalk.com/session/list/${studyId}`, [])

    const { data: studyParticipantInfo } = useGet(`http://test-2-backend-env.eba-p2c8ucse.ap-southeast-2.elasticbeanstalk.com/study-participants/${studyId}`, []);
    
    async function addSession (newSession) {
        const sessionResponse = await request.post(`http://test-2-backend-env.eba-p2c8ucse.ap-southeast-2.elasticbeanstalk.com/session/${studyId}`, newSession)
        refreshSession();
        return sessionResponse.data
    }

    async function updateSession (updateData) {
        
        const sessionId = updateData._id
        const response = await request.put(`http://test-2-backend-env.eba-p2c8ucse.ap-southeast-2.elasticbeanstalk.com/session/${sessionId}`, updateData)
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
