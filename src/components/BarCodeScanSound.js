

import barCodeScanAudio from "../assets/audio/Barcode-scanner-beep-sound.mp3"

import { Audio } from 'expo-av';

import SystemSetting from 'react-native-system-setting';

const BarCodeScanSound = async () => {
    try {

        try {
            const desiredVolume = 1;
            await SystemSetting.setVolume(desiredVolume, { type: 'music' });
        } catch (error) {
            console.error('Error setting media volume:', error);
        }
        const soundObject = new Audio.Sound();

        soundObject.setOnPlaybackStatusUpdate((status) => {
            if (!status.didJustFinish) return;
            soundObject.unloadAsync();
        });
        await soundObject.loadAsync(barCodeScanAudio);
        await soundObject.playAsync();

    } catch (error) {
        console.log(error);
    }
}


export default BarCodeScanSound;