import React, { useState, useEffect, useCallback } from 'react';
import { View, TextInput, TouchableOpacity, FlatList, Text, StyleSheet } from 'react-native';
import messageService from '../../services/MessageService';
import asyncStorageService from '../../services/AsyncStorageService';
import Layout from '../../components/Layout';
import UserAvatar from "react-native-user-avatar";
import { Color } from '../../helper/Color';
import AlternativeColor from "../../components/AlternativeBackground";
import Spinner from '../../components/Spinner';
import Button from "../../components/Button";
import TextBox from '../../components/TextBox';
import { useForm } from 'react-hook-form';




const MessagePage = (props) => {
  const params = props?.route?.params;
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [userName, setUserName] = useState("")
  const [alternative, setAlternative] = useState("")
  const [refreshing, setRefreshing] = useState(false);

  const defaultValues = {
    message: message
  }
  const {
    reset,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: defaultValues

  });

  const onRefresh = useCallback(() => {
    setRefreshing(true);

    wait(500).then(() => setRefreshing(false));
  }, []);

  const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  };
  useEffect(() => {
    const fetchData = async () => {
      if (params?.receiverMessages && params?.senderMessages) {
        await messageService.get(params?.reciever_user_id, async (err, response) => {
          const receiverMessages = response.data.receiverMessages.map((message, index) => ({
            message: message.message,
            isSender: false,
            timestamp: new Date(message.timestamp).getTime(), // Convert timestamp to milliseconds
          }));

          const senderMessages = response.data.senderMessages.map((message, index) => ({
            message: message.message,
            isSender: true,
            timestamp: new Date(message.timestamp).getTime(), // Convert timestamp to milliseconds
          }));

          const allMessages = [...receiverMessages, ...senderMessages];

          allMessages.sort((a, b) => a.timestamp - b.timestamp); // Sort messages by timestamp

          setMessages(allMessages);
          const UserName = await asyncStorageService.getUserName();
          setUserName(UserName);
        });
      }
    };

    fetchData();
  }, [refreshing]);


  const handleSend = (values) => {
    if (message.trim() === '') return;
    const newMessage = { message, isSender: true };
    setMessages([...messages, newMessage]);

    if (message) {
      let bodyData = {
        message: message,
        reciever_user_id: params?.reciever_user_id,
      };
      setMessage('');

      messageService.SendMessage(bodyData, (err, response) => {
        reset({})
        values.message === ""

      });
    }
  };

  const renderMessageItem = ({ item, index }) => {
    const { message, isSender } = item;
    const containerStyle = AlternativeColor.getBackgroundColor(index, { plainText: true });
    setAlternative(containerStyle);

    return (
      <View style={containerStyle}>
        {isSender ? (
          <>
            <View style={styles.receiverContainer}>
              <UserAvatar
                size={20}
                name={userName}
                src={params?.image}
                bgColor={Color.PRIMARY}
              />
              <Text style={styles.senderName}>{userName}</Text>
            </View>
          </>
        ) : (
          <>
            <View style={styles.receiverContainer}>
              <UserAvatar
                size={20}
                name={params.reciever_user_name}
                src={params?.image}
                bgColor={Color.PRIMARY}
              />
              <Text style={styles.receiverName}>{params.reciever_user_name}</Text>
            </View>
          </>
        )}
        <Text style={styles.message}>{message}</Text>
      </View>
    );
  };
  if (refreshing) {
    return <Spinner />;
  }


  return (
    <Layout
      title={params.reciever_user_name}
      showBackIcon={true}
      buttonLabel="Refresh"
      buttonOnPress={onRefresh}
    >
      <View style={styles.container}>
        <FlatList
          data={messages.sort((a, b) => a.timestamp - b.timestamp)}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderMessageItem}
          contentContainerStyle={styles.messagesContainer}
        />
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextBox
              control={control}
              placeholder="Type a message..."
              name="message"
              onInputChange={setMessage}
              containerStyle={styles.containerStyle}
            />
          </View>
          <View style={styles.buttonWrapper}>
            <Button
              title="Send"
              onPress={handleSubmit(handleSend)}
              backgroundColor={Color.GREEN}
              borderRadius={20}
              loading={true}
            />
          </View>
        </View>

      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 16,
  },
  messagesContainer: {
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  message: {
    fontSize: 16,
    paddingVertical: 8,
  },
  senderName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'blue',
    paddingBottom: 4,
    marginLeft: 10,
  },
  receiverName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'red',
    paddingBottom: 4,
    marginLeft: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#DDDDDD',
    paddingVertical: 8,
  },
  input: {
    flex: 1,
    height: 50,
    width: "70%",
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
  },
  sendButton: {
    marginLeft: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#4CAF50',
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  receiverContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
   inputWrapper: {
    flex: 1,
  },
  containerStyle: {
    width: '100%',
    borderColor: 'gray',
    borderRadius: 25,
    paddingHorizontal: 10,
    paddingTop:10

},
  buttonWrapper: {
    marginLeft: 10, 
  },
});

export default MessagePage
