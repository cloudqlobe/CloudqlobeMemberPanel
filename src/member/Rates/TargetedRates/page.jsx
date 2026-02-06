import { useEffect, useState } from 'react';
import Layout from '../../layout/page';
import { SiWebmoney } from 'react-icons/si';
import axiosInstance from '../../../utils/axiosinstance';

const iconStyle = () => ({
    color: "#DECD2B",
    fontSize: "40px",
    marginLeft: "18px",
});

const TargetedRatePage = () => {
    const [showCLI, setShowCLI] = useState(true);
    const [ccRates, setCcRates] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [searchFilters, setSearchFilters] = useState({
        country: '',
        description: '',
        status: '',
        priority: '',
        profile: ''
    });

    const [editMode] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [editData, setEditData] = useState({});
    const [deleteMode] = useState(false);
    const [selectedToDelete, setSelectedToDelete] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;

    const [formData, setFormData] = useState({
        country: '',
        qualityDescription: '',
        lcr: '',
        hcr: '',
        status: 'Active',
        priority: 'Low',
        billing_cycle: '',
    });

    // State for custom dropdown
    const [showCountryDropdown, setShowCountryDropdown] = useState(false);
    const [showModalCountryDropdown, setShowModalCountryDropdown] = useState(false);
    const [countryFilterStatus, setCountryFilterStatus] = useState('all'); // 'all', 'active', 'inactive'

    useEffect(() => {
        const fetchTargetedRates = async () => {
            try {
                const response = await axiosInstance.get('/api/admin/targeted/rate');
                setCcRates(response.data.Targetedrate);
            } catch (error) {
                console.error("Error fetching targeted rates:", error);
            }
        };

        fetchTargetedRates();
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchFilters]);

    // Extract unique values for dropdowns
    const uniqueCountries = [...new Set(ccRates?.map(rate => rate.country))];
    const uniqueStatuses = [...new Set(ccRates?.map(rate => rate.status))];
    const uniquePriorities = [...new Set(ccRates?.map(rate => rate.priority))];

    // Extract profiles from qualityDescription (first word)
    const uniqueProfiles = [...new Set(ccRates?.map(rate => {
        const desc = rate.qualityDescription || '';
        return desc.split(' ')[0];
    }))]?.filter(profile => profile); // Remove empty strings

    // Check if a country has any active rates
    const isCountryActive = (country) => {
        return ccRates.some(rate => rate.country === country && rate.status === 'Active');
    };

    const handleAddCCRate = async (e) => {
        e.preventDefault();
        try {
            await axiosInstance.post('/api/admin/targeted/rate', formData);
            const response = await axiosInstance.get('/api/admin/targeted/rate');
            setCcRates(response.data.Targetedrate);
            setFormData({
                country: '',
                qualityDescription: '',
                lcr: '',
                hcr: '',
                status: 'Active',
                priority: 'Low',
                billing_cycle: ''
            });
            setShowModal(false);
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    const handleRowSelect = (index) => {
        if (editMode) {
            if (selectedRow !== index) {
                setSelectedRow(index);
                setEditData({ ...ccRates[index] }); // Always pick from full source
            }
        } else if (deleteMode) {
            const id = ccRates[index]._id;
            setSelectedToDelete(prev =>
                prev.includes(id)
                    ? prev.filter(item => item !== id)
                    : [...prev, id]
            );
        }
    };

    const filteredRates = ccRates?.filter(rate => {
        // Check country filter
        if (searchFilters.country && rate.country !== searchFilters.country) return false;

        // Check description filter
        if (searchFilters.description &&
            !rate.qualityDescription.toLowerCase().includes(searchFilters.description.toLowerCase())) {
            return false;
        }

        // Check status filter
        if (searchFilters.status && rate.status !== searchFilters.status) return false;

        // Check priority filter
        if (searchFilters.priority && rate.priority !== searchFilters.priority) return false;

        // Check profile filter (first word of qualityDescription)
        if (searchFilters.profile) {
            const firstWord = rate.qualityDescription?.split(' ')[0] || '';
            if (firstWord !== searchFilters.profile) return false;
        }

        return true;
    });

    const totalPages = Math.ceil(filteredRates?.length / rowsPerPage);
    const paginatedRates = filteredRates?.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    const handleFilterChange = (filterName, value) => {
        setSearchFilters(prev => ({
            ...prev,
            [filterName]: value
        }));
    };

    const resetFilters = () => {
        setSearchFilters({
            country: '',
            description: '',
            status: '',
            priority: '',
            profile: ''
        });
    };

    const visiblePages = 10;
    const startPage = Math.max(currentPage - Math.floor(visiblePages / 2), 1);
    const endPage = Math.min(startPage + visiblePages - 1, totalPages);

    // Custom dropdown component
    const CountryDropdown = ({ isModal = false }) => {
        const getFilteredCountries = () => {
            return uniqueCountries?.filter((country) => {
                if (countryFilterStatus === 'active') return isCountryActive(country);
                if (countryFilterStatus === 'inactive') return !isCountryActive(country);
                return true; // 'all'
            });
        };

        const options = getFilteredCountries()
            ?.sort((a, b) => a.localeCompare(b)) // ⬅️ Sort alphabetically
            .map(country => ({
                value: country,
                label: country,
                isActive: isCountryActive(country)
            }));

        const selectedValue = isModal ? formData.country : searchFilters.country;
        const setSelectedValue = isModal ?
            (value) => setFormData({ ...formData, country: value }) :
            (value) => handleFilterChange('country', value);
        const showDropdown = isModal ? showModalCountryDropdown : showCountryDropdown;
        const setShowDropdown = isModal ? setShowModalCountryDropdown : setShowCountryDropdown;

        return (
            <div className="relative w-full">
                <div
                    className="border rounded px-3 py-2 flex items-center justify-between cursor-pointer bg-white"
                    style={{ height: "41px" }}
                    onClick={() => setShowDropdown(!showDropdown)}
                >
                    <div className="flex items-center">
                        {selectedValue ? (
                            <>
                                <div
                                    className="w-2 h-2 rounded-full mr-2"
                                    style={{ backgroundColor: isCountryActive(selectedValue) ? '#10B981' : '#EF4444' }}
                                />
                                {selectedValue}
                            </>
                        ) : (
                            <span className="text-gray-400">
                                {isModal ? 'Select Country' : 'All Countries'}
                            </span>
                        )}
                    </div>
                    <svg
                        className={`w-4 h-4 ml-2 transition-transform ${showDropdown ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>

                {showDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-white border rounded shadow-lg"
                        style={{ overflow: "auto", height: "55vh" }}
                    >
                        {!isModal && (
                            <div
                                className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => {
                                    setSelectedValue('');
                                    setShowDropdown(false);
                                }}
                            >
                                All Countries
                            </div>
                        )}
                        {options?.map((option) => (
                            <div
                                key={option.value}
                                className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                                onClick={() => {
                                    setSelectedValue(option.value);
                                    setShowDropdown(false);
                                }}
                            >
                                <div
                                    className="w-2 h-2 rounded-full mr-2"
                                    style={{ backgroundColor: option.isActive ? '#10B981' : '#EF4444' }}
                                />
                                {option.label}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };


    return (
        <Layout>
            <div className="p-6 text-gray-900" style={{ marginLeft: "-17px", width: "100vw", }}>
                <div style={{ display: "flex" }}>
                    <SiWebmoney style={iconStyle('primary')} />
                    <h2 className="text-xl font-bold flex items-center ml-4 mb-2">TARGETED RATES</h2>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "25px", alignItems: "center", marginTop: "10px" }}>

                    {/* Tab Buttons */}
                    <div className="mt-4 flex space-x-4 ml-4">

                        <div>
                            <input
                                style={{ height: "41px", width: "25vw" }}
                                type="text"
                                placeholder="Search description..."
                                value={searchFilters.description}
                                onChange={(e) => handleFilterChange('description', e.target.value)}
                                className="w-full px-3 py-2 border shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <button
                            style={{ width: "154px" }}
                            onClick={() => setShowCLI(false)}
                            className={`px-4 py-2 ${showCLI ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'
                                }`}
                        >
                            CLI Rates
                        </button>
                        <button
                            style={{ width: "154px" }}
                            onClick={() => setShowCLI(true)}
                            className={`px-4 py-2 ${!showCLI ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'
                                }`}
                        >
                            CC Rates
                        </button>
                    </div>
                </div>
                {/* Search Filters */}
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end" style={{ marginLeft: "15px", width: "97vw" }}>
                    {/* Country Dropdown */}
                    <div>
                        <CountryDropdown />
                    </div>

                    <div>
                        <select
                            style={{ height: "41px" }}
                            value={countryFilterStatus}
                            onChange={(e) => setCountryFilterStatus(e.target.value)}
                            className="w-full px-3 py-2 border shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="all">All Countries</option>
                            <option value="active">Active Countries</option>
                            <option value="inactive">Inactive Countries</option>
                        </select>
                    </div>

                    {/* Status Dropdown */}
                    <div>
                        <select
                            style={{ height: "41px" }}
                            value={searchFilters.status}
                            onChange={(e) => handleFilterChange('status', e.target.value)}
                            className="w-full px-3 py-2 border shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">Rate Status</option>
                            {uniqueStatuses?.map(status => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>
                    </div>

                    {/* Priority Dropdown */}
                    <div>
                        <select
                            style={{ height: "41px" }}
                            value={searchFilters.priority}
                            onChange={(e) => handleFilterChange('priority', e.target.value)}
                            className="w-full px-3 py-2 border shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">Rate Priority</option>
                            {uniquePriorities?.map(priority => (
                                <option key={priority} value={priority}>{priority}</option>
                            ))}
                        </select>
                    </div>

                    {/* Profile Dropdown */}
                    <div>
                        <select
                            style={{ height: "41px" }}
                            value={searchFilters.profile}
                            onChange={(e) => handleFilterChange('profile', e.target.value)}
                            className="w-full px-3 py-2 border shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">Traffic Profile</option>
                            {uniqueProfiles?.map(profile => (
                                <option key={profile} value={profile}>{profile}</option>
                            ))}
                        </select>
                    </div>

                    {/* Reset Button */}
                    <div>
                        <button
                            style={{ width: "94%" }}
                            onClick={resetFilters}
                            className="px-4 py-2 bg-gray-200 text-gray-800 hover:bg-gray-300"
                        >
                            Reset Filters
                        </button>
                    </div>
                </div>
                {/* CLI Under Maintenance */}
                {!showCLI && (
                    <div className="flex justify-center items-center h-64">
                        <h4 className="text-2xl font-semibold text-gray-600">Under Maintenance</h4>
                    </div>
                )}

                {/* CC Rates Section */}
                {showCLI && (
                    <div className="mt-6 ml-4 w-[96vw]">
                        <div className="overflow-x-auto">
                            <table className="min-w-full border-collapse">
                                <thead className="bg-[#005F73] text-white">
                                    <tr>
                                        {(editMode || deleteMode) && <th className="p-2 text-center">Select</th>}
                                        <th className="p-2 text-center">Country</th>
                                        <th className="p-2 text-center">Quality Description</th>
                                        <th className="p-2 text-center">Priority</th>
                                        <th className="p-2 text-center">Billing Cycle</th>
                                        <th className="p-2 text-center">Buying Range (USD)</th>
                                        <th className="p-2 text-center">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedRates?.map((rate, index) => {
                                        const originalIndex = ccRates.findIndex(r => r._id === rate._id);
                                        const isSelected = selectedRow === originalIndex;
                                        const isSelectedForDelete = selectedToDelete.includes(rate._id);

                                        return (
                                            <tr
                                                key={rate._id}
                                                className={`${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'} ${(editMode && isSelected) || (deleteMode && isSelectedForDelete)
                                                    ? 'ring-2 ring-blue-500'
                                                    : ''
                                                    }`}
                                                onClick={() => handleRowSelect(originalIndex)}
                                            >
                                                {(editMode || deleteMode) && (
                                                    <td className="p-2 text-center">
                                                        <input
                                                            type={editMode ? "radio" : "checkbox"}
                                                            checked={editMode ? isSelected : isSelectedForDelete}
                                                            onChange={() => handleRowSelect(originalIndex)}
                                                            className="h-4 w-4"
                                                        />
                                                    </td>
                                                )}
                                                <td className="p-2" style={{ width: "12%" }}>
                                                    <div className="flex items-center">
                                                        {rate.country}
                                                    </div>
                                                </td>
                                                <td className="p-2 ">{rate.qualityDescription}</td>
                                                <td className="p-2 text-center">
                                                    {editMode && isSelected ? (
                                                        <select
                                                            defaultValue={editData.priority}
                                                            onChange={(e) => setEditData({ ...editData, priority: e.target.value })}
                                                            className="border rounded px-2 py-1 w-full"
                                                        >
                                                            <option value="Low">Low</option>
                                                            <option value="Medium">Medium</option>
                                                            <option value="High">High</option>
                                                        </select>
                                                    ) : rate.priority}
                                                </td>
                                                {/* Billing Cycle cell - changed from select to input */}
                                                <td className="p-2 text-center">
                                                    {editMode && isSelected ? (
                                                        <input
                                                            type="text"
                                                            value={editData.billing_cycle || ''}
                                                            onChange={(e) => setEditData({ ...editData, billing_cycle: e.target.value })}
                                                            className="border rounded px-2 py-1 w-full"
                                                            placeholder="Enter billing cycle"
                                                        />
                                                    ) : (
                                                        rate.billing_cycle || 'Not specified'
                                                    )}
                                                </td>
                                                <td className="p-2 text-center">
                                                    {editMode && isSelected ? (
                                                        <div className="flex items-center justify-center space-x-4">
                                                            <div className="flex items-center justify-between bg-green-50 border border-green-300 rounded px-2 py-1 w-32">
                                                                <input
                                                                    type="number"
                                                                    placeholder="LCR"
                                                                    value={editData.lcr}
                                                                    onChange={(e) => setEditData({ ...editData, lcr: e.target.value })}
                                                                    className="border rounded px-2 py-1 w-24 text-sm text-blue-700 no-spinner"
                                                                />
                                                                <span className="text-green-700 text-xs font-medium">LCR</span>
                                                            </div>
                                                            <div className="flex items-center justify-between bg-red-50 border border-red-300 rounded px-2 py-1 w-32">
                                                                <input
                                                                    type="number"
                                                                    placeholder="HCR"
                                                                    value={editData.hcr}
                                                                    onChange={(e) => setEditData({ ...editData, hcr: e.target.value })}
                                                                    className="border rounded px-2 py-1 w-24 text-sm text-green-700 no-spinner"
                                                                />
                                                                <span className="text-red-700 text-xs font-medium">HCR</span>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center justify-center space-x-4">
                                                            <div className="flex items-center justify-between bg-green-50 border border-green-300 rounded px-2 py-1 w-32">
                                                                <span className="text-green-700">{rate.lcr}</span>
                                                                <span className="text-green-700 text-xs font-medium">LCR</span>
                                                            </div>
                                                            <div className="flex items-center justify-between bg-red-50 border border-red-300 rounded px-2 py-1 w-32">
                                                                <span className="text-red-700">{rate.hcr}</span>
                                                                <span className="text-red-700 text-xs font-medium">HCR</span>
                                                            </div>
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="p-2 text-center">
                                                    {editMode && isSelected ? (
                                                        <select
                                                            defaultValue={editData.status}
                                                            onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                                                            className="border rounded px-2 py-1 w-full"
                                                        >
                                                            <option className="text-green-700" value="Active">Active</option>
                                                            <option className="text-red-700" value="Inactive">Inactive</option>
                                                        </select>
                                                    ) : (
                                                        <span className={rate.status === 'Active' ? 'text-green-700' : 'text-red-700'}>
                                                            {rate.status}
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                            <div className="flex justify-center items-center space-x-2 mt-4 overflow-x-auto max-w-full">
                                <button
                                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="px-3 py-1 border rounded disabled:opacity-50 shrink-0"
                                >
                                    Previous
                                </button>

                                <div className="flex space-x-2 shrink-0">
                                    {Array.from({ length: endPage - startPage + 1 }, (_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setCurrentPage(startPage + i)}
                                            className={`px-3 py-1 border rounded ${currentPage === startPage + i ? 'bg-blue-500 text-white' : ''}`}
                                        >
                                            {startPage + i}
                                        </button>
                                    ))}

                                </div>

                                <button
                                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className="px-3 py-1 border rounded disabled:opacity-50 shrink-0"
                                >
                                    Next
                                </button>
                            </div>

                        </div>
                    </div>
                )}

                {/* Modal Popup for Add Form */}
                {showModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
                        <div className="bg-white rounded-lg p-6 w-[90vw] max-w-xl shadow-lg">
                            <h3 className="text-xl font-bold mb-4">Add Targeted Rate</h3>
                            <form onSubmit={handleAddCCRate} className="grid grid-cols-1 gap-4">
                                <input
                                    type="text"
                                    placeholder="Country Name"
                                    value={formData.country}
                                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                    className="border rounded px-3 py-2"
                                    required
                                />                                <input
                                    type="text"
                                    placeholder="Description"
                                    value={formData.qualityDescription}
                                    onChange={(e) => setFormData({ ...formData, qualityDescription: e.target.value })}
                                    className="border rounded px-3 py-2"
                                    required
                                />
                                {/* Billing Cycle input - changed from select to input */}
                                <input
                                    type="text"
                                    placeholder="Billing Cycle "
                                    value={formData.billing_cycle}
                                    onChange={(e) => setFormData({ ...formData, billing_cycle: e.target.value })}
                                    className="border rounded px-3 py-2"
                                />
                                <select
                                    value={formData.priority}
                                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                    className="border rounded px-3 py-2"
                                >
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="High">High</option>
                                </select>
                                <div className="flex space-x-4">
                                    <input
                                        type="number"
                                        placeholder="LCR"
                                        value={formData.lcr}
                                        onChange={(e) => setFormData({ ...formData, lcr: e.target.value })}
                                        className="border rounded px-3 py-2 w-1/2 no-spinner"
                                        required
                                    />

                                    <input
                                        type="number"
                                        placeholder="HCR"
                                        value={formData.hcr}
                                        onChange={(e) => setFormData({ ...formData, hcr: e.target.value })}
                                        className="border rounded px-3 py-2 w-1/2 no-spinner"
                                        required
                                    />
                                </div>

                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    className="border rounded px-3 py-2"
                                >
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                                <div className="flex justify-end space-x-4 mt-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="px-4 py-2 rounded bg-gray-300 text-black"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                                    >
                                        Submit
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default TargetedRatePage;