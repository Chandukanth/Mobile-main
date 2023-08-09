import AlertModal from "../components/Alert";

class Alert {
    static Error(message) {
        AlertModal("Error", message)
    }
}

export default Alert;