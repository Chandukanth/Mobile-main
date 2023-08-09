import { FontAwesome } from '@expo/vector-icons';
import { useIsFocused, useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import DatePicker from "../../components/DatePicker";
import Layout from "../../components/Layout";
import NoRecordFound from "../../components/NoRecordFound";
import StatusSelect from "../../components/StatusSelect";
import Tab from "../../components/Tab";
import TextArea from "../../components/TextArea";
import UserSelect from "../../components/UserSelect";
import VerticalSpace10 from "../../components/VerticleSpace10";
import { Color } from "../../helper/Color";
import ObjectName from "../../helper/ObjectName";
import TabName from '../../helper/Tab';
import TicketCommentService from "../../services/TicketCommentService";
import ticketService from "../../services/TicketServices";
import CommentModal from "./commentModal";
import DateTime from '../../lib/DateTime';
import asyncStorageService from '../../services/AsyncStorageService';
import UserCard from '../../components/UserCard';
import MediaList from "../../components/MediaList";
import mediaService from '../../services/MediaService';
import Media from '../../helper/Media';


const TicketDetail = (props) => {
    const params = props.route.params.item;
    const param = props?.route?.params

    const [selectedUser, setSelectedUser] = useState(params?.assignee_id || "");
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [summary, setSummary] = useState(params?.summary || "");
    const [status, setStatus] = useState(params?.statusId || "");
    const [activeTab, setActiveTab] = useState(TabName.GENERAL);
    const [commentModal, setCommentModal] = useState(false)
    const [comments, setComments] = useState([])
    const [message, setMessage] = useState("")
    const [messageId, setMessageId] = useState("")
    const [userId, setUserId] = useState("")
    const [MediaData, setMediaData] = useState([]);

    const isFocused = useIsFocused();

    const navigation = useNavigation();

    const {
        control,
        reset,
        handleSubmit,
        formState: { errors },
    } = useForm({});

    useEffect(() => {
        updateDateValues();
        getComment()
        getMediaList()
    }, [params]);

    const updateDateValues = () => {
        let date = params?.eta;
        if (date) {
            setSelectedDate(new Date(date));
        }
    };

    const onDateSelect = (value) => {
        setSelectedDate(new Date(value));
    };

    const onSummaryChange = (value) => {
        setSummary(value);
    };

    const handleStatusOnChange = (value) => {
        setStatus(value.value)
    }

    const getComment = async () => {
        const userId = await asyncStorageService.getUserId()
        setUserId(userId)
        let param = {
            objectId: params?.id
        }
        await TicketCommentService.search(param, (response) => {
            if (response) {
                setComments(response.data.data);
            }
        })
    }

    const deleteComment = async (id, comment_id) => {
        await TicketCommentService.delete(id, comment_id, (error, response) => {
            getComment()
            setMessageId("")
            reset({})

        })
    }

    const addComment = async (values) => {
        let data = {
            comment: values.comment
        }

        if (messageId) {
            await TicketCommentService.update(messageId, data, (response) => {
                if (response) {
                    commentToggle()
                    getComment()
                    setMessageId("")
                    reset({})
                }
            })
        }
        else {
            await TicketCommentService.create(params?.id, data, (error, response) => {
                if (response && response.data) {
                    commentToggle()
                    getComment()
                    setMessageId("")
                    reset({})

                }
            })
        }

    }

    const commentToggle = () => {
        setCommentModal(false);
        setMessage("")
        setMessageId("")
        reset({})


    }

    const UpdatedTicket = (values) => {
        let updateData = {
            assignee: selectedUser.value,
            eta: selectedDate,
            summary: summary,
            status: status,
        };

        ticketService.update(params?.id, updateData, (err, response) => {
            if (response) {
                navigation.navigate("Ticket");
            }
        });
    };
    const takePicture = async (e) => {
        const image = await Media.getImage();
        if (image && image.assets) {
            const response = await fetch(image.assets[0].uri);
            const blob = await response.blob();
            await Media.uploadImage(params?.id ? params?.id : param?.id, blob, image.assets[0].uri, ObjectName.TICKET, null, null, async (response) => {
                if (response) {
                    getMediaList();
                }
            })
        }
    };


    const getMediaList = async () => {
        await mediaService.search(params?.id, ObjectName.TICKET, (callback) => setMediaData(callback.data.data))
    }

    return (
        <Layout
            title={`Ticket#: ${params?.id}`}
            buttonLabel={activeTab === TabName.COMMENT ? "Add" : activeTab === TabName.ATTACHMENTS && "Upload"}
            buttonOnPress={()=>{
                activeTab === TabName.COMMENT ?setCommentModal(true): activeTab === TabName.ATTACHMENTS &&  takePicture() 
            }}
            showBackIcon={true}
            FooterContent={
                activeTab === TabName.GENERAL &&
                <Button
                    title={"Update"}
                    color={Color.DONE_BUTTON}
                    onPress={handleSubmit((values) => UpdatedTicket(values))}
                />
            }
        >
            <View style={styles.tabBar}>
                <Tab
                    title={TabName.GENERAL}
                    isActive={activeTab === TabName.GENERAL}
                    onPress={() => setActiveTab(TabName.GENERAL)}
                />
                <Tab
                    title={TabName.COMMENT}
                    isActive={activeTab === TabName.COMMENT}
                    onPress={() => setActiveTab(TabName.COMMENT)}
                />
                  <Tab
                    title={TabName.ATTACHMENTS}
                    isActive={activeTab === TabName.ATTACHMENTS}
                    onPress={() => setActiveTab(TabName.ATTACHMENTS)}
                />
            </View>
            {activeTab === TabName.GENERAL && (
                <>
                <ScrollView>
                    <VerticalSpace10  />
                    <StatusSelect
                        label={"Status"}
                        name="status"
                        onChange={handleStatusOnChange}
                        control={control}
                        object={ObjectName.TICKET}
                        showBorder={true}
                        placeholder={"Select Status"}
                        data={params.statusId ? params.statusId : status}
                        currentStatusId={params.statusId}
                        projectId={params?.projectId}
                    />
                    <VerticalSpace10  />


                    <TextArea
                        name="summary"
                        title="Summary"
                        control={control}
                        showBorder={true}
                        values={summary}
                        required={summary ? false : true}
                        onInputChange={onSummaryChange}
                    />

                    <VerticalSpace10  />

                    <UserSelect
                        label="Assignee"
                        name="assignee"
                        onChange={(values) => setSelectedUser(values)}
                        required
                        control={control}
                        showBorder={true}
                        placeholder="Select Assignee"
                        selectedUserId={selectedUser}
                    />

                    <VerticalSpace10  />

                    <DatePicker
                        title="ETA"
                        onDateSelect={onDateSelect}
                        selectedDate={selectedDate}
                        showTime={true}
                    />
                    </ScrollView>
                </>
            )}

            {activeTab === TabName.COMMENT && (
                <>
                    <ScrollView>
                        {comments && comments.length > 0 ? comments.map((comment, index) => {
                            return (
                                <View style={styles.card} key={index}>
                                    <View style={styles.commentUserInfo}>
                                        <UserCard
                                            firstName={comment.first_name}
                                            lastName={comment.last_name}
                                            showFullName={false}
                                            image={comment.media_url}
                                        />
                                        <Text style={styles.userName}>

                                            {comment.first_name} {comment.last_name} &nbsp;
                                            <Text style={{ color: Color.ACTIVE }}>updated {DateTime.TimeNow(comment.timestamp)}</Text>
                                        </Text>
                                    </View>
                                    <View style={{ flexDirection: 'row' }}>
                                        <View style={styles.commentMessageContainer}>
                                            <Text style={styles.commentMessage}>{comment.comment}</Text>
                                        </View>
                                        {comment.userId == userId && (

                                            <View style={styles.commentActionsContainer}>
                                                <TouchableOpacity
                                                    style={styles.commentActionIconContainer}
                                                    onPress={() => {
                                                        setMessageId(comment.id)
                                                        setMessage(comment.comment)
                                                        setCommentModal(true)
                                                    }}
                                                >
                                                    <FontAwesome name="edit" size={20} color="black" />
                                                </TouchableOpacity>

                                                <TouchableOpacity
                                                    style={styles.commentActionIconContainer}
                                                    onPress={() => {
                                                        deleteComment(params?.id, comment.id)
                                                    }}
                                                >
                                                    <FontAwesome name="trash" size={20} color="black" />
                                                </TouchableOpacity>
                                            </View>
                                        )}

                                    </View>
                                </View>
                            );
                        }) : <NoRecordFound iconName="receipt" />
                        }
                        <CommentModal
                            toggle={commentToggle}
                            modalVisible={commentModal}
                            title={"Add Comment"}
                            confirmLabel={"Add"}
                            cancelLabel={"Cancel"}
                            ConfirmationAction={handleSubmit((values) => addComment(values))}
                            control={control}
                            values={message}
                            onChange={(value) => setMessage(value)}
                        />
                    </ScrollView>

                </>
            )}
            {activeTab === TabName.ATTACHMENTS && (
                        <MediaList
                            mediaData={MediaData}
                            getMediaList={getMediaList}
                        />
                    )}
        </Layout>
    );
};

export default TicketDetail;
const styles = StyleSheet.create({
    tabBar: {
        flexDirection: 'row',
        height: 50,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: 'lightgray',
    },
    card: {
        backgroundColor: "#fff",
        borderColor: "#fff",
        borderBottomWidth: 1,
        borderBottomColor: "lightgrey",
    },
    commentContainer: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "lightgray",
    },
    commentUserInfo: {
        marginBottom: 20,
        flexDirection: 'row'
    },
    userName: {
        fontWeight: "bold",
        marginBottom: 5,
        paddingHorizontal: 5
    },
    commentMessageContainer: {
        flex: 3,
    },
    commentMessage: {
        marginBottom: 5,
    },
    commentActionsContainer: {
        flexDirection: "row",
        justifyContent: 'flex-start',
    },
    commentActionIconContainer: {
        marginHorizontal: 5,
    },
});
