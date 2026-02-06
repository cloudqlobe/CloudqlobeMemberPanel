import { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from "../../../../../layout/page";
import AuthContext from "../../../../../../context/AuthContext";
import axiosInstance from "../../../../../../utils/axiosinstance";

const CreateSaleTroubleTicket = () => {
    const navigate = useNavigate();
    const { memberDetails } = useContext(AuthContext)
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const location = useLocation();
    const passedCustomerId = location.state?.customerId || "";

    const [ticketDetails, setTicketDetails] = useState({
        customerId: passedCustomerId,
        UserId: "",
        memberId: memberDetails.id,
        accountManager: memberDetails.name,
        ticketCategory: "service",
        ticketDescription: "",
        followUpMethod: "call",
        status: "Pending",
        ticketPriority: "Low",
        ticketTime: new Date().toISOString(),
    });

    useEffect(() => {
        const fetchCustomer = async () => {
            try {
                const response = await axiosInstance.get("api/member/fetchCustomerId");
                const allCustomers = response.data.customers;

                const matchedCustomer = allCustomers.find(
                    (c) => c.customerId === passedCustomerId
                );

                if (matchedCustomer) {
                    setTicketDetails((prev) => ({
                        ...prev,
                        customerId: matchedCustomer.customerId,
                        UserId: matchedCustomer.id,
                    }));
                } else {
                    toast.error("Customer not found");
                }

                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
                toast.error("Failed to load customer data");
            }
        };

        fetchCustomer();
    }, [passedCustomerId]);


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTicketDetails(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.post(
                "api/member/createMember/customerTroubleTicket",
                ticketDetails
            );

            if (response.status === 201) {
                toast.success("Ticket created successfully!");
                setTimeout(() => navigate(-1), 1500);
            } else {
                toast.error("Failed to create ticket");
            }
        } catch (error) {
            const errorMsg = error.response?.data?.error || "Error creating ticket";
            toast.error(errorMsg);
        }
    };

    if (loading) return (
        <Layout>
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        </Layout>
    );

    if (error) return (
        <Layout>
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                Error loading customers: {error}
            </div>
        </Layout>
    );

    return (
        <Layout>
            <div className="min-h-screen p-4 md:p-8">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">Create New Ticket</h2>
                    <div className="mb-6">
                        <label className="block mb-2 font-semibold text-gray-700">Customer ID</label>
                        <input
                            type="text"
                            value={ticketDetails.customerId}
                            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                            disabled
                        />
                    </div>
                    {/* Ticket Form (shown after customer selection) */}
                    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
                        <div className="mb-6">
                            <label className="block mb-2 font-semibold text-gray-700">Ticket Category</label>
                            <select
                                name="ticketCategory"
                                value={ticketDetails.ticketCategory}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            >
                                <option value="service">Service Issue</option>
                                <option value="account">Account Issue</option>
                                <option value="other">Other Issue</option>
                                <option value="sale">Sales Issue</option>
                            </select>
                        </div>

                        <div className="mb-6">
                            <label className="block mb-2 font-semibold text-gray-700">Description</label>
                            <textarea
                                name="ticketDescription"
                                value={ticketDetails.ticketDescription}
                                onChange={handleInputChange}
                                placeholder="Describe the issue in detail..."
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                rows="4"
                                required
                            ></textarea>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div>
                                <label className="block mb-2 font-semibold text-gray-700">Follow-up Method</label>
                                <select
                                    name="followUpMethod"
                                    value={ticketDetails.followUpMethod}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="call">Call</option>
                                    <option value="email">Email</option>
                                    <option value="chat">Chat</option>
                                </select>
                            </div>

                            <div>
                                <label className="block mb-2 font-semibold text-gray-700">Priority</label>
                                <select
                                    name="ticketPriority"
                                    value={ticketDetails.ticketPriority}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                >
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="High">High</option>
                                </select>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg shadow-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out"
                        >
                            Create Ticket
                        </button>
                    </form>
                </div>
            </div>
            <ToastContainer position="top-right" autoClose={3000} />
        </Layout>
    );
};

export default CreateSaleTroubleTicket;