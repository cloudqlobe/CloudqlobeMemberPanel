import React, { useContext, useState } from "react";
import Layout from "../../../layout/page"; // Import Layout component
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { FaFileUpload } from "react-icons/fa";
import AuthContext from "../../../../context/AuthContext";
import axiosInstance from "../../../../utils/axiosinstance";

const VendorForm = () => {
  const { memberDetails } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("details");
  const [carrierId, setCarrierId] = useState("");
  const [accountManager, setAccountManager] = useState("");
  const [serviceCategory, setServiceCategory] = useState("CCRoutes");
  const [carrierType, setCarrierType] = useState("postpaid");
  const [image, setImage] = useState(null);
  const [accountAssociate, setAccountAssociate] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("USDT");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [priority, setPriority] = useState("Low");
  const [usdtLink, setUsdtLink] = useState("");
  const [description, setDescription] = useState("");

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
  };

  const handleFileChange = (img) => {
    const selectedImage = img.target.files[0];
    setImage(selectedImage);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // validate required feilds

      if (
        !carrierId ||
        !accountManager ||
        !serviceCategory ||
        !carrierType ||
        !accountAssociate ||
        !paymentMethod ||
        !paymentAmount ||
        !priority ||
        !description
      ) {
        toast.error("All fields are required");
        return;
      }

      if (paymentMethod === "USDT" && !usdtLink) {
        toast.error("USDT payment requires a valid USDT link");
        return;
      }

      const formData = new FormData();
      formData.append("carrierId", carrierId);
      formData.append("accountManager", accountManager);
      formData.append("serviceCategory", serviceCategory);
      formData.append("carrierType", carrierType);
      formData.append("image", image);  // Ensure this is handled properly
      formData.append("accountAssociate", accountAssociate);
      formData.append("paymentMethod", paymentMethod);
      formData.append("paymentAmount", paymentAmount);
      formData.append("priority", priority);
      formData.append("usdtLink", usdtLink);
      formData.append("description", description);
      formData.append("memberId", memberDetails.id);

      const response = await axiosInstance.post(
        "api/member/VendorCreate",
        formData,

      );

      if (response.status === 201) {
        toast.success("Vendor created successfully");
        setCarrierId("");
        setAccountManager("");
        setCarrierType("");
        setPaymentAmount("");
        setPaymentMethod("");
        setImage(null);
        setAccountAssociate("");
        setPriority("");
        setUsdtLink("");
        setDescription("");

      } else {
        toast.error('Failed to add Transaction')

      }
    } catch (error) {
      toast.error(error);

    }
  };

  return (
    <Layout>
      <div className="flex items-center justify-center min-h-[100vh] p-4">
        {" "}
        {/* Increased height to 100vh */}
        <div className="max-w-[1200px] min-h-[85vh] w-full bg-white shadow-lg rounded-lg flex">
          {" "}
          {/* Increased width */}
          {/* Static Cover Image */}
          <div className="w-1/2 p-4 flex justify-center items-center">
            <div
              className="bg-cover bg-center rounded-lg"
              style={{
                backgroundImage: `url('/member/VendorImage.avif')`,
                height: "450px",
                width: "500px",
              }}
            >
              {/* Cover Image */}
            </div>
          </div>
          <div className="w-1/2 p-9">
            {/* Tab Navigation */}
            <div className="flex justify-between border-b mb-6">
              <button
                onClick={() => handleTabSwitch("details")}
                className={`py - 3 px-6 font-semibold ${activeTab === "details"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600"
                  }`}
              >
                Carrier Details
              </button>
              <button
                onClick={() => handleTabSwitch("payment")}
                className={`py - 3 px-6 font-semibold ${activeTab === "payment"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600"
                  }`}
              >
                Payment Details
              </button>
            </div>

            {/* Details Form */}
            {activeTab === "details" && (
              <form className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Carrier ID
                    </label>
                    <input
                      type="text"
                      className="mt-2 block w-full border border-gray-300 rounded-md shadow-sm px-4 py-3"
                      value={carrierId}
                      onChange={(e) => setCarrierId(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Account Manager
                    </label>
                    <input
                      type="text"
                      className="mt-2 block w-full border border-gray-300 rounded-md shadow-sm px-4 py-3"
                      value={accountManager}
                      onChange={(e) => setAccountManager(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Service Category{" "}
                    </label>
                    <select
                      className="mt-2 block w-full border border-gray-300 rounded-md shadow-sm px-4 py-3"
                      value={serviceCategory}
                      onChange={(e) => setServiceCategory(e.target.value)}
                    >
                      <option value="CCRoutes">CC Routes</option>
                      <option value="CLIRoutes">CLI Routes</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Account Associate
                    </label>
                    <input
                      type="text"
                      className="mt-2 block w-full border border-gray-300 rounded-md shadow-sm px-4 py-3"
                      value={accountAssociate}
                      onChange={(e) => setAccountAssociate(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Carrier Type{" "}
                    </label>
                    <select
                      className="mt-2 block w-full border border-gray-300 rounded-md shadow-sm px-4 py-3"
                      value={carrierType}
                      onChange={(e) => setCarrierType(e.target.value)}
                    >
                      <option value="postpaid">postpaid</option>
                      <option value="prepaid">prepaid</option>
                    </select>
                    <div className="mt-6">
                      <div className="flex items-center space-x-4">
                        <FaFileUpload className="text-gray-600 text-2xl" />
                        <div className="flex flex-col w-full">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleTabSwitch("payment")}
                  className="bg-blue-500 text-white px-12 py-3 rounded-md mt-6"
                >
                  Next
                </button>
              </form>
            )}

            {/* Payment Form */}
            {activeTab === "payment" && (
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Payment Method{" "}
                    </label>

                    <select
                      className="mt-2 block w-full border border-gray-300 rounded-md shadow-sm px-4 py-3"
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    >
                      <option value="USDT">USDT</option>
                      <option value="BANK">BANK</option>
                      <option value="RouteExchange">Route Exchange</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Payment Amount
                    </label>
                    <input
                      type="number"
                      className="mt-2 block w-full border border-gray-300 rounded-md shadow-sm px-4 py-3"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">


                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      priority{" "}
                    </label>

                    <select
                      className="mt-2 block w-full border border-gray-300 rounded-md shadow-sm px-4 py-3"
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      USDT LINK
                    </label>
                    <input
                      type="text"
                      className="mt-2 block w-full border border-gray-300 rounded-md shadow-sm px-4 py-3"
                      value={usdtLink}
                      onChange={(e) => setUsdtLink(e.target.value)}
                    />
                  </div>
                  {/* Increased width for description box */}
                  <div className="col-span-2">
                    {" "}
                    {/* Make it span across both columns */}
                    <label className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="mt-2 block w-full border border-gray-300 rounded-md shadow-sm px-7 py-3"
                      style={{
                        minHeight: "120px", // Optional: Adjust the height for visual appeal
                        width: "100%", // Ensure the textarea spans the full width of the parent
                      }}
                    ></textarea>
                  </div>
                </div>

                <button
                  type="submit"
                  className="bg-green-500 text-white px-12 py-3 rounded-md mt-6"
                >
                  Finish
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
      <ToastContainer />
    </Layout>
  );
};

export default VendorForm;