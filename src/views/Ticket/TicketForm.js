import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import TextArea from "../../components/TextArea";
import DatePicker from "../../components/DatePicker";
import { useForm } from "react-hook-form";
import DoneButton from "../../components/DoneButton";
import ticketService from "../../services/TicketServices";
import { useNavigation } from "@react-navigation/native";
import UserSelect from "../../components/UserSelect";
import VerticalSpace10 from "../../components/VerticleSpace10";
import ProjectSelect from "../../components/ProjectSelect";


const TicketForm = () => {
    const [selectedUser, setSelectedUser] = useState("");
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedProject, setSelectedProject] = useState("");

    const navigation = useNavigation()

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
    });



    const onDateSelect = (value) => {
        //update the selected date
        setSelectedDate(new Date(value));
    }

    const addTicket = (values) => {

        let createData = new Object();

        createData.assignee_id = selectedUser,

        createData.eta = selectedDate

        createData.projectId = selectedProject?.value,

        createData.summary = values.summary,


        ticketService.create(createData, (err, response) => {
            if (response) {
                navigation.navigate("Ticket")
            }
        })

    }

    return (
        <Layout
            title="Add Ticket"
            showBackIcon={true}
            FooterContent={<DoneButton
                onPress={handleSubmit((values) => addTicket(values))}
            />}
        >
            <VerticalSpace10  />

            <TextArea
                name="summary"
                title="Summary"
                control={control}
                required={true}
            />
            <VerticalSpace10  />

            <UserSelect
                label="Assignee"
                onChange={(values) => setSelectedUser(values)}
                name="assignee"
                control={control}
                required
                placeholder="Select Assignee"
            />
            <VerticalSpace10  />
            <ProjectSelect
                label="Project"
                name="project"
                onChange={(values) => setSelectedProject(values)}
                control={control}
                required
                placeholder="Select Project"
            />

            <VerticalSpace10  />



            <DatePicker
                title="ETA"
                onDateSelect={onDateSelect}
                selectedDate={selectedDate}
                showTime={true}
            />
        </Layout>

    )

}
export default TicketForm;