import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import Layout from "../../../components/Layout";
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Button,
    ScrollView,
} from "react-native";
import Currency from "../../../components/Currency";
import Select from "../../../components/Select";
import AccountService from "../../../services/AccountService";
import storeService from "../../../services/StoreService";
import DatePicker from "../../../components/DatePicker";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import purchaseService from "../../../services/PurchaseService";
import Number from "../../../components/Number";
import FooterButtons from "../../../components/FooterButtons";
import DateTime from "../../../lib/DateTime";
import NextButton from "../../../components/NextButton";
import ObjectName from "../../../helper/ObjectName";
import Tab from "../../../components/Tab";
import TabName from '../../../helper/Tab';
import MediaList from "../../../components/MediaList";
import ProductCard from "../../../components/ProductCard";
import { SwipeListView } from "react-native-swipe-list-view";
import BarcodeScanner from "../../../components/BarcodeScanner";
import ProductEditModal from "../../../components/Modal/ProductEditModal";
import DeleteModal from "../../../components/Modal/DeleteModal";
import ConfirmationModal from "../../../components/Modal/ConfirmationModal";
import ProductSelectModal from "../../../components/Modal/ProductSelectModal";
import AlertMessage from "../../../helper/AlertMessage";
import purchaseProductService from "../../../services/PurchaseProductService";
import statusService from "../../../services/StatusServices";
import addressServices from "../../../services/AddressService";
import productService from "../../../services/ProductService";
import NoRecordFound from "../../../components/NoRecordFound";
import Search from "./Search";
import { Color } from "../../../helper/Color";
import ProductAdd from "../../../components/AddProduct";
import SaveButton from "../../../components/SaveButton";
import Media from "../../../helper/Media";
import mediaService from "../../../services/MediaService";
import VerticalSpace10 from "../../../components/VerticleSpace10";
import StoreSelect from "../../../components/StoreSelect";
import ShowMore from "../../../components/ShowMore";
import SyncService from "../../../services/SyncService";
import AccountSelect from "../../../components/AccountSelect";
import AddressSelect from "../../../components/AddressSelect";
import TextArea from "../../../components/TextArea";
import TextBox from "../../../components/TextBox";
import ProductPriceService from "../../../services/ProductPriceService"
import TextInput from "../../../components/TextInput";
const PurchaseForm = (props) => {
    const params = props?.route?.params?.item;
    const param = props?.route?.params
    const [vendorList, setVendorList] = useState();
    const [storeId, setStoreId] = useState();
    const [vendorName, setVendorName] = useState();
    const [accountName, setAccountName] = useState();
    const [netAmount, setNetAmount] = useState();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [date, setDate] = useState();
    const [status, setStatus] = useState();
    const [activeTab, setActiveTab] = useState(TabName.SUMMARY);
    const [purchaseProductList, setPurchaseProductList] = useState([]);
    const [selectedItem, setSelectedItem] = useState("");
    const [productDeleteModalOpen, setProductDeleteModalOpen] = useState(false);
    const [productEditModalOpen, setProductEditModalOpen] = useState(false);
    const [modalVisible, setScanModalVisible] = useState(false);
    const [scannedCode, setScannedCode] = useState("");
    const [scannedProductList, setScannedProductList] = useState("");
    const [productExistModalOpen, setProductExistModalOpen] = useState(false);
    const [quantityUpdateObject, setQuantityUpdateObject] = useState({});
    const [productNotFoundModalOpen, setProductNotFoundModalOpen] = useState(false);
    const [productSelectModalOpen, setProductSelectModalOpen] = useState(false);
    const [discrepancyAmountValue, setDiscrepancyAmount] = useState();
    const [addressList, setAddressList] = useState();
    const [billingName, setBillingName] = useState();
    const [clicked, setClicked] = useState("");
    const [addProductModalOpen, setAddProductModalOpen] = useState(false);
    const [brand, setBrand] = useState("");
    const [productName, setProductName] = useState("")
    const [mrp, setMrp] = useState("")
    const [barCode, setBarCode] = useState("")
    const [selectedQuantity, setSelectedQuantity] = useState("");
    const [newPurchase, setNewPurchase] = useState(param?.isNewPurchase)
    const [searchPhrase, setSearchPhrase] = useState("");
    const [MediaData, setMediaData] = useState([]);
    const [totalMedia, setTotalMedia] = useState([]);
    const [totalCount, setTotalCount] = useState(0)
    const [storeList, setStoreList] = useState([]);
    const [image, setImage] = useState(null);
    const [file, setFile] = useState(null);





    const isFocused = useIsFocused();
    const navigation = useNavigation();
    const stateRef = useRef(null);

    useEffect(() => {
        let mount = true;

        mount && AccountService.GetList(null, (callback) => { setVendorList(callback) })
        mount && addressServices.search({}, callback => { setAddressList(callback); })

        mount && getMediaList();

        //cleanup function
        return () => {
            mount = false;
        };
    }, [isFocused])

    useEffect(() => {
        if (isFocused) {
            getProducts();
        }
    }, [isFocused]);

    const preloadedValues = {
        amount: params?.amount || "",
        vendor_bill_number: params?.vendorBillNumber || "",
        Purchase_number: params?.purchaseNumber || "",
        discount_amount: params?.discount_amount || "",
        tax_amount: params?.tax_amount || "",
        discrepancy_amount: discrepancyAmountValue ? discrepancyAmountValue : params?.discrepancy_amount,
        description: params?.description || "",
        net_amount: params?.net_amount || "",
        purchaseing_name: params?.purchaseing_name || "",
        purchaseDate: params?.purchaseDate,
        payment_account: params?.payment_account,

    };

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: preloadedValues
    });

    const getMediaList = async () => {
        await mediaService.search(params?.id ? params?.id : param?.id, ObjectName.PURCHASE, callback => {

            setMediaData(callback.data.data);
            setTotalMedia(callback.data.totalCount);
        });
    };


    useEffect(() => {
        updateDateValues();
    }, [selectedItem]);

    const closeRow = (rowMap, rowKey) => {
        if (rowMap[rowKey]) {
            rowMap[rowKey].closeRow();
        }
    }

    const uploadImage = (productDetails, callback) => {

        if (productDetails && file) {

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

            data.append("object", ObjectName.PRODUCT);

            data.append("object_id", productDetails?.id);

            data.append("media_url", image);

            data.append("media_visibility", 1);

            data.append("feature", 1);

            mediaService.uploadMedia(navigation, data, (error, response) => {
                //reset the state
                setFile("");
                setImage("");
                return callback();
            })
        } else {
            return callback();
        }
    }

    const clearRowDetail = () => {
        if (stateRef) {
            const selectedItem = stateRef.selectedItem;
            const selectedRowMap = stateRef.selecredRowMap;
            if (selectedItem && selectedRowMap) {
                closeRow(selectedRowMap, selectedItem.id)
                setSelectedItem("");
                stateRef.selectedItem = "";
                stateRef.selecredRowMap = "";
            }
        }
    }

    const productEditModalToggle = () => {
        setProductEditModalOpen(!productEditModalOpen);
        clearRowDetail();
        setDate("")
    }

    const productDeleteModalToggle = () => {
        setProductDeleteModalOpen(!productDeleteModalOpen)
    }

    const addPurchaseProduct = async (quantity, scannedProduct) => {
        try {
            let bodyData = {
                purchaseId: params?.id ? params?.id : param.id,
                productId: scannedProduct?.product_id,
                quantity: quantity,
                storeId: params?.location ? params?.location : param.location,
                company_id: scannedProduct.company_id,
                manufactured_date: selectedDate ? selectedDate : ""
            };
            await purchaseProductService.create(bodyData, async (error, res) => {

                if (res && res.data) {

                    if (purchaseProductList != undefined) {

                        let purchaseProducts = [...purchaseProductList]

                        purchaseProducts.splice(0, 0, {
                            image: selectedItem.image,
                            name: selectedItem.name,
                            id: res.data && res.data.purchaseProductDetails ? res.data.purchaseProductDetails.id : null,
                            quantity: quantity,
                            product_id: selectedItem.product_id,
                            brand_name: selectedItem.brand,
                            sale_price: selectedItem.sale_price,
                            mrp: selectedItem.mrp,
                            manufactured_date: selectedDate ? selectedDate : ""
                        })

                        stateRef.purchaseProductList = purchaseProducts;

                        setTotalCount(purchaseProducts.length);

                        setPurchaseProductList(purchaseProducts)
                    }

                    setScanModalVisible(false);
                    setClicked("");
                    setDate("")
                }

            })

        } catch (err) {
            console.log(err);
        }
    };

    const AddProducts = async (values) => {

        try {
            let bodyData = {
                name: productName,
                brand_id: brand.value,
                brandName: brand.label,
                barcode: barCode ? barCode : scannedCode,
                mrp: mrp
            };
            productService.addProduct(navigation, bodyData, async (error, response) => {

                //validate response exist or not
                if (response && response.data && response.data.productDetails) {

                    let productDetails = response?.data?.productDetails;

                    productAddModalToggle()


                    //get the product details

                    //upload the image
                    uploadImage(productDetails, async () => {

                        productService.reindex(productDetails.id, () => {
                            SyncService.SyncProduct(null, productDetails.id, () => { })
                        })
                    })

                    let priceData = {
                        barCode: barCode ? barCode : scannedCode,
                        mrp: mrp,
                        salePrice: mrp,
                        productId: productDetails.id,
                    }

                    await ProductPriceService.create(priceData, (response) => {

                    })

                    let addProduct = {
                        product_id: productDetails.id,
                        company_id: productDetails.company_id
                    }

                    await addPurchaseProduct(selectedQuantity, addProduct)

                }
            });
        } catch (err) {
            console.log(err);
        }
    };

    const onScanAction = async (selectedProduct) => {
        try {
            const purchaseProductList = stateRef?.purchaseProductList;

            let AddProduct = {
                image: selectedProduct?.featured_media_url,
                brand: selectedProduct?.brand_name,
                name: selectedProduct?.product_name,
                size: selectedProduct?.size,
                unit: selectedProduct?.unit,
                sale_price: selectedProduct?.sale_price,
                mrp: selectedProduct?.mrp,
                product_id: selectedProduct?.product_id,
                isAdding: true
            }

            //validate already added product list
            if (purchaseProductList && purchaseProductList.length > 0) {

                //find the product already exist or not
                let productExist = purchaseProductList.find((data) => data.product_id == selectedProduct.product_id);

                //validate product exist or not
                if (productExist) {

                    //get the updated quantity
                    let updatedQuantity = productExist?.quantity ? productExist?.quantity + 1 : 1;

                    //create return object
                    let returnObject = {
                        updatedQuantity: updatedQuantity,
                        product: productExist,
                        product_id: selectedProduct?.product_id
                    }

                    //set moda visiblity
                    setProductExistModalOpen(true);

                    setSelectedItem(returnObject.product)

                    //update quantity update object
                    setQuantityUpdateObject(returnObject);
                    setSearchPhrase("")
                    setDate("")
                }
                else {
                    productEditModalToggle()
                    setSelectedItem(AddProduct);
                    stateRef.selectedItem = selectedProduct;
                    setSearchPhrase("")

                }
            }
            else {
                //add invenotry product
                productEditModalToggle()
                setSelectedItem(AddProduct);
                stateRef.selectedItem = selectedProduct;
                setSearchPhrase("")

            }
        } catch (err) {
            setSearchPhrase("")

        }

    }

    const productOnClick = async (selectedProduct) => {

        const updatedPriceProductList = await productService.getProductUpdatedPrice(null, selectedProduct.product_id);

        if (updatedPriceProductList && updatedPriceProductList.length == 1) {

            onScanAction(updatedPriceProductList[0]);

        } else if (updatedPriceProductList && updatedPriceProductList.length > 1) {

            //set store product list
            setScannedProductList(updatedPriceProductList);

            setProductSelectModalOpen(true);

        }
    }

    const syncAction = async (barCode) => {

        const updatedPriceProductList = await productService.getProductUpdatedPrice(barCode);

        if (updatedPriceProductList && updatedPriceProductList.length == 1) {

            onScanAction(updatedPriceProductList[0]);

        } else if (updatedPriceProductList && updatedPriceProductList.length > 1) {

            //set store product list
            setScannedProductList(updatedPriceProductList);

            setProductSelectModalOpen(true);

        } else {
            productNotFoundToggle();
        }
    }

    const handleScannedData = async (data) => {
        try {

            setScanModalVisible(false);

            //get bar code
            let barCode = data?.data;

            //validate bar code exist and loading
            if (barCode) {

                //set scanned code
                setScannedCode(barCode);

                const updatedPriceProductList = await productService.getProductUpdatedPrice(barCode);


                if (updatedPriceProductList && updatedPriceProductList.length == 1) {

                    onScanAction(updatedPriceProductList[0]);

                } else if (updatedPriceProductList && updatedPriceProductList.length > 1) {

                    //set store product list
                    setScannedProductList(updatedPriceProductList);

                    setProductSelectModalOpen(true);

                } else {
                    SyncService.SyncProduct(barCode, null, (response) => {
                        syncAction(barCode);
                    })
                }

            }
        } catch (err) {
            console.log(err);
        }
    };

    const addNew = () => {
        setScanModalVisible(true);
    }


    const onDateSelect = (value) => {
        setSelectedDate(new Date(value));
        setDate(new Date(value))

    }

    const getProducts = async () => {
        let props = { sort: 'createdAt', sortDir: "DESC", purchaseId: params?.id ? params?.id : param.id, storeId: params?.location ? params?.location : param?.location, pagination: false };
        await purchaseProductService.search(props, (error, purchaseProductList, totalCount) => {
            setTotalCount(totalCount)
            stateRef.purchaseProductList = purchaseProductList;
            setPurchaseProductList(purchaseProductList);

        });
    }

    const renderItem = data => {
        let item = data?.item;

        return (

            <View style={styles.container}>
                <View>
                    {item && (
                        <ProductCard
                            size={item.size}
                            unit={item.unit}
                            name={item.name}
                            image={item.image}
                            brand={item.brand_name}
                            sale_price={item.sale_price}
                            mrp={item.mrp}
                            id={item.id}
                            item={item}
                            quantity={item.quantity}
                            QuantityField
                            editable
                        />
                    )}
                </View>
            </View>
        );
    };

    const renderHiddenItem = (data, rowMap) => {
        return (
            <View style={styles.swipeStyle}>
                <TouchableOpacity
                    style={[styles.productDelete]}
                    onPress={() => {
                        setSelectedItem(data?.item);
                        stateRef.selectedItem = data?.item;
                        stateRef.selecredRowMap = rowMap;
                        setProductDeleteModalOpen(true);
                    }}
                >
                    <Text style={styles.btnText}>Delete</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.productEdit]}
                    onPress={() => {
                        productEditModalToggle()
                        setSelectedItem(data?.item);
                        stateRef.selectedItem = data?.item;
                        stateRef.selecredRowMap = rowMap;
                    }}
                >
                    <Text style={styles.btnText}>Edit</Text>
                </TouchableOpacity>
            </View>
        )
    };

    const updatedQuantity = async (quantity) => {
        if (selectedItem.isAdding) {
            await addPurchaseProduct(quantity, selectedItem)
        } else {
            await updatePurchaseProduct(quantity, selectedItem?.stockEntryProductId);
        }
    }

    const updateProduct = async () => {
        if (quantityUpdateObject) {
            // update the quantity
            await updatePurchaseProduct(quantityUpdateObject.updatedQuantity, quantityUpdateObject.stockEntryProductId, quantityUpdateObject.unit_price);
        }
    }

    const updatePurchaseProduct = async (quantity) => {
        try {
            //validate quantity exist or not
            //create update quantity object
            let updateObject = { quantity: quantity, purchaseId: params?.id ? params?.id : param.id, manufactured_date: selectedDate };

            purchaseProductService.update(updateObject, selectedItem?.id, (error, response) => {
                setProductExistModalOpen(false);
                getProducts();
                setClicked("");
            })


        } catch (err) {
            console.log(err);
        }
    };

    const deletePurchaseProduct = async (item) => {
        if (item && item.id) {
            purchaseProductService.delete(item.id, async () => {
                await getProducts();
                clearRowDetail();
            });
        }
    }

    const updateDateValues = () => {
        let date = params?.purchaseDate;
        if (date) {
            setSelectedDate(new Date(date));
        }
        let manufactured_date = selectedItem.manufactured_date
        if (manufactured_date) {
            setDate(new Date(manufactured_date));
        }
    }
    const productFooter = (
        <>


            <View style={{ flex: 0.5, justifyContent: "center", alignItems: "center", marginLeft: 2 }}>
                {!searchPhrase && (
                    <View style={{ width: "100%", }}>
                        <Button title={"Scan"} color={Color.COMPLETE}
                            onPress={() => { addNew() }}
                        />
                    </View>
                )}
            </View>


        </>
    )


    const AddPurchase = (values) => {
        const createData = {
            date: selectedDate,
            payment_account: accountName.label,
            purchasing_name: values.purchaseing_name,
            vendor_purchase_number: values.vendor_bill_number,
            amount: values.amount,
            description: values.description,
            location: storeId,
            vendor_name: vendorName.label,
            discount_amount: values.discount_amount,
            net_amount: netAmount ? netAmount : "",
        };
        purchaseService.createPurchase(createData, (err, res) => {
            let id = res.data.purchase.id
            navigation.navigate("MediaList", { id: id, object: ObjectName.PURCHASE })
        })
    }

    const updatePurchase = (values) => {
        const updateData = {
            date: DateTime.formattedfDate(selectedDate, "DD-MMM-YYYY hh:mm A"),
            billNumber: values?.bill_number ? values?.bill_number : params?.bill,
            billing_name: billingName ? billingName : params?.purchaseing_name ? params?.purchaseing_name : params?.purchaseing_name,
            vendor_invoice_number: values?.vendor_bill_number,
            order_number: values?.order_number,
            payment_account: accountName ? accountName.label : params?.payment_account,
            description: values.description,
            location: storeId ? storeId : params?.location ? params?.location : param.location,
            vendor_id: vendorName ? vendorName.value : params?.vendor_id ? params?.vendor_id : param?.vendor_id,
            status: status,
            net_amount: netAmount ? netAmount : params?.net_amount,
        }
        purchaseService.updatePurchase(params?.id ? params?.id
            : param.id, updateData, (callback) => {
                if (params) {
                    setActiveTab(TabName.PRODUCTS)
                } else {
                    navigation.navigate("Purchase")
                }
            })
    }

    const toggle = () => {
        setScanModalVisible(!modalVisible)
    }
    const productExistModalToggle = () => {
        setProductExistModalOpen(!productExistModalOpen);
        setClicked("");
    }

    const productNotFoundToggle = () => {
        setProductNotFoundModalOpen(!productNotFoundModalOpen);
        setClicked("")
    }

    const productSelectModalToggle = () => {
        setProductSelectModalOpen(!productSelectModalOpen);
        setClicked("")
    }

    const handleBilllingNameChange = (label) => {
        setBillingName(label)
    }

    const productAddModalToggle = () => {
        setAddProductModalOpen(!addProductModalOpen);
        setFile("")
        setImage("")
        setMrp("")
        setProductName("")
        setBrand("")
        setBarCode("")
    }

    const onNetAmountChange = (value) => {
        setNetAmount(value)
    };

    const handleBrandChange = (value) => {
        setBrand(value)
    }
    const handleProductName = (value) => {
        setProductName(value)
    }
    const handleMrpChange = (value) => {
        setMrp(value)
    }
    const handleBarcodeChange = (value) => {
        setBarCode(value)
    }

    const quantityOnChange = (value) => {
        setSelectedQuantity(value)
    }

    const content = (
        <DatePicker
            title="Manufacturing Date"
            onDateSelect={onDateSelect}
            selectedDate={date}
        />
    )

    const takePicture = async (e) => {
        const image = await Media.getImage();
        if (image && image.assets) {
            const response = await fetch(image.assets[0].uri);
            const blob = await response.blob();
            await Media.uploadImage(params?.id ? params?.id : param?.id, blob, image.assets[0].uri, ObjectName.PURCHASE, null, null, async (response) => {
                if (response) {
                    getMediaList();
                }
            })
        }
    };

    const updateState = () => {
        setActiveTab(TabName.SUMMARY)
        setNewPurchase(false)
    }

    const addProduct = () => {
        setAddProductModalOpen(true)
        productNotFoundToggle()
    }
    const Attachment = () => (
        <MediaList
            mediaData={MediaData}
            getMediaList={getMediaList}
        />
    )
    const Products = () => (
        <>
            <BarcodeScanner
                toggle={toggle}
                modalVisible={modalVisible}
                id={params?.id ? params?.id : param?.id}
                handleScannedData={handleScannedData} />
            <DeleteModal
                modalVisible={productDeleteModalOpen}
                toggle={productDeleteModalToggle}
                item={selectedItem}
                updateAction={deletePurchaseProduct} />
            <ConfirmationModal
                toggle={productExistModalToggle}
                modalVisible={productExistModalOpen}
                title={AlertMessage.PRODUCT_ALREADY_EXIST}
                description={AlertMessage.QUANTITY_INCREASE_MESSSAGE}
                confirmLabel={"Confirm"}
                cancelLabel={"Cancel"}
                scanProduct={selectedItem}
                ConfirmationAction={updateProduct}
                CancelAction={productExistModalToggle}
            />
            <ConfirmationModal
                toggle={productNotFoundToggle}
                modalVisible={productNotFoundModalOpen}
                title={AlertMessage.PRODUCT_NOT_FOUND}
                description={`BarCode ID '${scannedCode}' not found please scan different code or add the product`}
                confirmLabel={"Add New"}
                cancelLabel={"Cancel"}
                CancelAction={productNotFoundToggle}
                ConfirmationAction={() => addProduct()} />
            <ProductSelectModal
                modalVisible={productSelectModalOpen}
                toggle={productSelectModalToggle}
                items={scannedProductList}
                updateAction={onScanAction} />


            {!searchPhrase && purchaseProductList && purchaseProductList.length == 0 && (
                <NoRecordFound iconName={"receipt"} styles={{ paddingVertical: 250, alignItems: "center" }} />
            )}
        </>
    )
    const FooterContent = (
        params || param ? !newPurchase ? ""
            : <SaveButton onPress={handleSubmit(values => { updatePurchase(values) })} /> :
            <NextButton onPress={handleSubmit((values) => AddPurchase(values))} />)
    const AttachmentFooter = (
        <NextButton onPress={(e) => { newPurchase ? updateState() : setActiveTab(TabName.PRODUCTS) }} />)

    const updateValue = () => {
        activeTab === TabName.ATTACHMENTS ? setActiveTab(TabName.PRODUCTS) : navigation.navigate("Purchase")
    }

    return (
        <Layout
            title={params || param ? `Purchase# ${params?.purchaseNumber ? params?.purchaseNumber : param?.purchaseNumber}` : 'Add Purchase'}
            FooterContent={
                activeTab === TabName.SUMMARY && FooterContent ? activeTab === TabName.SUMMARY && FooterContent : activeTab === TabName.PRODUCTS ? productFooter : newPurchase && AttachmentFooter}
            showBackIcon
            backButtonNavigationUrl="Purchase"
            buttonLabel={activeTab === TabName.ATTACHMENTS ? "Upload" : activeTab === TabName.PRODUCTS && newPurchase ? "Next" : ""}
            buttonOnPress={(e) => activeTab === TabName.ATTACHMENTS ? takePicture(e) : setActiveTab(TabName.ATTACHMENTS)
            }
            buttonLabel2={(!newPurchase && activeTab === TabName.SUMMARY ? "Save" : "")}
            button2OnPress={handleSubmit(values => { updatePurchase(values) })} onPressCancel={() => { !newPurchase && navigation.navigate("Purchase") }}
            updateValue={newPurchase ? updateValue : false}
        >

            <ScrollView
                keyboardShouldPersistTaps="handled"
            >

                <View style={styles.tabBar}>
                    {newPurchase && activeTab !== TabName.ATTACHMENTS && (
                        <>
                            <Tab
                                title={TabName.SUMMARY}
                                isActive={activeTab === TabName.SUMMARY}
                                onPress={() => setActiveTab(TabName.SUMMARY)}
                            />

                            <Tab
                                title={`${TabName.PRODUCTS} (${totalCount || 0})`}
                                isActive={activeTab === TabName.PRODUCTS}
                                onPress={() => setActiveTab(TabName.PRODUCTS)}
                            />
                        </>
                    )}


                    {!newPurchase && (
                        <>
                            <Tab
                                title={TabName.SUMMARY}
                                isActive={activeTab === TabName.SUMMARY}
                                onPress={() => setActiveTab(TabName.SUMMARY)}
                            />
                            <Tab
                                title={`${TabName.PRODUCTS} (${totalCount || 0})`}
                                isActive={activeTab === TabName.PRODUCTS}
                                onPress={() => setActiveTab(TabName.PRODUCTS)}
                            />
                            <Tab
                                title={`${TabName.ATTACHMENTS} (${totalMedia || 0})`}
                                isActive={activeTab === TabName.ATTACHMENTS}
                                onPress={() => setActiveTab(TabName.ATTACHMENTS)}
                            />
                        </>
                    )}
                </View>
                {activeTab === TabName.SUMMARY && newPurchase && (
                    <View >
                        <DatePicker
                            title="Date"
                            onDateSelect={onDateSelect}
                            selectedDate={selectedDate ? selectedDate : params?.purchaseDate}
                            style={styles.input}
                            divider
                        />
                        <VerticalSpace10 paddingTop={5} />
                        <AccountSelect
                            label="Vendor"
                            store="vendor"
                            options={vendorList}
                            control={control}
                            showBorder={false}
                            data={param?.vendor_id ? param?.vendor_id : params?.vendor_id}
                            getDetails={(value) => setVendorName(value)}
                            placeholder="Select Vendor"

                        />

                        <VerticalSpace10 paddingTop={5} />

                        <TextInput
                            title="Vendor Invoice# "
                            name="vendor_bill_number"
                            control={control}
                            showBorder={false}
                            divider
                        />
                        <VerticalSpace10 paddingTop={5} />

                        <AddressSelect
                            label="Billing Name"
                            name="billing_name"
                            options={addressList}
                            control={control}
                            showBorder={false}
                            data={params?.purchaseing_name ? params?.purchaseing_name : params?.purchaseing_name}
                            placeholder="Select Billing Name"
                            onChange={handleBilllingNameChange}


                        />
                        <VerticalSpace10 paddingTop={5} />
                        <StoreSelect
                            label="Location"
                            name="location"
                            onChange={(value) => { setStoreId(value) }}
                            options={storeList}
                            showBorder={false}
                            divider
                            data={params?.location ? params?.location : param?.location}
                            control={control}
                            placeholder="Select Location"


                        />
                        <VerticalSpace10 paddingTop={5} />
                        <Currency
                            title="Net Amount"
                            name="net_amount"
                            control={control}
                            showBorder={false}
                            edit
                            divider
                            onInputChange={onNetAmountChange}
                            values={netAmount ? netAmount.toString() : ""}
                        />
                        <VerticalSpace10 paddingTop={5} />
                        <TextArea
                            name="description"
                            title="Description"
                            control={control}
                            showBorder={false}
                            divider
                            style={styles.input}
                        />
                    </View>
                )}


                {activeTab === TabName.SUMMARY && !newPurchase && (
                    <View style={{ flex: 1 }}>

                        <View style={{ marginTop: 10, padding: 10 }}>
                            <DatePicker
                                title="Date"
                                onDateSelect={onDateSelect}
                                selectedDate={selectedDate ? selectedDate : params?.purchaseDate}
                            />
                            <VerticalSpace10 />

                            <Select
                                label="Vendor"
                                store="vendor"
                                options={vendorList}
                                control={control}
                                data={param?.vendor_id ? param?.vendor_id : params?.vendor_id}
                                getDetails={(value) => setVendorName(value)}
                                placeholder="Select Vendor"

                            />
                            <VerticalSpace10 />

                            <TextInput
                                title="Vendor Invoice# "
                                name="vendor_bill_number"
                                control={control}
                            />
                            <VerticalSpace10 />

                            <Select
                                label="Billing Name"
                                name="billing_name"
                                options={addressList}
                                control={control}
                                data={params?.purchaseing_name}
                                placeholder="Select Billing Name"
                                OnSelect={handleBilllingNameChange}

                            />
                            <VerticalSpace10 />

                            <StoreSelect
                                label="Location"
                                name="location"
                                onChange={(value) => { setStoreId(value) }}
                                data={params?.location ? params?.location : param?.location}
                                control={control}
                                placeholder="Select Location"

                            />
                            <VerticalSpace10 />


                            <Currency
                                title="Net Amount"
                                name="net_amount"
                                control={control}
                                edit
                                onInputChange={onNetAmountChange}
                                values={netAmount ? netAmount.toString() : ""}
                            />

                            <VerticalSpace10 />

                            <TextBox name="description" title="Description" control={control} />
                        </View>


                    </View>
                )}

                {activeTab === TabName.ATTACHMENTS && (
                    <Attachment />
                )}
                {activeTab === TabName.PRODUCTS && (
                    <>
                        <Search
                            productOnClick={productOnClick}
                            setClicked={setClicked}
                            clicked={clicked}
                            searchPhrase={searchPhrase}
                            setSearchPhrase={setSearchPhrase}
                        />
                        {!searchPhrase && (
                            <SwipeListView
                                data={purchaseProductList}
                                renderItem={renderItem}
                                renderHiddenItem={renderHiddenItem}
                                rightOpenValue={-150}
                                previewOpenValue={-40}
                                previewOpenDelay={3000}
                                disableRightSwipe={true}
                                closeOnRowOpen={true}
                                keyExtractor={item => String(item.id)}
                            />
                        )}
                        <Products />
                        {addProductModalOpen && (
                            <ProductAdd
                                button1Label={"Add"}
                                button2Label={"Cancel"}
                                toggle={productAddModalToggle}
                                modalVisible={addProductModalOpen}
                                title={"Add Product"}
                                barcode={scannedCode}
                                image={image}
                                setFile={setFile}
                                setImage={setImage}
                                OnSelect={handleBrandChange}
                                onInputChange={handleProductName}
                                content={content}
                                onMrpChange={handleMrpChange}
                                quantityOnChange={quantityOnChange}
                                handleBarcodeChange={handleBarcodeChange}
                                button1Press={() => AddProducts()}
                            />
                        )}
                        {productEditModalOpen && (
                            <ProductEditModal
                                modalVisible={productEditModalOpen}
                                toggle={productEditModalToggle}
                                item={selectedItem}
                                content={content}
                                updateAction={updatedQuantity}
                                CancelAction={() => productEditModalToggle()}
                                quantityOnChange={updatedQuantity} />
                        )}

                    </>
                )}

            </ScrollView>
        </Layout>


    )
}
export default PurchaseForm

const styles = StyleSheet.create({
    container: {
        flex: 1,
        overflow: "scroll",
        backgroundColor: "#fff",
    },
    productImage: {
        width: 30,
        height: 30,
        borderRadius: 5,
        borderWidth: 2,
    },
    productImage: {
        width: 30,
        height: 30,
        borderRadius: 5,
        borderWidth: 2,
    },
    swipeStyle: {
        flex: 1,

    },
    actionDeleteButton: {
        alignItems: 'center',
        bottom: 10,
        justifyContent: 'center',
        position: 'absolute',
        top: 16,
        width: 70,
        backgroundColor: '#D11A2A',
        right: 7
    },
    btnText: {
        color: Color.WHITE,
    },
    productEdit: {
        alignItems: 'center',
        bottom: 10,
        justifyContent: 'center',
        position: 'absolute',
        top: 10,
        width: 70,
        backgroundColor: 'grey',
        right: 0
    },
    tabBar: {
        flexDirection: 'row',
        height: 50,
        backgroundColor: Color.WHITE,
        borderBottomWidth: 1,
        borderBottomColor: Color.LIGHT_GRAY,
    },
    productDelete: {
        alignItems: 'center',
        bottom: 10,
        justifyContent: 'center',
        position: 'absolute',
        top: 10,
        width: 70,
        backgroundColor: '#D11A2A',
        right: 70
    },
    input: {
        color: "black",
        height: 50,
        width: "100%",
        padding: 10,
        borderColor: "#dadae8",
    },

});