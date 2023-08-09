import React, { useState, useEffect } from "react";
import Card from "../../components/Card";
import dashboardService from "../../services/DashboardService";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { View } from "react-native";
import AlternativeColor from "../../components/AlternativeBackground";
import TicketCard from "../Ticket/components/TicketCard";

const TicketList = () => {
    const [ticket, setTicket] = useState();
    const navigation = useNavigation()
    const isFocused = useIsFocused()
    useEffect(()=>{
        getTicket();
    },[])
    const getTicket = async () =>{
        await dashboardService.getTicket(callback=>setTicket(callback))
    }

    return (
        <View>
            {ticket && (
            <Card
                title="Tickets"
                viewAllHander={() => navigation.navigate("Ticket")}
                showViewAll
            >
            {ticket && ticket.length > 0 && ticket.map((item, index) => {
                const containerStyle = AlternativeColor.getBackgroundColor(index)
  
                return (
                  <>
                  <TicketCard
                   eta={item.eta}
                   summary={item.summary}
                   assignee_name={item.assignee_name}
                   status={item.statusName}
                   statusColor={item.statusColor}
                   alternative={containerStyle}
                   onPress={() => navigation.navigate("Ticket/Detail", { item: item })}

                  />
                     
                  </>
                )
            }
            )}
          </Card>
      )}
      </View>
)
}
export default TicketList;