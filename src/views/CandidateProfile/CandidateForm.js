import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ScrollView, View } from "react-native";
import Layout from "../../components/Layout";
import PhoneNumber from "../../components/PhoneNumber";
import SaveButton from "../../components/SaveButton";
import Select from "../../components/Select";
import TextInput from "../../components/TextInput";
import ObjectName from "../../helper/ObjectName";
import Permission from "../../helper/Permission";
import Number from "../../lib/Number";
import CandidateProfileService from "../../services/CandidateProfileService";
import JobsService from "../../services/JobService";
import mediaService from "../../services/MediaService";
import PermissionService from "../../services/PermissionService";
import Media from "../Visitor/Media";
import VerticalSpace10 from "../../components/VerticleSpace10";

const CandidateForm = (props) => {
    const params = props?.route?.params?.item
    const [phoneNumber, setPhoneNumber] = useState("")
    const [permission, setPermission] = useState("")
    const [image, setImage] = useState(null);
    const [file, setFile] = useState(null);
    const [jobOptions, setJobOptions] = useState([])

    const navigation = useNavigation()

    useEffect(() => {
        getPermission()
        getJobOption()
    }, [])

    const preloadedValues = {
        firstName: params?.firstName,
        lastName: params?.lastName,
        phone_number: params?.phone,
        email: params?.email,


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
    const getPermission = async () => {
        let edit = await PermissionService.hasPermission(Permission.CANDIDATE_PROFILE_EDIT)
        setPermission(edit)
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

            data.append("object", ObjectName.CANDIDATE_PROFILE);

            data.append("object_id", id);

            data.append("media_url", image);

            data.append("media_visibility", 1);

            data.append("feature", 1);

            mediaService.uploadMedia(navigation, data, async (error, response) => {
                if (response) {
                    navigation.navigate("CandidateProfile")
                }
                //reset the state
                setFile("");
                setImage("");
            })
        } else {
        }
    }

    const getJobOption = async () => {
        let jobs = new Array()
        await JobsService.search((error, response) => {
            if (response && response.data && response.data.data) {
                for (let i = 0; i < response.data.data.length; i++) {
                    jobs.push({
                        label: response.data.data[i].job_title,
                        value: response.data.data[i].id
                    })
                }
                setJobOptions(jobs)
            }
        })
    }

    const candidateUpdate = async (values) => {
        let data = new Object()
        data.firstName = values.firstName
        data.lastName = values.lastName
        data.phone = values?.phone_number
        data.position = values?.Position?.value
        data.positionType = values?.Position?.label

        if (params) {
            await CandidateProfileService.update(params?.candidateId, data, (response) => {
                if (response) {
                    if (file) {
                        uploadImage(params?.candidateId)
                    } else {
                        navigation.navigate("CandidateProfile")

                    }
                }
            })
        } else {
            await CandidateProfileService.create(data, (err, response) => {
                if (response && response.data && response.data.candidateId) {

                    if (file) {
                        uploadImage(response.data.candidateId)
                    } else {
                        navigation.navigate("CandidateProfile")
                    }


                }

            })
        }

    }
    return (
        <Layout
            title={params ? "Candidate Detail" : "Candidate Add"}
            showBackIcon
            FooterContent={<SaveButton errors={errors} show={permission} onPress={handleSubmit(values => { candidateUpdate(values) })} />}
        >
            <ScrollView>
                <View style={{ marginTop: 10, padding: 10 }}>
                    <Media image={image ? image : ""} prefillImage={params?.media_url} setImage={setImage} setFile={setFile} />
                    <TextInput
                        title="First Name"
                        name="firstName"
                        control={control}
                        showBorder={true}
                        required
                        editable={params && !permission ? false : true}

                    />
                    <VerticalSpace10  />

                    <TextInput
                        title="Last Name"
                        name="lastName"
                        control={control}
                        showBorder={true}
                        required
                        editable={params && !permission ? false : true}
                    />
                    <VerticalSpace10  />

                    <PhoneNumber
                        title="Phone Number"
                        name="phone_number"
                        control={control}
                        required
                        values={phoneNumber}
                        onInputChange={handlePhoneNumberChange}
                        editable={params && !permission ? false : true}
                    />
                    <VerticalSpace10  />

                    <Select
                        label={"Position"}
                        placeholder={"Select Job Position"}
                        control={control}
                        options={jobOptions}
                        data={params?.position && Number.Get(params?.position)}
                        disable={params && !permission ? true : false}
                    />

                </View>
            </ScrollView>
        </Layout>
    )

}
export default CandidateForm