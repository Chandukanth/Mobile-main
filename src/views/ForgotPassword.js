import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView
} from "react-native";
import Button from "../components/Button";
import Email from "../components/Email"
import platform from "../lib/Platform";

import { Color } from "../helper/Color";
import apiClient from "../apiClient"; 
import { endpoints } from "../helper/ApiEndPoint";
import Alert from "../components/Modal/Alert";
import PageTitle from '../components/PageTitle';
import { useForm } from "react-hook-form";
import VerticalSpace10 from "../components/VerticleSpace10";
import Layout from "../components/Layout/LoginLayout";


const ForgotPassword = () => {
  const [email, onEmailChange] = useState("");
  
  const defaultValues = {
    email: email || ""
}
const {
    control,
    handleSubmit,
    formState: { errors },
} = useForm({
    defaultValues: defaultValues
});
  const handleResetPassword = () => {
    const data = {
      email: email
    };
  
    apiClient.put(`${endpoints().UserAPI}/forgotPassword`, data)
      .then(response => {
        Alert.Success("Reset Password Email Sent")
      })
      .catch(error => {
        console.log(error);
      });
  };

  return (
    <>
       <Layout>
      <KeyboardAvoidingView
        style={[
          styles.container,
          {
            flexDirection: "column",
          },
        ]}
      >
   <View style={{ flex: platform.isIOS() ? 2.2 : 1, alignContent: 'space-around', justifyContent: 'center' }}>
      <PageTitle text={"Forgot Password?"} size={20}/>
      <VerticalSpace10 />
          <VerticalSpace10 />
          
          <Email
            title={"Email"}
            name="email"
            control={control}
            required
            onInputChange={onEmailChange}
          />
        
        <VerticalSpace10 />
        
        <Button
          title="Submit"
          onPress={handleSubmit(handleResetPassword)}
        />
         </View>
      </KeyboardAvoidingView>
    </Layout>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
 
});

export default ForgotPassword;
