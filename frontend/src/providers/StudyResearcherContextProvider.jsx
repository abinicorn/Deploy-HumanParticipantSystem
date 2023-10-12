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
    

    //To add a new researcher to the study
    async function addResearcher (newResearcher) { 
        try{
            const researcherResponse = await request.post(`/study/addResearcher/${studyIdToUse}`, newResearcher)
            console.log(researcherResponse);
            refreshResearcherContext();
            refreshStudyDetailContext();
            return researcherResponse.data;
        } catch (error) {
            alert(error.response.data.message || "Error adding researcher");
        }
    }


    //To add existing researchers to the study
    async function addExistingResearcher (studyIdToUse, researcherId) {  
        try{
            const researcherResponse = await request.put(`/study/associateResearcher/${studyIdToUse}/${researcherId}`);
            refreshResearcherContext();
            refreshStudyDetailContext();
            return researcherResponse.data;
        } catch (error) {
            alert(error.response.data.message || "Error adding researcher");
        }
    }


    //To remove a researcher from the study
    async function removeResearcher (studyId, researcherId) {
        try {
            const response = await request.put(`/study/removeResearcher/${studyIdToUse}/${researcherId}`);
            refreshResearcherContext();
            refreshStudyDetailContext();
            return response.data;
        } catch (error) {
            alert(error.response.data.message || "Error removing researcher)");
        }
        }

    //To get researcher by researcher email
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
        addExistingResearcher,
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
