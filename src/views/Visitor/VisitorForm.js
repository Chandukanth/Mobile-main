import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import TextInput from "../../components/TextInput";
import { useForm } from "react-hook-form";
import PhoneNumber from "../../components/PhoneNumber";
import TextArea from "../../components/TextArea";
import SaveButton from "../../components/SaveButton";
import VisitorService from "../../services/VisitorService";
import ObjectName from "../../helper/ObjectName";
import { useNavigation } from "@react-navigation/native";
import { View } from "react-native";
import Media from "./Media";
import mediaService from "../../services/MediaService";
import { ScrollView } from "react-native";
import TagSelector from "../../components/TagSelector";
import { Tag } from "../../helper/Tag";
import VerticalSpace10 from "../../components/VerticleSpace10";
import PermissionService from "../../services/PermissionService";
import Permission from "../../helper/Permission";

const VisitorForm = (props) => {
    const params = props?.route?.params?.item
    const [phoneNumber, setPhoneNumber] = useState("")
    const [image, setImage] = useState(null);
    const [file, setFile] = useState(null);
    const [editPermission, setEditPermission] = useState()
    const navigation = useNavigation()

    useEffect(() => {
        let mount = true
        mount && getPermission()
        return () => {
            mount = false
        }
    }, [])

    const preloadedValues = {
        name: params?.name,
        phone_number: params?.phone,
        purpose: params?.purpose,
        notes: params?.notes
    }

    const getPermission = async () => {
        const editPermission = await PermissionService.hasPermission(Permission.VISITOR_EDIT);
        setEditPermission(editPermission)
    }

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: preloadedValues
    });

    const handlePhoneNumberChange = (value) => {
        setPhoneNumber(value)
    }

    const uploadImage = (id) => {

        if (file) {

            const data = new FormData();

            let mediaFile = {
                type: file?._data?.type,
                size: file?._data.size,
                uri: image,
                name: file?._data.name
            }

            data.append("media_file", mediaFile)

            data.append("image_name", file?._data.name);

            data.append("name", file?._data.name);

            data.append("media_name", file?._data.name);

            data.append("object", ObjectName.VISITOR);

            data.append("object_id", id);

            data.append("media_url", image);

            data.append("media_visibility", 1);

            data.append("feature", 1);

            mediaService.uploadMedia(navigation, data, async (error, response) => {
                if (response) {
                    let data = {
                        media_id: response.id
                    }
                    await VisitorService.update(id, data, (response) => {
                        navigation.navigate("Visitor")
                    })
                }
                //reset the state
                setFile("");
                setImage("");
            })
        } else {
        }
    }



    const createVisitor = async (values) => {
        let data = new FormData()

        let mediaFile = {
            type: file?._data?.type,
            size: file?._data.size,
            uri: image,
            name: file?._data.name
        }
        data.append("name", values && values?.name ? values?.name : "")
        data.append("mobileNumber", values && values?.phone_number ? values?.phone_number : "")
        data.append("purpose", values && values?.purpose ? values?.purpose : "")
        data.append("notes", values && values?.notes ? values?.notes : "")
        data.append("name", values && values?.name ? values?.name : "")
        !params && data.append("media_file", file !== null ? mediaFile : "")

        let updateData = new Object()
        updateData.name = values.name
        updateData.phone = values?.phone_number
        updateData.purpose = values?.purpose
        updateData.notes = values?.notes


        if (params) {
            await VisitorService.update(params?.id, updateData, (response) => {
                if (response) {
                    if (file) {
                        uploadImage(params?.id)
                    } else {
                        navigation.navigate("Visitor")

                    }
                }
            })
        } else {
            await VisitorService.create(data, (err, response) => {
                if (response) {
                    navigation.navigate("Visitor")
                }
            })
        }
    }

    return (
        <Layout
            title={params ? "Visitor Detail" : " New Visitor "}
            showBackIcon
            buttonLabel={!params && editPermission ? "Add" : ""}
            buttonOnPress={handleSubmit(values => { createVisitor(values) })} 
            FooterContent={params && <SaveButton errors={errors} show={params && editPermission} onPress={handleSubmit(values => { createVisitor(values) })} />}
        >
            <ScrollView>
                <View style={{ marginTop: 10, padding: 10 }}>
                    <Media image={image ? image : ""} prefillImage={params?.media_url} setImage={setImage} setFile={setFile} />
                    <TextInput
                        title="Name"
                        name="name"
                        editable={params && !editPermission ? false : true}
                        control={control}
                        required
                    />
                    <VerticalSpace10  />
                    <PhoneNumber
                        title="Phone Number"
                        name="phone_number"
                        control={control}
                        values={phoneNumber}
                        onInputChange={handlePhoneNumberChange}
                        editable={params && !editPermission ? false : true}
                    />
                    <VerticalSpace10  />
                    <TextInput
                        title="Purpose"
                        name="purpose"
                        control={control}
                        editable={params && !editPermission ? false : true}
                        required={true}

                    />
                    <VerticalSpace10  />

                    <TextArea
                        name="notes"
                        title="Notes"
                        placeholder="Notes"
                        control={control}
                        editable={params && !editPermission ? false : true}
                    />
                </View>
            </ScrollView>
        </Layout>
    )

}
export default VisitorForm