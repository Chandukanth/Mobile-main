import { api_url } from "../../config";

const appApi = (path) => {

  return `${api_url}/${path}`;

};

// API call routes
export const endpoints = () => ({
  // User API Routes
  userRoleAPI: appApi("v1/userRole"),
  userPermissionAPI: appApi("v1/user/permission"),
  userRolePermissionAPI: appApi("v1/user/role/permission"),
  userActivityAPI: appApi("v1/userActivity"),
  userAvatarUpdate: appApi("v1/user/updateAvatar"),
  activityTypeApi: appApi("v1/activityType"),

  // Admin API Routes
  companyAPI: appApi("v1/company"),
  productMediaAPI: appApi("v1/store/product/media"),
  portalAPI: appApi("v1/portal"),
  settingAPI: appApi("v1/setting"),

  // Store API Routes
  productAPI: appApi("v1/product"),
  customerAPI: appApi("v1/customer"),
  accountAPI: appApi("v1/account"),
  billAPI: appApi("v1/accounts/bill"),
  brandAPI: appApi("v1/product/brand"),
  inventoryAPI: appApi("v1/inventory"),
  categoryAPI: appApi("v1/product/category"),
  productTagAPI: appApi("v1/productTag"),
  locationAPI: appApi("v1/location"),
  storeProductAPI: appApi("v1/storeProduct"),
  itemAPI: appApi("accounts/bill/v1"),
  orderAPI: appApi("v1/order"),
  orderProductAPI: appApi("v1/orderProduct"),
  storeDasboardAPI: appApi("v1/dashboardRoute"),
  inventoryTransferAPI: appApi("v1/transfer"),

  // Account API Routes
  purchaseAPI: appApi("accounts/purchase/v1"),

  stockEntry: appApi("v1/stockEntry"),

  stockProductEntry: appApi("v1/stockProductEntry"),

  activityAPI: appApi("activity/v1"),

  transferProduct: appApi("v1/transfer/Product"),

  attendanceAPI: appApi("attendance/v1"),

  MessageAPI: appApi("v1/message"),

  UserAPI: appApi("user/v1"),

  ShiftAPI: appApi("v1/shift"),

  PermissionAPI: appApi("v1/user/role/permission"),

  MediaAPI: appApi("v1/media"),

  WishListAPI: appApi("v1/wishlist"),

  SaleSettlementAPI: appApi("v1/saleSettlement"),

  PurchaseAPI: appApi("v1/purchase"),

  PurchaseProductAPI: appApi("v1/purchaseProduct"),

  TransferTypeApi: appApi("v1/transferType"),

  StatusAPI: appApi("v1/status"),

  addressAPI: appApi("v1/address"),

  ActivityAPI: appApi('activity/v1'),

  ActivityTypeApi: appApi("v1/activityType"),

  TicketApi: appApi("v1/ticket"),

  FineApi: appApi("v1/fine"),

  UserDeviceInfoApi: appApi("v1/userDeviceInfo"),

  TransferTypeReasonAPI: appApi("v1/transferTypeReason"),

  SystemLogApi: appApi("v1/systemLog"),

  VisitorApi: appApi("v1/visitor"),

  ProductPrice: appApi("v1/productPrice"),

  CandidateProfile: appApi("candidate/v1"),

  Jobs: appApi("jobs/v1"),

  ReplenishApi: appApi("v1/replenish"),

  UserLocationApi: appApi("v1/userLocation"),

  PaymentApi: appApi("v1/payment"),
  
  PaymentAccountApi: appApi("v1/paymentAccount"),

  OrderReportAPI: appApi("v1/orderReport"),

  SettingAPI: appApi("v1/setting"),

  SyncApi: appApi("v1/sync"),
  
  projectAPI: appApi("v1/project"),

  orderSalesSettlementAPI: appApi("v1/orderSalesSettlementDiscrepancyReport"),



  // Custom Form API
  InspectionApi: appApi("v1/inspection"),

  CustomField: appApi("v1/customField"),

  CustomFieldValue: appApi("v1/customFieldValue"),

  TicketComment: appApi("v1/ticketComment"),

});