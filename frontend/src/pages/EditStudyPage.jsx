import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useGet from '../hooks/useGet';
import EditStudyTemplate from '../components/Study/EditStudyTemplate';
import {request} from "../utils/request";
import ResearcherManagePopup from '../components/Researcher/ResearcherManagePopup';
import { Container, Typography } from '@mui/material';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { StudyResearcherContext } from '../providers/StudyResearcherContextProvider';


export default function EditStudyPage() {
    const { studyId } = useParams();
    
    const navigate = useNavigate("/");

    const {user}= useCurrentUser();

    const {refreshStudyDetailContext} = React.useContext(StudyResearcherContext);

    const { data, isLoading, refresh } = useGet(`/study/${studyId}`, []);
    const [studyData, setStudyData] = useState({
        studyCode: '',
        studyName: '',
        description: '',
        creator: '',
        researcherList: [],
        studyType: '',
        isAnonymous: '',
        anonymousParticipantNum:'',
        participantNum: '',
        recruitmentStartDate: '',
        recruitmentCloseDate: '',
        location: [],
        surveyLink: '',
        driveLink: ''
    });
    useEffect(() => {
        setStudyData({
            ...studyData,
            studyCode: data.studyCode ?? "",
            studyName: data.studyName ?? "",
            description: data.description ?? "",
            creator: data.creator,
            researcherList: data.researcherList,
            studyType: data.studyType ?? "",
            isAnonymous: data.isAnonymous ?? "",
            anonymousParticipantNum: (data.isAnonymous && data.anonymousParticipantNum) ?? "",
            participantNum: data.participantNum ?? "",
            recruitmentStartDate: data.recruitmentStartDate?.split("T")[0] ?? "",
            recruitmentCloseDate: data.recruitmentCloseDate?.split("T")[0] ?? "",
            location: data.location ?? [],
            surveyLink: data.surveyLink ?? "",
            driveLink: data.driveLink ?? ""
        })
    }, [data])


    const handleSubmit = (event) => {
        event.preventDefault();
        editStudy(studyData)
            .then((res) => {
                alert("Successfully edited study");
                refreshStudyDetailContext();
                refresh();

            })
        
    };

    const editStudy = async (studyData) => {
        try {
            const response = await request.put(`/study/${studyId}`, studyData);
            return response.data;
        } catch (error) {
            alert(`Error editing study`);
            throw error;
        }
    }

    return (
        isLoading ? <div>Loading...</div> :

        <>
            <Container>
                <div style={{ paddingTop: '40px' }}>
                    <Typography variant="h4" component="h1" color="grey" gutterBottom>
                        Study Details
                    </Typography>
                    {studyData.creator === user.userId ? 
                        (<div className='align-right'>
                            <ResearcherManagePopup />
                        </div>) : null}

                </div>
                <EditStudyTemplate
                    isEditMode={false}
                    studyData={studyData}
                    setStudyData={setStudyData}
                    handleSubmit={handleSubmit}
                />
            </Container>
        </>
    );


}