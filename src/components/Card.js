import React from 'react';
import { Card, Title } from 'react-native-paper';
import { View, StyleSheet, Text } from 'react-native';
import { Color } from '../helper/Color';
import Divider from './Divider';
import Content from './Content';
import Link from './Link';

const CustomCard = ({ title, children, rightContent,showViewAll,onPress ,viewAllHander}) => {
  return (
    <Card style={styles.card}>
      <View style={styles.cardHeader}>
        <Title style={styles.title}>{title}</Title>
        <Text style={styles.rightContent}>{rightContent}</Text>
      { showViewAll && (
                    <Link
                        title="View All"
                        onPress={viewAllHander}
                    />
                
             ) }
          </View>

      <Divider />
      <Card.Content>{children}</Card.Content>
    </Card>
  );
};

export default CustomCard;

const styles = StyleSheet.create({
  card: {
    borderWidth: 0.5,
    borderColor: Color.ACTIVE,
    borderRadius: 10,
    paddingBottom: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    paddingLeft:15
  },
  rightContent: {
    fontWeight: 'bold',
    fontSize: 16,
    paddingRight:10
  },
});
