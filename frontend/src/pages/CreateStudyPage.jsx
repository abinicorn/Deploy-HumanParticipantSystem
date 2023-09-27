import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EditStudyTemplate from '../components/Study/EditStudyTemplate';
import { useCurrentUser } from '../hooks/useCurrentUser';
import {request} from "../utils/request";
import Navbar from '../components/Navbar';

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
        participantNum: '',
        recruitmentStartDate: '',
        recruitmentCloseDate: '',
        location: [],
        surveyLink: '',
        driveLink: ''
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
            navigate('/homepage');
        } catch (error) {
            alert(error?.response?.data?.message?? "Error saving study")
            console.log("Error", error);
        }
    };

    const createStudy = async (studyData) => {

        try {
            const response = await request.post(`https://participant-system-server-68ca765c5ed2.herokuapp.com/study/${researcherId}`, studyData);
            return response.data;
        } catch (error) {
            console.error('Error creating study:', error);
            throw error;
        }
    };

    return (
        <>
        <Navbar/>
        <EditStudyTemplate
            isEditMode={false}
            studyData={studyData}
            setStudyData={setStudyData}
            handleSubmit={handleSubmit}
        />
        </>
    );


}