import {useState, useEffect, createContext} from 'react';
import { useParams } from 'react-router-dom';
import {request} from "../utils/request";
import axios from "axios";

const CancelToken = axios.CancelToken;
let cancel;


export const StudyParticipantContext = createContext(undefined);

export default function StudyParticipantProvider({children}) {
    const [studyParticipants, setStudyParticipants] = useState([]);
    const [tags, setTags] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [isAnonymous, setIsAnonymous] = useState(false);

  
        // const study_id = "64fef4f7b921a503b17be43c";// 5000 SP
    // // const study_id ='64fed03dd49623d718f09a77' // 0 SP
    // const studyId = "64fef4f7b921a503b17be43c";
    const { studyId } = useParams();

    // const {
    //     data: studyparticipants,
    //     isLoading: studyparticipantsLoading,
    //     refresh: refreshStudyparticipants
    // } = useGet(`http://localhost:3001/study-participants/${studyId}`, [])

    // const {
    //     data: studyParticipants,
    //     isLoading: studyParticipantsLoading,
    //     refresh: refreshStudyParticipants
    // } = useGet(`http://localhost:3001/study-participants/${studyId}`, [])

    useEffect(() => {
        const fetchData = async () => {
            await fetchStudyParticipants();
            await fetchTags();
        };

        fetchData();

        return () => {
            if (cancel) cancel();
        };
    }, [studyId]);

    useEffect(() => {
        console.log("Selected Rows Changed:", selectedRows);
      }, [selectedRows]);

    async function fetchStudyParticipants() {
        try {
            const response = await request.get(`https://participant-system-server-68ca765c5ed2.herokuapp.com/study-participants/${studyId}`, {
                cancelToken: new CancelToken(function executor(c) {
                    cancel = c;
                })
            });
            if (response.status === 204) {
                setStudyParticipants([]);
            } else {
                setStudyParticipants(response.data);
            }
        } catch (error) {
            if (axios.isCancel(error)) {
                console.log("Request canceled");
            } else {
                console.log(error);
            }
        }
    };

    async function fetchTags() {
        const response = await request.get('https://participant-system-server-68ca765c5ed2.herokuapp.com/tag/all');
        setTags(response.data);
    }
    
    async function addParticipants (newParticipants) {
        const participantsResponse = await request.post(`https://participant-system-server-68ca765c5ed2.herokuapp.com/participant/add`, newParticipants)
        return participantsResponse.data;

    }

    async function addStudyParticipants (newStudyParticipants) {
        const response = await request.post(`https://participant-system-server-68ca765c5ed2.herokuapp.com/study-participants/${studyId}`, newStudyParticipants)
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
            const response = await request.put(`https://participant-system-server-68ca765c5ed2.herokuapp.com/study-participants/toggle-property`, updateData);
            if (response.status === 200) {
                console.log("Successfully toggled property for the selected participants.");
                // You can update the local state or refetch the data if needed here.
                fetchStudyParticipants();
            }
        } catch (error) {
            console.error("Error toggling property for the selected participants:", error);
        }
    }

    async function toggleParticipantsProperty(updateData) {
        
        try {
            const response = await request.put(`https://participant-system-server-68ca765c5ed2.herokuapp.com/participant/toggle-property`, updateData);
            if (response.status === 200) {
                console.log("Successfully toggled property for the selected participants.");
                // You can update the local state or refetch the data if needed here.
                fetchStudyParticipants();
            }
        } catch (error) {
            console.error("Error toggling property for the selected participants:", error);
        }
    }
    
    // async function deleteSession (sessionId) {
    //     const response = await axios.delete(`http://localhost:3001/session/${sessionId}`)
    //     refreshSession();
    //     return response
    // }

    async function finalUpdateStudyParticipant (updatedStudyParticipant) {
        const studyParticipantResponse = await updateStudyParticipant(updatedStudyParticipant);
        const participantResponse = await updateParticipant(updatedStudyParticipant.participantInfo);
        // await fetchStudyParticipants();
        return {
            studyParticipant: studyParticipantResponse,
            participant: participantResponse
        };
    }

    async function updateStudyParticipant (updatedStudyParticipant) {
        
        const response = await request.put(`https://participant-system-server-68ca765c5ed2.herokuapp.com/study-participants/${updatedStudyParticipant._id}`, updatedStudyParticipant);
        updateSpecificStudyParticipant(updatedStudyParticipant);
        return response.data;
    }

    async function updateParticipant (updatedParticipant) {
        const validatedParticipant = await validateAndUpdateTags(updatedParticipant);
        console.log(validatedParticipant);
        const response = await request.put(`https://participant-system-server-68ca765c5ed2.herokuapp.com/participant/${validatedParticipant._id}`, validatedParticipant);
        return response.data;
    }

    async function setStudyParticipantNotActive (studyParticipant) {
        studyParticipant.isActive = false;
        const response = await request.put(`https://participant-system-server-68ca765c5ed2.herokuapp.com/study-participants/${studyParticipant._id}`, studyParticipant);
        if (response.status === 204) {
            // Remove the studyParticipant from studyParticipants list
            setStudyParticipants(prevParticipants =>
                prevParticipants.filter(participant => participant._id !== studyParticipant._id)
            );
        }
        return response;
    }

    async function addTags (newTags) {
        const response = await request.post(`https://participant-system-server-68ca765c5ed2.herokuapp.com/tag/add`, newTags);
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
                // 使用 updateSpecificStudyParticipant 方法保存更改
                updateSpecificStudyParticipant(updatedParticipant);
            }
        })

        if (updateIds.length > 0) {
            const updatePayload = {
                updateIds: updateIds,
                tagId: newTagId
            };

            console.log(updatePayload)
            
            const response = await request.put(`https://participant-system-server-68ca765c5ed2.herokuapp.com/participant/update-tag`, updatePayload);
            if (response) {
                console.log(`Added ${newTagName} tag to ${response.data} participants`);
            } else {
                console.log(`Failed to add ${newTagName} tag to selected participants`);
            }
            
        }
    };

    async function handleRemoveTagFromSelectedRows(tagNameToRemove) {

        const removeTagId = tags.find(tag => tag.tagName === tagNameToRemove)?._id || null;
        const deleteIds = [];
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
                
                // 使用 updateSpecificStudyParticipant 方法保存更改
                updateSpecificStudyParticipant(updatedParticipant);
            }
        });

        if (deleteIds.length > 0) {
            const deletePayload = {
                deleteIds: deleteIds,
                tagId: removeTagId
            };

            console.log(deletePayload)
            
            const response = await request.put(`https://participant-system-server-68ca765c5ed2.herokuapp.com/participant/delete-tag`, deletePayload);
            if (response) {
                console.log(`Deleteded ${tagNameToRemove} tag from ${response.data} participants`);
            } else {
                console.log(`Failed to delete ${tagNameToRemove} tag to selected participants`);
            }
            
        }
    }
        

    
    const context = {
        studyParticipants,
        tags,
        // studyParticipantsLoading,
        fetchStudyParticipants,
        addParticipants,
        addStudyParticipants,
        updateStudyParticipant,
        updateSpecificStudyParticipant,
        toggleStudyParticipantsProperty,
        toggleParticipantsProperty,
        finalUpdateStudyParticipant,
        setStudyParticipantNotActive,
        fetchTags,
        handleAddTagToSelectedRows,
        handleRemoveTagFromSelectedRows,
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
