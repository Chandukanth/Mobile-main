import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import Layout from "../../../components/Layout";
import NextButton from "../../../components/NextButton";
import TextArea from "../../../components/TextArea";
import inventoryTransferService from "../../../services/InventoryTransferService";
import { useNavigation } from "@react-navigation/native";
import { useForm } from "react-hook-form";
import VerticalSpace10 from "../../../components/VerticleSpace10";


const Notes = (props) => {
    let params = props?.route?.params;

    const [notes, setNotes] = React.useState(params?.notes || "");

    const navigation = useNavigation();
    const {
        control,
        formState: { errors },
      } = useForm({
        
      });


    const handleNotesOnChange = (value) => {
        setNotes(value)
    }

    const updateTransfer = async () => {
        let bodyData = {
            notes : notes,
        }

await inventoryTransferService.updateInventory(params?.transferId, bodyData, (err, response) => {
    if(response){
        navigation.navigate("Transfer/ProductList", {
            transferId: params?.transferId,
            toLocationId: params?.toLocationId,
            fromLocationId: params?.fromLocationId,
            date: params?.date,
            type: params?.type,
            fromLocationName: params?.fromLocationName,
            toLocationName: params?.toLocationName,
            notes : notes ? notes : params?.notes 
        })
    }

   
})
    }


    return (
        <Layout
            title="Add Notes"
            showBackIcon={true}
            updateValue={()=>{updateTransfer()}}
            >
         <VerticalSpace10 />

            <TextArea
                name="notes"
                placeholder="notes"
                onInputChange={handleNotesOnChange}
                value={notes}
                control={control}
                focus
                style={styles.input}
            />

        </Layout>

    )

}
export default Notes

const styles = StyleSheet.create({
    input: {
        fontSize: 16,
        minHeight:550
    },
})