import * as React from 'react';
import { useParams } from 'react-router-dom';
import useGet from '../hooks/useGet';
import {request} from "../utils/request";


const StudyResearcherContext = React.createContext({
    researcherList: [],
    studyInfo: {},
    studyDetailInfo: {}
});

function StudyResearcherContextProvider({pageItemId, children}) {

    // const {studyId} =useParams();


    // Get studyId from route params
    const { studyId: routeStudyId } = useParams();

    // Determine the studyId to use (pageItemId or routeStudyId)
    const studyIdToUse = pageItemId || routeStudyId;

    const { 
        data: studyInfo,
        isLoading: studyLoading,
        refresh: refreshStudyContext
    } = useGet(`/study/${studyIdToUse}`,[]);

    const{
        data: researcherList,
        isLoading: researcherLoading,
        refresh: refreshResearcherContext
    } = useGet(`/study/researcher/list/${studyIdToUse}`,[]);

    const {
        data: allResearchers,
        isLoading: allResearchersLoading,
        refresh: refreshAllResearchersContext
    } = useGet(`/researcher/allResearchers`,[]);

    const {
        data: studyDetailInfo,
        isLoading: studyDetailInfoLoading,
        refresh: refreshStudyDetailContext
    } = useGet(`/study/studyReport/${studyIdToUse}`, [])
    


    React.useEffect(() => {
        refreshStudyContext();
        refreshStudyDetailContext();
    }, [studyIdToUse]);
    

    //to do
    async function addResearcher (newResearcher) { 
        try{
            const researcherResponse = await request.post(`/study/addResearcher/${studyIdToUse}`, newResearcher)
            console.log(researcherResponse);
            refreshResearcherContext();
            return researcherResponse.data;
        } catch (error) {
            alert(error.response.data.message || "Error adding researcher");
        }
    }

    async function removeResearcher (studyId, researcherId) {
        try {
            const response = await request.put(`/study/removeResearcher/${studyIdToUse}/${researcherId}`);
            refreshResearcherContext();
            return response.data;
        } catch (error) {
            alert(error.response.data.message || "Error removing researcher)");
        }
        }


    async function fetchResearcherbyEmail (email) {
        const response = await request.get(`/researcher/email/${email}`);
        return response;
    }

    const context={
        studyInfo,
        studyLoading,
        refreshStudyContext,
        researcherList,
        researcherLoading,
        refreshResearcherContext,
        allResearchers,
        allResearchersLoading,
        refreshAllResearchersContext,
        addResearcher,
        removeResearcher,
        fetchResearcherbyEmail,
        studyDetailInfo,
        studyDetailInfoLoading,
        refreshStudyDetailContext,
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
