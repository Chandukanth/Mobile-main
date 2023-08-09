import React, { useState, useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useForm } from "react-hook-form";
import Tab from "../../components/Tab";
import TabName from '../../helper/Tab';
import ObjectName from "../../helper/ObjectName";
import Layout from "../../components/Layout";
import { useIsFocused } from "@react-navigation/native";
import DatePicker from "../../components/DatePicker";
import Permission from "../../helper/Permission";
import Currency from "../../components/Currency";
import UserSelect from "../../components/UserSelect";
import TagSelector from "../../components/TagSelector"
import { Tag } from "../../helper/Tag"
import TextArea from "../../components/TextArea";
import DateTime from "../../lib/DateTime";
import fineService from "../../services/FineService";
import SaveButton from "../../components/SaveButton";
import MediaList from "../../components/MediaList";
import PermissionService from "../../services/PermissionService";
import NextButton from "../../components/NextButton";
import VerticalSpace10 from "../../components/VerticleSpace10";
import StatusSelect from "../../components/StatusSelect"
import mediaService from "../../services/MediaService";
import Media from '../../helper/Media';



const FineForm = (props) => {
  let details = props?.route?.params?.item;
  let id = details?.id
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [manageOther, setManageOther] = useState(false);
  const [noEdit, setNoEdit] = useState(false);
  const [activeTab, setActiveTab] = useState(TabName.GENERAL);
  const [picture, setPicture] = useState(false);
  const [fineId, setFineId] = useState("");
  const [status, setStatus] = useState("");
  const [MediaData, setMediaData] = useState([]);
  const [selecteUser, setSelectedUser] = useState("");
  const [selectedType, setSelectedType] = useState("")
  const isFocused = useIsFocused();
  const navigation = useNavigation();

  const onDateSelect = (value) => {
    setSelectedDate(new Date(value));
  }

  const handleStatusOnChange = (value) => {
    setStatus(value.value)
  }
  const preloadedValues = {
    id: details?.id,
    user: { label: details?.user, value: details?.userId },
    date: details?.date ? details?.date : selectedDate,
    notes: details?.notes || "",
    amount: details && details?.amount.toString(),
  };
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: preloadedValues
  });

  const updateDateValues = () => {
    let date = details?.date;
    if (date) {
      setSelectedDate(new Date(date));
    }
  }
  useEffect(() => {
    let mount = true;
    //get permission
    mount && editPermission();
    mount && updateDateValues()
    mount && getMediaList()
    return () => {
      mount = false;
    }
  }, [])

 

  const takePicture = async (e) => {
    const image = await Media.getImage();
    if (image && image.assets) {
      const response = await fetch(image.assets[0].uri);
      const blob = await response.blob();
      await Media.uploadImage(fineId ? fineId : details?.id, blob, image.assets[0].uri, ObjectName.FINE, null, null, async (response) => {
        if (response) {
          getMediaList();
        }
      })
    }
  };


  const getMediaList = async () => {
    await mediaService.search(fineId ? fineId : details?.id, ObjectName.FINE, (callback) => setMediaData(callback.data.data))
  }

  const updateFine = async (values) => {
    const updateData = {
      user: selecteUser ? selecteUser : details?.userId,

      date: DateTime.formatDate(selectedDate),

      type: selectedType ? selectedType : details?.typeId,
      status: status ? status : details?.statusId,

      amount: values.amount ? values.amount : details?.amount,

      notes: values.notes,
    }
    if (details) {
      await fineService.update(id, updateData, (err, response) => {
        if (response) {
          navigation.navigate("Fine")
        }
      })
    } else {
      fineService.create(updateData, (err, response) => {
        if (response && response.data) {
          setFineId(response.data.id)
          setActiveTab(TabName.ATTACHMENTS)
        }
      })
    }


  }
  const editPermission = async () => {
    const editPermission = await PermissionService.hasPermission(Permission.FINE_EDIT);
    setNoEdit(editPermission);
  }



  return (
    <Layout
      title={details ? `Fine#: ${details?.id}` : "Fines"}
      showBackIcon={true}
      buttonLabel={activeTab === TabName.ATTACHMENTS && "Upload"}
      FooterContent={activeTab === TabName.GENERAL ? <SaveButton errors={errors} show={noEdit ? true : false}
        onPress={handleSubmit(values => { updateFine(values); })}
      /> : <NextButton errors={errors} onPress={() => {
        navigation.navigate("Fine")
      }} />}
      buttonOnPress={(e) => takePicture(e)}

    >

      <ScrollView
        keyboardShouldPersistTaps="handled"
      >


        <View style={styles.container}>
          {details && (
            <View style={styles.tabBar}>
              <Tab
                title={TabName.GENERAL}
                isActive={activeTab === TabName.GENERAL}
                onPress={() => setActiveTab(TabName.GENERAL)}
              />
              <Tab
                title={`${TabName.ATTACHMENTS} `}
                isActive={activeTab === TabName.ATTACHMENTS}
                onPress={() => setActiveTab(TabName.ATTACHMENTS)}
              />
            </View>
          )}
          {activeTab === TabName.GENERAL && (

            <View style={{ marginTop: 10, padding: 10 }}>
              <DatePicker
                title="Date"
                onDateSelect={onDateSelect}
                disabled={noEdit ? true : false}
                selectedDate={selectedDate ? selectedDate : details?.date}


              />
              <VerticalSpace10 />
              <UserSelect
                label="Assignee"
                selectedUserId={details?.userId}
                name={"assignee"}
                showBorder={true}
                required
                onChange={(value) => setSelectedUser(value.value)}
                control={control}
                placeholder="Select Assignee"
                disable={noEdit ? false : true}

              />
              <VerticalSpace10 />


              <TagSelector
                label={"Type"}
                placeholder={"Select Type"}
                name="type"
                control={control}
                disable={noEdit ? false : true}
                required
                onChange={(value) => setSelectedType(value.value)}
                type={Tag.FINE_TYPE}
                data={selectedType ? selectedType : details?.typeId}
              />
              <VerticalSpace10 />

              {details && (
                <StatusSelect
                  label={"Status"}
                  name={"status"}
                  onChange={handleStatusOnChange}
                  control={control}
                  object={ObjectName.FINE}
                  showBorder={true}
                  placeholder={"Select Status"}
                  data={details?.statusId ? Number(details?.statusId) : status}
                  disable={details?.allow_edit == 1 ? false : true}
                  currentStatusId={details?.statusId}

                />
              )
              }

              <Currency
                name="amount"
                title={"Amount"}
                control={control}
                edit={noEdit ? true : false}
                placeholder="Amount" />
              <VerticalSpace10 />

              <TextArea
                title="Notes"
                name="notes"
                placeholder="Notes"
                editable={ noEdit ? true : false}
                control={control}
              />
            </View>
          )}
          {activeTab === TabName.ATTACHMENTS && (
            <>
              <MediaList
                mediaData={MediaData}
                getMediaList={getMediaList}
              />
            </>
          )}

        </View>

      </ScrollView>
    </Layout>
  )

}
export default FineForm;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: "scroll",
    backgroundColor: "#fff",
  },

  container1: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start'
  },
  item: {
    width: '50%'
  },
  tabBar: {
    flexDirection: 'row',
    height: 50,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
  },
});