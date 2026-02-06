import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CCRateModal from './ccRate';
import CliRateModal from './cliRate';
import axiosInstance from '../../../../../../utils/axiosinstance';

const PrivateRatePage = ({ customerId }) => {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [testsData, setTestsData] = useState([]);
    const [customerData, setCustomerData] = useState(null);
    const [showCheckboxes, setShowCheckboxes] = useState(false); // Controls whether checkboxes are visible
    const [selectedRates, setSelectedRates] = useState([]);
    const [currentRateType, setCurrentRateType] = useState('CCPrivateRate');
    const [ccRatesData, setCCRatesData] = useState([]);
    const [cliRatesData, setCLIRatesData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dataNotFound, setDataNotFound] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [cliModalOpen, setCLIModalOpen] = useState(false);
    const [testPrivateRate, setTestPrivateRate] = useState(false);

    useEffect(() => {
        const fetchCustomerData = async () => {

            if (customerId) {
                try {
                    const response = await axiosInstance.get(`api/customer/${customerId}`);
                    const customer = response.data.customer;
                    setCustomerData(customer)
                } catch (error) {
                    console.error('Error fetching customer data:', error);
                }
            }
        };
        fetchCustomerData();
    }, [customerId]);

    useEffect(() => {
        const fetchRatesAndTests = async () => {

            if (!customerData) return;

            if (customerId) {
                try {
                    const ccRatesResponse = await axiosInstance.get(`api/member/private_ccrates/${customerId}`);
                    const cliRatesResponse = await axiosInstance.get(`api/member/private_clirates/${customerId}`);
                    const testsResponse = await axiosInstance.get(`api/member/test_privateRate/${customerId}`);

                    const ccRates = ccRatesResponse.data.ccrate || [];
                    const cliRates = cliRatesResponse.data.clirate || [];
                    const tests = testsResponse.data?.rate || [];

                    const parsedRates = tests.map(test => ({
                        ...test,
                        rateId: safeJsonParse(test.rateId) // Use helper function to prevent errors
                    }));

                    setCCRatesData(ccRates);
                    setCLIRatesData(cliRates);
                    setTestsData(parsedRates);

                } catch (error) {
                    console.error('Error fetching rates or tests:', error);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchRatesAndTests();
    }, [customerData, testPrivateRate, customerId]);

    const safeJsonParse = (str) => {
        try {
            return str ? JSON.parse(str) : []; // Return empty array if parsing fails
        } catch (e) {
            console.error("Invalid JSON format:", str);
            return []; // Return empty array on error
        }
    };

    useEffect(() => {
        setDataNotFound(!ccRatesData.length && !cliRatesData.length);
    }, [ccRatesData, cliRatesData]);

    const handleAddCCRate = async (ccrates) => {
        const cc_PrivateRate = { ...ccrates, customerId: customerId };
        try {
            await axiosInstance.post("api/member/private_ccrates", cc_PrivateRate);

            setCCRatesData(prevRates => [...prevRates, cc_PrivateRate]);
            toast.success("CC Rate added successfully!");
            setModalOpen(false);
        } catch (error) {
            console.error("Error adding/updating CC rate:", error);
            toast.error("Failed to add CC Rate.");
        }
    };

    const handleAddLead = async (clirates) => {
        const cli_PrivateRate = { ...clirates, customerId: customerId };
        try {
            await axiosInstance.post("api/member/private_clirates", cli_PrivateRate);

            setCLIRatesData(prevRates => [...prevRates, cli_PrivateRate]);
            toast.success("CLI Rate added successfully!");
            setCLIModalOpen(false);

        } catch (error) {
            console.error("Error adding/updating CLI rate:", error);
            toast.error("Failed to add CLI Rate.");
        }
    };

    const handleCheckboxChange = (rate) => {
        setSelectedRates(prevSelectedRates => {
            if (prevSelectedRates.some(item => item._id === rate._id)) {
                return prevSelectedRates.filter(item => item._id !== rate._id);
            } else {
                return [...prevSelectedRates, rate._id];
            }
        });
    };

    const handleRequestTest = async () => {
        try {
            const requestPromises = axiosInstance.post(`api/member/test_privateRate`, {
                rateId: selectedRates,
                customerId: customerData.id,
                companyId: customerData.customerId,
                account_manager: "Account Manager",
                service_category: `${currentRateType} Routes`,
            });
            await requestPromises;
            toast.success('Tests Requested Successfully');
            setShowCheckboxes(false)
            setSelectedRates([])
            setTestPrivateRate(!testPrivateRate)
        } catch (error) {
            console.error('Error requesting tests:', error);
        }
    };

    const filteredData = (currentRateType === 'CCPrivateRate' ? ccRatesData : cliRatesData)?.filter(item => {
        if (statusFilter === 'all') {
            return item.country?.toLowerCase().includes(search.toLowerCase());
        }

        const hasMatchingTest = testsData.some((test) =>
            Array.isArray(test.rateId) &&
            test.rateId.some((rate) => rate === item._id) &&
            test.status === statusFilter
        );

        return (
            item.country?.toLowerCase().includes(search.toLowerCase()) &&
            hasMatchingTest
        );
    });

    return (
        <div className="p-6 text-gray-800 bg-white">
            <div className="flex justify-between items-start w-full">
                <h2 className="text-2xl font-bold">Private Rate</h2>
            </div>

            <div className="mt-8 flex items-center justify-between space-x-4">
                <input
                    type="text"
                    placeholder="Search by country name..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-1/2 bg-white px-4 py-2 rounded-lg border border-gray-300"
                />
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-white px-4 py-2 rounded-lg border border-gray-300"
                >
                    <option value="all">All Statuses</option>
                    <option value="Pending">Test Requested</option>
                    <option value="In Progress"> Test Processing</option>
                    <option value="Complete"> Test Completed</option>
                    <option value="Failed"> Test Failed</option>
                </select>

                {!showCheckboxes && (
                    <button
                        className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onClick={() => setShowCheckboxes(true)}
                    >
                        Select Rates
                    </button>
                )}
            </div>

            <div className="mt-4">
                <button
                    className={`px-4 py-2 rounded-lg mr-4 ${currentRateType === 'CCPrivateRate' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    onClick={() => setCurrentRateType('CCPrivateRate')}
                >
                    CCPrivateRate
                </button>
                <button
                    className={`px-4 py-2 rounded-lg ${currentRateType === 'CLIPrivateRate' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    onClick={() => setCurrentRateType('CLIPrivateRate')}
                >
                    CLIPrivateRate
                </button>
            </div>
            {
                currentRateType === "CLIPrivateRate" ? (
                    <button
                        className='mt-4 bg-green-500 text-white px-4 py-2 rounded-lg'
                        onClick={() => {
                            setCLIModalOpen(true);
                        }}>
                        Add CLIPrivateRate
                    </button>
                ) : (
                    <button
                        className='mt-4 bg-green-500 text-white px-4 py-2 rounded-lg'
                        onClick={() => {
                            setModalOpen(true);
                        }}>
                        Add CCPrivateRate
                    </button>
                )
            }

            {loading ? (
                <p>Loading rates...</p>
            ) : dataNotFound ? (
                <p>No data found.</p>
            ) : (
                <table className="min-w-full mt-6 border bg-white">
                    <thead>
                        <tr className="bg-[#005F73] text-white">
                            {showCheckboxes && <th className="px-4 py-2">Select</th>}
                            <th className="px-4 py-2">Country Code</th>
                            <th className="px-4 py-2">Prefix</th>
                            <th className="px-4 py-2">Country Name</th>
                            {currentRateType === "CCPrivateRate" && <th className="px-4 py-2">Profile</th>}
                            <th className="px-4 py-2">Rate</th>
                            <th className="px-4 py-2">Quality Description</th>
                            {currentRateType === "CLIPrivateRate" && <th className="px-4 py-2">asr</th>}
                            {currentRateType === "CLIPrivateRate" && <th className="px-4 py-2">billingCycle</th>}
                            {currentRateType === "CLIPrivateRate" && <th className="px-4 py-2">rtp</th>}
                            {currentRateType === "CLIPrivateRate" && <th className="px-4 py-2">acd</th>}
                            <th className="px-4 py-2">Status</th>
                        </tr>
                    </thead>
                    <tbody style={{ textAlign: "center" }}>
                        {filteredData?.map((rate, index) => (
                            <tr key={index} className="border-t">
                                {showCheckboxes && (
                                    <td className="border border-gray-300 px-4 py-2">
                                        <input
                                            type="checkbox"
                                            onChange={() => handleCheckboxChange(rate)}
                                        />
                                    </td>
                                )}
                                <td className="px-4 py-2">{rate.countryCode || 'N/A'}</td>
                                <td className="px-4 py-2">{rate.prefix || 'N/A'}</td>
                                <td className="px-4 py-2">{rate.country || 'N/A'}</td>
                                {rate.profile && <td className="px-4 py-2">{rate.profile || 'N/A'}</td>}
                                <td className="px-4 py-2">{rate.rate || 'N/A'}</td>
                                <td className="px-4 py-2">{rate.qualityDescription || 'N/A'}</td>
                                {rate.asr && <td className="px-4 py-2">{rate.asr || 'N/A'}</td>}
                                {rate.billingCycle && <td className="px-4 py-2">{rate.billingCycle || 'N/A'}</td>}
                                {rate.rtp && <td className="px-4 py-2">{rate.rtp || 'N/A'}</td>}
                                {rate.acd && <td className="px-4 py-2">{rate.acd || 'N/A'}</td>}
                                <td className="px-4 py-2">{rate.status || 'N/A'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {showCheckboxes && (
                <div className="mt-6 flex justify-end space-x-4">
                    <button
                        className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
                        onClick={() => setShowCheckboxes(false)}
                    >
                        Cancel
                    </button>
                    <button
                        className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onClick={handleRequestTest}
                    >
                        Request Test
                    </button>
                </div>
            )}

            <CCRateModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onSubmit={handleAddCCRate}
            />
            <CliRateModal
                isOpen={cliModalOpen}
                onClose={() => setCLIModalOpen(false)}
                onSubmit={handleAddLead}
            />
            <ToastContainer />
        </div>
    );
};

export default PrivateRatePage;
