import { useCallback, useContext, useEffect, useState } from "react";
import { SiVitest, SiBitcomet } from "react-icons/si";
import DashboardLayout from "../../layout/page";
import { toast, ToastContainer } from "react-toastify";
import AuthContext from "../../../context/AuthContext";
import axiosInstance from "../../../utils/axiosinstance";

const TestingPage = () => {
  const { memberDetails } = useContext(AuthContext);
  const [testsData, setTestsData] = useState([]);
  const [customersData, setCustomersData] = useState([]);
  const [ratesData, setRatesData] = useState([]);
  const [cliRatesData, setCliRatesData] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("total");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
console.log(selectedCustomer);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Prepare the base API calls
        const apiCalls = [
          axiosInstance.get("api/customers"),
          // Conditional testrates API call
          memberDetails.role === 'salemember'
            ? axiosInstance.get(`api/member/getTestingRateByMemberId/${memberDetails.id}`)
            : axiosInstance.get("api/testrates"),
          axiosInstance.get("api/admin/ccrates"),
          axiosInstance.get("api/admin/clirates"),
        ];

        // Execute all API calls
        const [customersResponse, testsResponse, ratesResponse, cliRatesResponse] =
          await Promise.all(apiCalls);

        // Set the data
        setCustomersData(customersResponse.data?.customer || []);
        setTestsData(testsResponse.data?.testrate || []);
        setRatesData(ratesResponse.data?.ccrates || []);
        setCliRatesData(cliRatesResponse.data?.clirates || []);

      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to fetch data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [memberDetails.role, memberDetails.id]); // Add role to dependencies

  const applyFilters = useCallback(() => {
    let filtered = testsData
      .map((test) => {
        const customer = customersData.find(
          (customer) => customer?.id === test.userId
        );

        if (!customer) return null;

        if (test.serviceEngineer === "NOC CloudQlobe") {
          return {
            ...customer,
            testId: test.id,
            testStatus: test.testStatus,
            serviceEngineer: test.serviceEngineer,
          };
        }

        return null;
      })
      .filter(Boolean);

    if (activeTab === "initiated") {
      filtered = filtered.filter(
        (customer) => customer.testStatus === "Initiated"
      );
    } else if (activeTab === "failed") {
      filtered = filtered.filter(
        (customer) => customer.testStatus === "Failed"
      );
    }

    if (filterStatus) {
      filtered = filtered.filter(
        (customer) => customer.testStatus === filterStatus
      );
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (customer) =>
          customer.companyName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          customer.customerId
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    setFilteredData(filtered);
  }, [
    testsData,
    customersData,
    activeTab,
    filterStatus,
    searchTerm,
  ]);


  useEffect(() => {
    applyFilters();
  }, [applyFilters]);


  const openModal = (testId) => {
    const selectedTest = testsData.find((test) => test.id === testId);
console.log(selectedTest);
console.log(customersData);

    if (selectedTest) {
      let rates = [];

      try {
        // Parse the rateId if it's a string (as shown in your data)
        const rateIds = typeof selectedTest.rateId === 'string'
          ? JSON.parse(selectedTest.rateId)
          : selectedTest.rateId;

        if (selectedTest.rateType === "CCRate") {
          rates = ratesData.filter((rate) =>
            rateIds.some((r) => r._id === rate._id)
          );
        } else if (selectedTest.rateType === "CLIRate") {
          rates = cliRatesData.filter((rate) =>
            rateIds.some((r) => r._id === rate._id)
          );
        }
      } catch (error) {
        console.error("Error parsing rate data:", error);
      }

      const customer = customersData.find(
        (customer) => customer?.customerId === selectedTest.customerId
      );
console.log(customer);

      setSelectedCustomer({
        ...selectedTest,
        ...customer,
        rates: rates || []
      });
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCustomer(null);
  };

  const handlePickupData = async (testId) => {
    try {
      const serviceEngineer = memberDetails.name;
      const testStatus = 'Pending';

      // toast.info("Processing your request...", { autoClose: false });
      await Promise.all([
        axiosInstance.put(`api/member/updateMemberTest/${memberDetails.id}`, { testId }),
        axiosInstance.put(`api/member/tests/${testId}`, { serviceEngineer, testStatus })
      ]);

      // Update local state instead of reloading
      setTestsData(prevTests =>
        prevTests.map(test =>
          test.id === testId
            ? { ...test, serviceEngineer, testStatus }
            : test
        )
      );

      toast.success("Test picked up successfully!");
    } catch (error) {
      console.error("Error updating test:", error);
      toast.error("Failed to pick up test");
    }
  };

  const getTicketCount = (status) => {
    if (status === "total") return testsData.length;
    return testsData?.filter((test) => test.testStatus === status).length;
  };

  return (
    <DashboardLayout>
      <div className='p-6 bg-gray-50 text-gray-800'>
        <ToastContainer position="top-right" autoClose={5000} />

        <div className='flex items-center mb-6'>
          <SiVitest className='h-10 w-10 text-orange-500 mr-4' />
          <h2 className='text-3xl text-gray-500 font-default'>Testing Page</h2>
        </div>

        {/* Tabs Section */}
        <div className='flex justify-between mb-6'>
          {["total", "initiated", "failed"].map((status, index) => (
            <div
              key={status}
              className={`flex-1 ${index !== 0 ? "ml-4" : ""
                } bg-gradient-to-r ${status === "total"
                  ? "from-blue-400 to-blue-600"
                  : status === "initiated"
                    ? "from-green-400 to-green-600"
                    : "from-yellow-400 to-yellow-600"
                } text-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer`}
              onClick={() => setActiveTab(status)}>
              <h3 className='text-lg font-semibold'>
                {status === "total"
                  ? "Live"
                  : status === "initiated"
                    ? "Test Passed"
                    : "Test Failed"}
              </h3>
              <p className='text-4xl font-bold mt-2'>
                {getTicketCount(status)}
              </p>
            </div>
          ))}
        </div>

        {/* Filter and Search Section */}
        <div className='bg-white p-4 rounded-lg shadow-md flex justify-between items-center mb-6'>
          <div className='flex space-x-4'>
            <select
              className='p-2 bg-white border rounded shadow'
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="">All Statuses</option>
              <option value="Pending">Test Requested</option>
              <option value="In Progress"> Test Processing</option>
              <option value="Complete"> Test Completed</option>
              <option value="Failed"> Test Failed</option>
            </select>
            <button
              className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition'
              onClick={applyFilters}>
              Filter
            </button>
          </div>

          <div className='flex'>
            <input
              type='text'
              className='p-2 border rounded shadow'
              placeholder='Search by Customer ID or Company Name'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
            <p className="mt-2 text-gray-600">Loading data...</p>
          </div>
        ) : (
          /* Table Section */
          <div className='mt-6 p-6 bg-white shadow-md rounded-lg'>
            <table className='min-w-full bg-white'>
              <thead className='bg-[#005F73] text-white'>
                <tr>
                  <th className='py-2 px-4'>Customer ID</th>
                  <th className='py-2 px-4'>Company Name</th>
                  <th className='py-2 px-4'>Service Engineer</th>
                  <th className='py-2 px-4 text-center'>Status</th>
                  <th className='py-2 px-4'>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map((customer, index) => (
                    <tr
                      key={customer.testId}
                      className={index % 2 === 0 ? "bg-white" : "bg-gray-100"}>
                      <td className='py-2 px-4'>{customer.customerId}</td>
                      <td className='py-2 px-4'>{customer.companyName || "N/A"}</td>
                      <td className='py-2 px-4'>{customer.serviceEngineer || "NOC CloudQlobe"}</td>
                      <td className='py-2 px-4'>{customer.testStatus || "N/A"}</td>
                      <td className='py-2 px-4 text-right'>
                        <button
                          className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition mr-2'
                          onClick={() => openModal(customer.testId)}>
                          View
                        </button>
                        {["supportmember"].includes(memberDetails.role) && (
                          <button
                            className='bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition'
                            onClick={() => handlePickupData(customer.testId)}>
                            Pickup
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-4">
                      No tests found matching your criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && selectedCustomer && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'>
          <div className='bg-white p-6 rounded-lg shadow-lg w-2/3 max-h-[80vh] overflow-auto'>
            <div className='flex justify-between items-center mb-4'>
              <div className='flex items-center'>
                <SiBitcomet className='h-6 w-6 text-orange-500 mr-2' />
                <h3 className='text-xl font-default'>
                  Test Details
                </h3>
              </div>
              <button
                onClick={closeModal}
                className='text-gray-500 hover:text-gray-700 text-2xl'
              >
                &times;
              </button>
            </div>


            {/* Rates Information Section */}
            <div className='max-w-screen-xl mx-auto p-5'>
              <h4 className='font-semibold text-lg mb-2'>Rates Information</h4>
              <div className='min-w-full bg-white shadow-md rounded-lg overflow-x-auto'>
                <table className='min-w-full bg-white'>
                  <thead className='bg-indigo-500 text-white'>
                    <tr>
                      <th className='py-2 px-6 text-sm'>Country Code</th>
                      <th className='py-2 px-6 text-sm'>Country</th>
                      <th className='py-2 px-6 text-sm'>Price</th>
                      <th className='py-2 px-6 text-sm'>Description</th>
                      <th className='py-2 px-6 text-sm'>Profile</th>
                      <th className='py-2 px-6 text-sm'>Status</th>
                      <th className='py-2 px-6 text-sm'>Test Status</th>
                    </tr>
                  </thead>
                  <tbody className="text-center">
                    {selectedCustomer.rates.map((rate, index) => (
                      <tr
                        key={`${rate._id}-${index}`}
                        className={
                          index % 2 === 0 ? "bg-white" : "bg-gray-100"
                        }>
                        <td className='py-2 px-6 text-sm'>
                          {rate?.countryCode || "N/A"}
                        </td>
                        <td className='py-2 px-6 text-sm'>
                          {rate?.country || "N/A"}
                        </td>
                        <td className='py-2 px-6 text-sm'>
                          {rate?.rate || "N/A"}
                        </td>
                        <td className='py-2 px-6 text-sm'>
                          {rate?.qualityDescription || "N/A"}
                        </td>
                        <td className='py-2 px-6 text-sm'>
                          {rate?.profile || "N/A"}
                        </td>
                        <td className='py-2 px-6 text-sm'>
                          {rate?.status || "N/A"}
                        </td>
                        <td className='py-2 px-6 text-sm'>
                          {rate?.testStatus || "N/A"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default TestingPage;