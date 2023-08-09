import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Linking
} from "react-native";
import Currency from "../lib/Currency";
import { Color } from "../helper/Color";
import * as Print from "expo-print";
import * as MediaLibrary from "expo-media-library";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system"
import DateTime from "../lib/DateTime";



const SharePdf = (props) => {

  const [products, setProducts] = useState([])

  useEffect(()=>{
    getProucts()
  },[])

  const getProucts = () =>{
    props.getInventoryProducts(callback=>setProducts(callback))
  }

 

  const whatsapp = async () => {

    const response = await Print.printToFileAsync({
      html: createDynamicTable(),
    })


    const pdfName = `${response.uri.slice(
      0,
      response.uri.lastIndexOf('/') + 1
    )}${type}-${fromLocationName} -->  ${toLocationName}-${transferDates}.pdf`

    await FileSystem.moveAsync({
      from: response.uri,
      to: pdfName,
    })
    sharePdf(pdfName)
  }

  const sharePdf = (url) => {
    Sharing.shareAsync(url)
  }


  const fromLocationName = props.fromLocationName;
  const type = props.type;
  const toLocationName = props.toLocationName;
  const transferDate = props.date;
  const transferDates = DateTime.currentDate("DD-MMM-YYYY");

  const createDynamicTable = () => {
    var table = "";
    for (let i in products) {
      const item = products[i];
      table =
        table +
        `
      <tr style="font-size:small">
        <td style = " border: 1px solid #dddddd ">
        
        <div style ="text-align: center">
        ${parseInt(i) + 1}
        </div>
        </td>
        <td style = " border: 1px solid #dddddd ; width : 800px">
        <table>
  <td style = "width : 50px">
    <div style = "padding-left: 10px">
      <img src= ${item.image ? item.image : ""
        }  width="30" height="30"/>
    </div>
  </td>
  <td >
     <div style = "line-height: 100%">
       <span style = "font-weight: bold"> ${item.brand_name ? item.brand_name : ""
        } </span>
         </br>
        ${item.name}
      </br>
      <span style =  "text-decoration: line-through" >  ${item.mrp && item.sale_price && (item.mrp != item.sale_price) ? Currency.IndianFormat(item.mrp) : ""}</span>
      <span > ${item.sale_price ? Currency.IndianFormat(item.sale_price) : item.sale_price == item.mrp ? Currency.IndianFormat(item.sale_price) : ""}</span>  


      </div>
</td>
</table>
        </td>
        <td style = " border: 1px solid #dddddd">
        
        <div style ="text-align: center">${item.quantity}</div></td>
      </tr>
      `;
    }
    const html = `
    <!DOCTYPE html>
    <html>
      <head>
      <style>
        table {
          font-family: arial, sans-serif;
          border-collapse: collapse;
        }
      </style>
      </head>
      <body>
      <table style = "font-size:small">
      <thead>
      <tr>
      <th style = " border: 1px solid #dddddd"> </th>
      <th style = " border: 1px solid #dddddd">Inventory Transfer</th>
      <th style = " border: 1px solid #dddddd"> </th>
      </tr>
      <tr>
        <th style = " border: 1px solid #dddddd">From </th>
        <td style = " border: 1px solid #dddddd  ; padding : 5px">
        <span style = "font-weight : bold"> ${fromLocationName}</span>
        </td>
        <th style = " border: 1px solid #dddddd"> </th>
      </tr>
      <tr>
        <th style = " border: 1px solid #dddddd">To </th>
        <td style = " border: 1px solid #dddddd  ; padding : 5px">
        
        <span style = "font-weight : bold"> ${toLocationName}</span>
        </td>
        <th style = " border: 1px solid #dddddd"> </th>
      </tr>
      <tr>
        <th style = " border: 1px solid #dddddd">Date </th>
        <td style = " border: 1px solid #dddddd  ; padding : 5px">
        <span style = "font-weight : bold">${transferDate}</span>

        </td>
        <th style = " border: 1px solid #dddddd"> </th>
      </tr>
      <tr className="">
        <th style = " border: 1px solid #dddddd ; padding : 5px">Transfer#</th>
        <th style = " border: 1px solid #dddddd">Item Name</th>
        <th style = " border: 1px solid #dddddd"; padding: 5px>Quantity</th>
      </tr>
    </thead>
    <tbody>
    ${table}
    </tbody>
    <tr>
    <th >Received By:</th>
  </tr>
      </table>
      </body>
    </html>
      `;
    return html;
  };

  return (
    <View>
      <TouchableOpacity accessibilityLabel="menu" onPress={whatsapp} style={{ padding: 10 }}>
        <Text style={{ color: Color.PRIMARY, fontWeight: '900' }}>SHARE</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SharePdf;
