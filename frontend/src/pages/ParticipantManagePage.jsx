import React, { useEffect, useContext } from 'react';
import {Box} from '@mui/material';
import AddParticipant from '../components/Participant/AddParticipant';
import StudyParticipantActionBtn from '../components/Button/StudyParticipantActionBtn';
import ParticipantsTable from '../components/Participant/StudyParticipantTable';
import EmailInputComponent from '../components/DataGrid/EmailInputComponent';

import { StudyParticipantContext } from '../providers/StudyPaticipantsProvider';
import { DataGridContext } from '../providers/DataGridProvider';
import { StudyResearcherContext } from '../providers/StudyResearcherContextProvider';

export default function ParticipantManagePage() {
    const { studyInfo } = useContext(StudyResearcherContext);
    const {isAnonymous, setIsAnonymous, selectedRows, setSelectedRows, studyParticipants} = useContext(StudyParticipantContext);
    const {inputEmails, setInputEmails} = useContext(DataGridContext);


    useEffect(() => {
        setIsAnonymous(studyInfo.isAnonymous);
    }, [studyInfo.isAnonymous]);
    

    return (
        <div style={{maxWidth: '100vw'}}>
                <Box component="main" marginLeft={5} marginRight={10}>
                    
                    <Box sx={{display:'flex', justifyContent: "space-between", flexDirection: 'row', alignItems: 'center' }}>
                        <h1 style={{ marginTop: '10px', marginBottom: '10px' }}>Participants Management</h1>
                        <Box sx={{display:'flex', flexDirection: 'row'}}>
                            <Box marginRight={8}>
                                <AddParticipant/>
                            </Box>
                                <StudyParticipantActionBtn context={StudyParticipantContext} selectedRows={selectedRows}/>
                        </Box>
                    </Box>
                    <h1>{studyInfo.studyName} (Study Code: {studyInfo.studyCode})</h1>
                    {isAnonymous && <h2>Anonymous Participants Number: {studyInfo.anonymousParticipantNum}</h2>}
                </Box>
                <Box marginLeft={5} marginRight={5} marginBottom={10} sx={{height: '65vh'}}>
                        <EmailInputComponent 
                            rows={studyParticipants}
                            setSelectedRows={setSelectedRows}
                            inputEmails={inputEmails}
                            setInputEmails={setInputEmails}
                        />
                        <ParticipantsTable/> 
                </Box>
        </div>
    )
}
