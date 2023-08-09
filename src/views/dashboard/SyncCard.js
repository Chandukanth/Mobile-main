import React, { useEffect, useState } from 'react';
import asyncStorageService from '../../services/AsyncStorageService';
import DateTime from '../../lib/DateTime';
import productService from '../../services/ProductService';
import Card from '../../components/Card';
import Button from '../../components/SyncButton';
import { Text, View } from 'react-native';
import Toast from 'react-native-simple-toast';
import SyncService from '../../services/SyncService';


const SyncCard = () => {
  const [lastSynced, setLastSynced] = useState('');
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    const intervalId = setInterval(() => {
      getLastSynced();
    }, 500);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    getLastSynced()
  }, [])

  const getLastSynced = async () => {
    let LastSynced = await asyncStorageService.getLastSynced();
    setLastSynced(LastSynced);
  };

  const handleSync = async () => {
    setSyncing(true);
    SyncService.Sync(() => {
      setSyncing(false);
      Toast.show("Sync Completed")
    });
  };

  return (
    <View style={{ paddingTop: 10 }}>
      <Card
        title="Sync"
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>

          {syncing ? (
            <Text>
              Sync InProgress...
            </Text>
          ) : (
            <>
            <View>
            <Text>Last Synced At:</Text>
            <Text>
               {lastSynced ? DateTime.formatedDate(lastSynced) : "Not Synced Yet"}
            </Text>
            </View>

            </>
          )}
          <Button
            title="Sync Now"
            onPress={handleSync}
            syncing={syncing}
          />


        </View>

      </Card>
    </View>
  );
};

export default SyncCard;
