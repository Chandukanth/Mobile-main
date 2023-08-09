import { Alert } from 'react-native';
import SystemSetting from 'react-native-system-setting';
import { Audio } from 'expo-av';
import messageService from '../services/MessageService';
import messageSound from "../assets/audio/message.mp3";
import * as Notifications from 'expo-notifications';


const MessageSound = async () => {
    messageService.unRead((err, response) => {
        if (response && response.data) {
            const messages = response.data.data;
            messages && messages.length > 0 && messages.forEach(async (message) => {
                const { id, first_name, last_name, recent_last_message } = message;
                if (recent_last_message) {
                    const soundObject = new Audio.Sound();
                    try {
                        try {
                            const desiredVolume = 1;
                            await SystemSetting.setVolume(desiredVolume, { type: 'music' });
                        } catch (error) {
                            console.error('Error setting media volume:', error);
                        }
                        
                        await Notifications.scheduleNotificationAsync({
                            content: {
                              title: "New Message Received",
                              body: `${first_name} ${last_name}: ${recent_last_message}`,
                              data: { data: `${first_name} ${last_name}: ${recent_last_message}` },
                            },
                            trigger: { seconds: 1 },
                          });
                    } catch (error) {
                        console.log('Error loading and playing sound:', error);
                    }

                    await new Promise(async (resolve) => {
                        await soundObject.loadAsync(messageSound);
                        await soundObject.playAsync();
                        await soundObject.setIsLoopingAsync(true);
                        Alert.alert(
                            'New Message Received',
                            `${first_name} ${last_name}: ${recent_last_message}`,
                            [
                                {
                                    text: 'OK',
                                    onPress: async () => {
                                        await soundObject.stopAsync();
                                        await soundObject.unloadAsync();
                                        resolve();
                                        await messageService.update(id, null, (err, response) => { });
                                    },
                                },
                            ]
                        );
                    });
                }
            });
        }
    });



};

export default MessageSound;
