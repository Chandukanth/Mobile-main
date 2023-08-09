import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Card from "../../components/Card";
import { Color } from "../../helper/Color";
import DateTime from "../../lib/DateTime";
import { useNavigation } from "@react-navigation/native";
import dashboardService from "../../services/DashboardService";
import AlternativeColor from "../../components/AlternativeBackground";
import FineCard from "../../views/fine/components/FineCard"

const FineList = () =>{
    const [fine, setFine] = useState();

    const navigator = useNavigation();

    useEffect(()=>{
        getFine();
    },[])

    const getFine = async () =>{
        await dashboardService.getFine(callback=>setFine(callback))
    }

    const ViewFine = () => {
        navigator.navigate("Fine")
    
      }
return(
    <View>
    {fine && (
         <Card
         title="Fines"
         viewAllHander={() => navigator.navigate("Fine")}
         showViewAll
     >


            {fine && fine.length > 0 && fine.map((item, index) => {
              const containerStyle = AlternativeColor.getBackgroundColor(index)

              return (
                <>
                 <FineCard 
                  type={item.type}
                  user={item.user}
                  amount={item.amount}
                  alternative={containerStyle}

                  onPress={() => {
                    navigator.navigate("FineForm", { item });
                  }}/>
                </>
              )
            }
            )}
          </Card>
      )}
      </View>
)
}
export default FineList;