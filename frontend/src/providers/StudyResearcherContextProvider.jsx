import * as React from 'react';
import { useParams } from 'react-router-dom';
import useGet from '../hooks/useGet';
import {request} from "../utils/request";


const StudyResearcherContext = React.createContext({
    researcherList: [],
    studyInfo: {}
});

function StudyResearcherContextProvider({pageItemId, children}) {

    // const {studyId} =useParams();


    // Get studyId from route params
    const { studyId: routeStudyId } = useParams();

    // Determine the studyId to use (pageItemId or routeStudyId)
    const studyIdToUse = pageItemId || routeStudyId;

    const { 
        data: studyInfo,
        isLoadig: studyLoading,
        refresh: refreshStudyContext
    } = useGet(`https://participant-system-server-68ca765c5ed2.herokuapp.com/study/${studyIdToUse}`,[]);

    console.log(studyInfo);

    const{
        data: researcherList,
        isLoadig: researcherLoading,
        refresh: refreshResearcherContext
    } = useGet(`https://participant-system-server-68ca765c5ed2.herokuapp.com/study/researcher/list/${studyIdToUse}`,[]);

    console.log(researcherList);

    React.useEffect(() => {
        refreshStudyContext();
    }, [studyIdToUse]);
    

    //to do
    async function addResearcher (newResearcher) { 
        try{
            const researcherResponse = await request.post(`https://participant-system-server-68ca765c5ed2.herokuapp.com/study/addResearcher/${studyIdToUse}`, newResearcher)
            console.log(researcherResponse);
            refreshResearcherContext();
            return researcherResponse.data;
        } catch (error) {
            alert(error.response.data.message || "Error adding researcher");
        }
    }

    async function removeResearcher (studyId, researcherId) {
        try {
            const response = await request.put(`https://participant-system-server-68ca765c5ed2.herokuapp.com/study/removeResearcher/${studyIdToUse}/${researcherId}`);
            refreshResearcherContext();
            return response.data;
        } catch (error) {
            alert(error.response.data.message || "Error removing researcher)");
        }
        }


    async function fetchResearcherbyEmail (email) {


        
        const response = await request.get(`https://participant-system-server-68ca765c5ed2.herokuapp.com/researcher/email/${email}`);
        return response;
    }

    const context={
        studyInfo,
        studyLoading,
        refreshStudyContext,
        researcherList,
        researcherLoading,
        refreshResearcherContext,
        addResearcher,
        removeResearcher,
        fetchResearcherbyEmail
    }

    return (
        <StudyResearcherContext.Provider value={context}>
            {children}
        </StudyResearcherContext.Provider>
    )
}

export {
    StudyResearcherContext,
    StudyResearcherContextProvider
};
