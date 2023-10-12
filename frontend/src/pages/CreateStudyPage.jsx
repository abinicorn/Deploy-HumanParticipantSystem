import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EditStudyTemplate from '../components/Study/EditStudyTemplate';
import { useCurrentUser } from '../hooks/useCurrentUser';
import {request} from "../utils/request";
import Navbar from '../components/Common/Navbar';
import { Container, Typography } from '@mui/material';

export default function CreateStudyPage() {

    const navigate = useNavigate("/");
    const {user}= useCurrentUser();

    const researcherId = user.userId;

    const [studyData, setStudyData] = useState({
        studyCode: '',
        studyName: '',
        description: '',
        creator: researcherId,
        researcherList: [researcherId],
        studyType: '',
        isAnonymous: false,
        anonymousParticipantNum:'',
        participantNum: '',
        recruitmentStartDate: '',
        recruitmentCloseDate: '',
        location: [],
        surveyLink: '',
        driveLink: '',
        isClosed: false,
        isCleared: false
    });

    const handleSubmit = async (event) => {
        event.preventDefault();
        setStudyData({
            ...studyData,
            creator: researcherId
        });
        try {
            const response = await createStudy(studyData);
            alert('Study saved successfully!');
            navigate(`/studyInfo/${response.study._id}`);
        } catch (error) {
            alert(error?.response?.data?.message?? "Error saving study")
            console.log("Error", error);
        }
    };

    const createStudy = async (studyData) => {

        try {
            const response = await request.post(`/study/${researcherId}`, studyData);
            return response.data;
        } catch (error) {
            console.error('Error creating study:', error);
            throw error;
        }
    };

    return (
        <>
        <Navbar/>
            <Container>
                <div style={{ paddingTop: '80px' }}>
                    <Typography variant="h4" component="h1" color="grey" gutterBottom>
                        Study Details
                    </Typography>
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