import {useState, useEffect, createContext} from 'react';
import { useParams } from 'react-router-dom';
import {request} from "../utils/request";

// Create a context for Study Participants
export const StudyParticipantContext = createContext(undefined);

export default function StudyParticipantProvider({children}) {
    // Various states for study participants, tags, and other related data
    const [studyParticipants, setStudyParticipants] = useState([]); // all participants in this study
    const [tags, setTags] = useState([]); // all tags in db
    const [selectedRows, setSelectedRows] = useState([]); // datagrid selected rows
    const [isAnonymous, setIsAnonymous] = useState(false); // is the study anonymous
    const [loading, setLoading] = useState(true); // datagrid loading status
  
    // Extract studyId from the URL params
    const { studyId } = useParams();

    // Fetch study participants and tags when studyId changes
    useEffect(() => {
        
        const fetchData = async () => {
            await fetchStudyParticipants();
            await fetchTags();
        };

        fetchData();
        
    }, [studyId]);

    // Fetch all study participants for a given studyId
    async function fetchStudyParticipants() {

        setLoading(true);
        const response = await request.get(`/study-participants/${studyId}`);
        if (response.status === 204) {
            setStudyParticipants([]);
        } else {
            setStudyParticipants(response.data);
        }
        setLoading(false);
    };

    // Fetch all available tags
    async function fetchTags() {
        const response = await request.get(`/tag/all`);
        setTags(response.data);
    }
    
    // Add new participants to the system
    async function addParticipants (newParticipants) {
        const participantsResponse = await request.post(`/participant/add`, newParticipants)
        return participantsResponse.data;

    }

    // Add new study participants to a specific study
    async function addStudyParticipants (newStudyParticipants) {
        const response = await request.post(`/study-participants/${studyId}`, newStudyParticipants)
        fetchStudyParticipants();
        return response.data;

    }

    // Update a specific study participant within the local state
    function updateSpecificStudyParticipant(updatedParticipant) {
        setStudyParticipants(prevParticipants => {
            return prevParticipants.map(participant => {
                if (participant._id === updatedParticipant._id) {
                    return updatedParticipant;
                }
                return participant;
            });
        });
    }

    // Toggle a boolean property for selected study participants
    async function toggleStudyParticipantsProperty(updateData) {
        try {
            setLoading(true);
            const response = await request.put(`/study-participants/toggle-property`, updateData);
            if (response.status === 200) {
                console.log("Successfully toggled property for the selected participants.");
    
                setStudyParticipants(prevParticipants => {
                    if(updateData.propertyName === 'isActive') {
                        // if propertyName is 'isActive'，filter IDs that existing in updateData.ids
                        return prevParticipants.filter(participant => !updateData.ids.includes(participant._id));
                    } else {
                        // if propertyName is 'isActive'，update property with IDs in updateData.ids 
                        return prevParticipants.map(participant => 
                            updateData.ids.includes(participant._id) 
                                ? { ...participant, [updateData.propertyName]: !participant[updateData.propertyName] } 
                                : participant
                        );
                    }
                });
            } else {
                alert("Error toggling property for the selected participants.");
            }
        } catch (error) {
            alert("Error toggling property for the selected participants:", error);
        } finally {
            setLoading(false);
        }
    }
    
    // Toggle a boolean property for participants (not study-specific)
    async function toggleParticipantsProperty(updateData) {
        try {
            setLoading(true);
            const response = await request.put(`/participant/toggle-property`, updateData);
            if (response.status === 200) {
                console.log("Successfully toggled property for the selected participants.");
    
                setStudyParticipants(prevParticipants => 
                    prevParticipants.map(participant => 
                        updateData.ids.includes(participant.participantInfo._id) 
                            ? { 
                                ...participant, 
                                participantInfo: { 
                                    ...participant.participantInfo, 
                                    [updateData.propertyName]: !participant.participantInfo[updateData.propertyName] 
                                } 
                            } 
                            : participant
                    )
                );
            } else {
                alert("Error toggling property for the selected participants.");
            }
        } catch (error) {
            alert("Error toggling property for the selected participants:", error);
        } finally {
            setLoading(false);
        }
    }

    // Handle final update for a study participant
    async function finalUpdateStudyParticipant(updatedStudyParticipant) {
        try {
            setLoading(true);
            await updateStudyParticipant(updatedStudyParticipant);
            await updateParticipant(updatedStudyParticipant.participantInfo);
            updateSpecificStudyParticipant(updatedStudyParticipant);
            return true;
        } catch (error) {
            if (error.response && error.response.status === 400) {
                alert("The email is already existing!");
            } else {
                alert("An error occurred while updating the participant.");
            }
            return false;
        } finally {
            setLoading(false);
        }
    }
    
    // Update the sent status for a study participant
    async function updateSentStatus (updatedStudyParticipant) {
        const response = await updateStudyParticipant(updatedStudyParticipant);
        console.log(response)
        if (response.status === 204) {
            updateSpecificStudyParticipant(updatedStudyParticipant)
        }
    }

    // Update details of a specific study participant
    async function updateStudyParticipant (updatedStudyParticipant) {
        
        const response = await request.put(`/study-participants/${updatedStudyParticipant._id}`, updatedStudyParticipant);
        return response;
    }

    // Update details of a participant
    async function updateParticipant (updatedParticipant) {
        const validatedParticipant = await validateAndUpdateTags(updatedParticipant);
        console.log(validatedParticipant);
        const response = await request.put(`/participant/${validatedParticipant._id}`, validatedParticipant);
        return response.data;
    }

    // Set a study participant's active status to false
    async function setStudyParticipantNotActive (studyParticipant) {
        setLoading(true);
        studyParticipant.isActive = false;
        const response = await request.put(`/study-participants/${studyParticipant._id}`, studyParticipant);
        if (response.status === 204) {
            // Remove the studyParticipant from studyParticipants list
            setStudyParticipants(prevParticipants =>
                prevParticipants.filter(participant => participant._id !== studyParticipant._id)
            );
        }
        setLoading(false);
        return response;
    }

    // Add new tags to the system
    async function addTags (newTags) {
        console.log(newTags)
        const response = await request.post(`/tag/add`, newTags);
        return response.data.success;
    }

    // Validate the tags of a participant and update as necessary
    async function validateAndUpdateTags(participant) {
        const validTags = tags.map(tag => tag.tagName);
        const tagsToAdd = [];
        let addedTags = [];

        for (let tag of participant.tagsInfo) {
            if (!validTags.includes(tag)) {
                tagsToAdd.push({ tagName: tag });
            }
        }

        if (tagsToAdd.length > 0) {
            addedTags = await addTags({ tags: tagsToAdd });
            // update added tags to tags state
            setTags(prevTags => [...prevTags, ...addedTags]);
        }

        // Combine existing tags and newly added tags for mapping
        const combinedTags = [...tags, ...addedTags];

        // Now, update the tagsId with the new list of tags
        participant.tag = participant.tagsInfo.map(tagName => {
            return combinedTags.find(tag => tag.tagName === tagName)._id;
        });
        
        return participant;
    }

    // Add a specific tag to selected participants
    async function handleAddTagToSelectedRows (newTagName) {
        setLoading(true);
        // Check if the new tag already exists in tags
        const tagExists = tags.some(tag => tag.tagName === newTagName);
        let newTagId = null;
        if (!tagExists) {
            // If the new tag does not exist, it is added to tags
            await addTags({ tags: [{tagName: newTagName}] }).then(addedTags => {
                // Update tags status
                setTags(prevTags => [...prevTags, ...addedTags]);
                // Get the _id of the new tag
                newTagId = addedTags[0]?._id || null;
            });
        } else {
            // Get the _id of the new tag
            newTagId = tags.find(tag => tag.tagName === newTagName)?._id || null;
        }
    
        const updateIds = [];
        const updatedParticipants = [];

        // Iterate through all selected participants
        studyParticipants.filter(participant => selectedRows.includes(participant._id))
        .forEach(participant => {
            // Check if the new tag already exists in tagsInfo
            if (!participant.participantInfo.tagsInfo.includes(newTagName)) {

                updateIds.push(participant.participantInfo._id);

                // If not present, update tagsInfo and tag
                const updatedParticipant = {
                    ...participant,
                    participantInfo: {
                        ...participant.participantInfo,
                        tagsInfo: [...participant.participantInfo.tagsInfo, newTagName],
                        tag: [...participant.participantInfo.tag, newTagId]
                    }
                };
                // store updatedParticipant
                updatedParticipants.push(updatedParticipant);
            }
        })

        if (updateIds.length > 0) {
            const updatePayload = {
                updateIds: updateIds,
                tagId: newTagId
            };

            try {
                const response = await request.put(`/participant/update-tag`, updatePayload);
                console.log(response)
                if (response) {
                    console.log(`Added '${newTagName}' tag to ${response.data.message}`);
                    // success, update all local studyparticipants
                    updatedParticipants.forEach(participant => {
                        updateSpecificStudyParticipant(participant);
                    });
                } else {
                    alert(`Failed to add '${newTagName}' tag to selected participants`);
                }
            } catch {
                alert(`Failed to add '${newTagName}' tag to selected participants`)
            }
        }
        setLoading(false);
    };

    // Remove a specific tag from selected participants
    async function handleRemoveTagFromSelectedRows(tagNameToRemove) {

        setLoading(true);
        const removeTagId = tags.find(tag => tag.tagName === tagNameToRemove)?._id || null;
        const deleteIds = [];
        const updatedParticipants = [];
        // Iterate through all selected participants
        studyParticipants.filter(participant => selectedRows.includes(participant._id))
        .forEach(participant => {
            // Check if the tag to be deleted exists in tagsInfo
            if (participant.participantInfo.tagsInfo.includes(tagNameToRemove)) {

                deleteIds.push(participant.participantInfo._id);

                // If present, remove from tagsInfo and tag
                const updatedTagsInfo = participant.participantInfo.tagsInfo.filter(tagName => tagName !== tagNameToRemove);
                const updatedTag = participant.participantInfo.tag.filter(tagId => tagId !== removeTagId);
                
                const updatedParticipant = {
                    ...participant,
                    participantInfo: {
                        ...participant.participantInfo,
                        tagsInfo: updatedTagsInfo,
                        tag: updatedTag
                    }
                };
                
                // store updatedParticipant
                updatedParticipants.push(updatedParticipant);
            }
        });

        if (deleteIds.length > 0) {
            const deletePayload = {
                deleteIds: deleteIds,
                tagId: removeTagId
            };

            try {
                const response = await request.put(`/participant/delete-tag`, deletePayload);
                if (response && response.status === 200) {
                    console.log(`Deleted '${tagNameToRemove}' tag from ${response.data.message}`);
                    // success, update all local studyparticipants
                    updatedParticipants.forEach(participant => {
                        updateSpecificStudyParticipant(participant);
                    });
                } else {
                    alert(`Failed to delete '${tagNameToRemove}' tag to selected participants`);
                }
            } catch (error) {
                alert(`Failed to delete '${tagNameToRemove}' tag to selected participants`);
            }
            
        }
        setLoading(false);
    }
        
    const context = {
        studyParticipants,
        tags,
        // studyParticipantsLoading,
        fetchStudyParticipants,
        addParticipants,
        addStudyParticipants,
        updateStudyParticipant,
        updateSentStatus,
        updateSpecificStudyParticipant,
        toggleStudyParticipantsProperty,
        toggleParticipantsProperty,
        finalUpdateStudyParticipant,
        setStudyParticipantNotActive,
        fetchTags,
        handleAddTagToSelectedRows,
        handleRemoveTagFromSelectedRows,
        loading, setLoading,
        selectedRows, 
        setSelectedRows,
        isAnonymous, 
        setIsAnonymous
        // refreshStudyParticipants
    }

    return (
        <StudyParticipantContext.Provider value={context}>
            {children}
        </StudyParticipantContext.Provider>
    )

}
