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
    } = useGet(`http://test-2-backend-env.eba-p2c8ucse.ap-southeast-2.elasticbeanstalk.com/study/${studyIdToUse}`,[]);

    console.log(studyInfo);

    const{
        data: researcherList,
        isLoadig: researcherLoading,
        refresh: refreshResearcherContext
    } = useGet(`http://test-2-backend-env.eba-p2c8ucse.ap-southeast-2.elasticbeanstalk.com/study/researcher/list/${studyIdToUse}`,[]);

    console.log(researcherList);

    React.useEffect(() => {
        refreshStudyContext();
    }, [studyIdToUse]);
    

    //to do
    async function addResearcher (newResearcher) { 
        try{
            const researcherResponse = await request.post(`http://test-2-backend-env.eba-p2c8ucse.ap-southeast-2.elasticbeanstalk.com/study/addResearcher/${studyIdToUse}`, newResearcher)
            console.log(researcherResponse);
            refreshResearcherContext();
            return researcherResponse.data;
        } catch (error) {
            alert(error.response.data.message || "Error adding researcher");
        }
    }

    async function removeResearcher (studyId, researcherId) {
        try {
            const response = await request.put(`http://test-2-backend-env.eba-p2c8ucse.ap-southeast-2.elasticbeanstalk.com/study/removeResearcher/${studyIdToUse}/${researcherId}`);
            refreshResearcherContext();
            return response.data;
        } catch (error) {
            alert(error.response.data.message || "Error removing researcher)");
        }
        }


    async function fetchResearcherbyEmail (email) {


        
        const response = await request.get(`http://test-2-backend-env.eba-p2c8ucse.ap-southeast-2.elasticbeanstalk.com/researcher/email/${email}`);
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
