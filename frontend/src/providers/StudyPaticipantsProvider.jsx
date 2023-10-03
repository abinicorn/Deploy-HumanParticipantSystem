import {useState, useEffect, createContext} from 'react';
import { useParams } from 'react-router-dom';
import {request} from "../utils/request";

export const StudyParticipantContext = createContext(undefined);

export default function StudyParticipantProvider({children}) {
    const [studyParticipants, setStudyParticipants] = useState([]);
    const [tags, setTags] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [loading, setLoading] = useState(true);
  
        // const study_id = "64fef4f7b921a503b17be43c";// 5000 SP
    // // const study_id ='64fed03dd49623d718f09a77' // 0 SP
    // const studyId = "64fef4f7b921a503b17be43c";
    const { studyId } = useParams();

    // const {
    //     data: studyparticipants,
    //     isLoading: studyparticipantsLoading,
    //     refresh: refreshStudyparticipants
    // } = useGet(`/study-participants/${studyId}`, [])

    // const {
    //     data: studyParticipants,
    //     isLoading: studyParticipantsLoading,
    //     refresh: refreshStudyParticipants
    // } = useGet(`/study-participants/${studyId}`, [])

    useEffect(() => {
        
        const fetchData = async () => {
            await fetchStudyParticipants();
            await fetchTags();
        };

        fetchData();
        
    }, [studyId]);

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

    async function fetchTags() {
        const response = await request.get(`/tag/all`);
        setTags(response.data);
    }
    
    async function addParticipants (newParticipants) {
        const participantsResponse = await request.post(`/participant/add`, newParticipants)
        return participantsResponse.data;

    }

    async function addStudyParticipants (newStudyParticipants) {
        const response = await request.post(`/study-participants/${studyId}`, newStudyParticipants)
        fetchStudyParticipants();
        return response.data;

    }

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
    
    
    // async function toggleStudyParticipantsProperty(updateData) {
        
    //     try {
    //         const response = await request.put(`/study-participants/toggle-property`, updateData);
    //         if (response.status === 200) {
    //             console.log("Successfully toggled property for the selected participants.");
    //             // You can update the local state or refetch the data if needed here.
    //             fetchStudyParticipants();
    //         }
    //     } catch (error) {
    //         console.error("Error toggling property for the selected participants:", error);
    //     }
    // }

    // async function toggleParticipantsProperty(updateData) {
        
    //     try {
    //         const response = await request.put(`/participant/toggle-property`, updateData);
    //         if (response.status === 200) {
    //             console.log("Successfully toggled property for the selected participants.");
    //             // You can update the local state or refetch the data if needed here.
    //             fetchStudyParticipants();
    //         }
    //     } catch (error) {
    //         console.error("Error toggling property for the selected participants:", error);
    //     }
    // }
    
    // async function deleteSession (sessionId) {
    //     const response = await axios.delete(`/session/${sessionId}`)
    //     refreshSession();
    //     return response
    // }

    async function finalUpdateStudyParticipant(updatedStudyParticipant) {
        try {
            setLoading(true);
            const studyParticipantResponse = await updateStudyParticipant(updatedStudyParticipant);
            const participantResponse = await updateParticipant(updatedStudyParticipant.participantInfo);
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
    
    async function updateSentStatus (updatedStudyParticipant) {
        const response = await updateStudyParticipant(updatedStudyParticipant);
        console.log(response)
        if (response.status === 204) {
            updateSpecificStudyParticipant(updatedStudyParticipant)
        }
    }

    async function updateStudyParticipant (updatedStudyParticipant) {
        
        const response = await request.put(`/study-participants/${updatedStudyParticipant._id}`, updatedStudyParticipant);
        return response;
    }

    async function updateParticipant (updatedParticipant) {
        const validatedParticipant = await validateAndUpdateTags(updatedParticipant);
        console.log(validatedParticipant);
        const response = await request.put(`/participant/${validatedParticipant._id}`, validatedParticipant);
        return response.data;
    }

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

    async function addTags (newTags) {
        console.log(newTags)
        const response = await request.post(`/tag/add`, newTags);
        return response.data.success;
    }

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

    async function handleAddTagToSelectedRows (newTagName) {
        setLoading(true);
        // 检查新标签是否已存在于 tags 中
        const tagExists = tags.some(tag => tag.tagName === newTagName);
        let newTagId = null;
        if (!tagExists) {
            // 如果新标签不存在，则添加到 tags 中
            await addTags({ tags: [{tagName: newTagName}] }).then(addedTags => {
                // 更新 tags 状态
                setTags(prevTags => [...prevTags, ...addedTags]);
                // 获取新标签的 _id
                newTagId = addedTags[0]?._id || null;
            });
        } else {
            // 获取新标签的 _id
            newTagId = tags.find(tag => tag.tagName === newTagName)?._id || null;
        }
    
        const updateIds = [];
        const updatedParticipants = [];

        // 遍历所有选中的参与者
        studyParticipants.filter(participant => selectedRows.includes(participant._id))
        .forEach(participant => {
            // 检查新标签是否已存在于 tagsInfo 中
            if (!participant.participantInfo.tagsInfo.includes(newTagName)) {

                updateIds.push(participant.participantInfo._id);

                // 如果不存在，则更新 tagsInfo 和 tag
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

    async function handleRemoveTagFromSelectedRows(tagNameToRemove) {

        setLoading(true);
        const removeTagId = tags.find(tag => tag.tagName === tagNameToRemove)?._id || null;
        const deleteIds = [];
        const updatedParticipants = [];
        // 遍历所有选中的参与者
        studyParticipants.filter(participant => selectedRows.includes(participant._id))
        .forEach(participant => {
            // 检查要删除的标签是否存在于 tagsInfo 中
            if (participant.participantInfo.tagsInfo.includes(tagNameToRemove)) {

                deleteIds.push(participant.participantInfo._id);

                // 如果存在，则从 tagsInfo 和 tag 中移除
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
