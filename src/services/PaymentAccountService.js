
import apiClient from "../apiClient";
import { endpoints } from "../helper/ApiEndPoint";

class PaymentAccountService {


    static async search(setPaymentAccountList) {
        try {
            apiClient.get(`${endpoints().PaymentAccountApi}/list`, (error, response) => {
                let paymentAccount = new Array();
                let paymentAccountList = response?.data?.data;
                if (paymentAccountList && paymentAccountList.length > 0) {
                    for (let i = 0; i < paymentAccountList.length; i++) {
                        paymentAccount.push({
                            label: paymentAccountList[i].payment_account_name,
                            value: paymentAccountList[i].id,
                        });
                    }
                }
                // Set response in state
                setPaymentAccountList && setPaymentAccountList(paymentAccount);
            })
        } catch (err) {
            console.log(err);
        }
    }

}

export default PaymentAccountService;
