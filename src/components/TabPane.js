import React, { useState } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';

const TabPane = ({ tabs, tabContent, setActiveTab }) => {

    const initialLayout = { width: Dimensions.get('window').width };

    const [index, setIndex] = useState(0);

    const handleIndexChange = async (index) => {
        if (tabs[index]) {
            await setActiveTab(tabs[index].key);
        }
        setIndex(index);
    }

    const onTabPress = (tabEvent) => {
        if (tabEvent && tabEvent.route) {
            let index = tabs.findIndex((data) => data.key == tabEvent.route.key);
            if (index > -1) {
                setIndex(index)
            }
        }
    }

    const renderTabBar = props => (
        <TabBar
            {...props}
            indicatorStyle={styles.indicator}
            style={styles.tabBar}
            labelStyle={styles.label}
            onTabPress={onTabPress}
        />
    );

    return (
        <>
            <TabView
                navigationState={{ index, routes: tabs }}
                renderScene={SceneMap(tabContent)}
                onIndexChange={handleIndexChange}
                initialLayout={initialLayout}
                renderTabBar={renderTabBar}
            />
        </>
    );
}

const styles = StyleSheet.create({
    scene: {
        flex: 1,
    },
    tabBar: {
        backgroundColor: '#FFFFFF',
    },
    indicator: {
        backgroundColor: 'black',
    },
    label: {
        color: 'black',
        fontWeight: 'bold',
    },
});

export default TabPane;