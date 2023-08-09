
import Status from "../helper/Status";
import DateTime from "../lib/DateTime";
import AttendanceService from "./AttendanceService";
import fineService from "./FineService";
import OrderService from "./OrderService"
import ticketService from "./TicketServices";

class DashboardService {

    async get(callback) {

        AttendanceService.getDashboardData((error, response) => {

            return callback(error, response)

        })
    }

    async getFine(callback) {
        let params = { sort: "date", sortDir: "DESC", group: Status.GROUP_PENDING, pageSize: 2 };
        fineService.search(params, (err, response) => {

            let fines = response && response?.data && response?.data?.data;

            callback(fines)
        });
    }


    async getTicket(callback) {
        let params = { group: Status.GROUP_PENDING, startDate: DateTime.formatDate(new Date()), endDate: DateTime.toISOEndTimeAndDate(new Date()) };
        ticketService.searchTicket(params, (err, response) => {

            let tickets = response && response?.data && response?.data?.data;

            callback(tickets)
        });
    }
    async getOrder(setTotalAmount) {
        const startDate = DateTime.CurrentStartMonth()
        const endDate = DateTime.CurrentEndMonth()
        let param = {
            sort: "createdAt", sortDir: "DESC", startDate: startDate,
            endDate: endDate
        };

        OrderService.searchOrder(param, (error, response) => {
            let totalAmount = response && response?.data && response?.data?.totalAmount;
            setTotalAmount(totalAmount);
        })
    }
}
const dashboardService = new DashboardService();

export default dashboardService;