// Import React and Component
import React from "react";

import { useNavigation } from "@react-navigation/native";

import Layout from "../../components/Layout";

import MessageList from "../../components/messageList";
import messageService from "../../services/MessageService";
import { getFullName } from "../../lib/Format";

const ChatUsers = (props) => {

  const navigation = useNavigation();

  const chatNavigation = async (user) => {
    await messageService.get(user.id, (err, response)=>{  
      navigation.navigate("Messages/Detail", {
        reciever_user_id : user.id,
        reciever_user_name : getFullName(user.firstName, user.lastName),
        receiverMessages : response.data.receiverMessages,
        senderMessages : response.data.senderMessages,
        image:user?.media_url
      })
    })
  }

  return (
    <Layout
      title="Messages"
      showBackIcon
      buttonLabel={"New"}
      buttonOnPress={()=> navigation.navigate("Messages/New")}
    >
      <MessageList onPress={chatNavigation} />
    </Layout>
  );
};

export default ChatUsers;
