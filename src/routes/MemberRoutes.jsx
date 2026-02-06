import React from "react";
import { Routes, Route } from "react-router-dom";
import { MemberRoute } from "../auth/ProtectedRoute.jsx";

import AdminMemberSignInPage from "../member/auth/AdminMemberLogin/page.jsx";
import MemberTokenVerification from "../member/auth/AdminMemberLogin/token.jsx";
import MemberDashboard from "../member/Dashboard/page.jsx";

//Lead
import InternalAssistance from "../member/Leads/InternalAssistance/page.jsx";
import LeadReport from "../member/Leads/Reports/page.jsx";
import NewLeads from "../member/Leads/NewLeads/page.jsx";
import LeadsMessage from "../member/Leads/messages/page.jsx";
import AddCustomerPage from "../member/Leads/NewLeads/AddLead/page.jsx";
import FollowUpDetails from "../member/Leads/Followups/[id]/page.jsx";
import LeadEmail from "../member/Leads/Emails/page.jsx";
import FollowUp from "../member/Leads/Followups/page.jsx";
//sale
import CustomersPage from "../member/Sales/Leads/page.jsx";
import SaleLeadDetails from "../member/Sales/Leads/[customerId]/page.jsx";
import AddSaleCustomerPage from "../member/Sales/Leads/AddLead/page.jsx";
import LeadDetails from "../member/Leads/NewLeads/[customerId]/page.jsx";
import CreateSaleTroubleTicket from "../member/Sales/Leads/[customerId]/components/CreateTicket/page.jsx";
import SaleCustomersPage from "../member/Sales/Customers/page.jsx";
import SaleEmail from "../member/Sales/Emails/page.jsx";
import SaleFollowUp from "../member/Sales/Followups/page.jsx";
import SaleCustomerLeadDetails from "../member/Sales/Customers/[customerId]/page.jsx";
import SalesReportPage from "../member/Sales/Reports/page.jsx";
import SaleInternalAssistance from "../member/Sales/internalAssistance/page.jsx";
import SaleMessage from "../member/Sales/Messages/page.jsx";
//carrier
import CarrierReport from "../member/Carriers/Reports/page.jsx";
import CarrierEmail from "../member/Carriers/Email/page.jsx";
import CarrierFollowUp from "../member/Carriers/Followups/page.jsx";
import AddCarrierCustomerPage from "../member/Carriers/Carriers/AddLead/page.jsx";
import CarrierCustomersPage from "../member/Carriers/Carriers/page.jsx";
import CarrierPage from "../member/Carriers/Leads/page.jsx";
import AddCarrierPage from "../member/Carriers/Leads/AddLead/page.jsx";
import CreateCarrierTroubleTicket from "../member/Carriers/Leads/[customerId]/components/CreateTicket/page.jsx";
import CarrierDetails from "../member/Carriers/Leads/[customerId]/page.jsx";
import CarrierInternalAssistance from "../member/Carriers/InternalAssistance/page.jsx";
import CarriersMessage from "../member/Carriers/Messages/page.jsx";
import CarriersCustomerLeadDetails from "../member/Carriers/Carriers/[customerId]/page.jsx";
//account
import RatesPage from "../member/Rates/CCRates/page.jsx";
import CLIRatesPage from "../member/Rates/CLIRates/page.jsx";
import TargetedRatePage from "../member/Rates/TargetedRates/page.jsx";
import OfferRatePage from "../member/Rates/OfferRate/page.jsx";
import SpecialRatePage from "../member/Rates/SpecialRates/page.jsx";
import PrivateRateRequestPage from "../member/Requests/PrivaterateRequest/page.jsx";
import OverdraftRequestPage from "../member/Requests/OverdraftRequests/page.jsx";
import VendorRequestPage from "../member/Requests/Vendorpayment/page.jsx";
import RechargerequestPage from "../member/Requests/RechargeRequests/page.jsx";
import RechargeForm from "../member/Accounts/Recharge/RechargeForm/page.jsx";
import VendorForm from "../member/Accounts/Recharge/VendorForm/page.jsx";
import AccountInternalAssistance from "../member/Accounts/InternalAssistance/page.jsx";
import AccountsEmail from "../member/Accounts/Emails/page.jsx";
import AccountFollowUp from "../member/Accounts/Followups/page.jsx";
import AddFollowUpInAccounts from "../member/Accounts/Followups/Addfollowup/page.jsx";
import AccountsMessagesDashboard from "../member/Accounts/Messages/page.jsx";
//support
import SupportEmail from "../member/Support/Emails/page.jsx";
import SupportInternalAssistance from "../member/Support/InternalAssistance/page.jsx";
import CreateTroubleTicket from "../member/Support/TroubleTickets/AddTroubleTicket/page.jsx";
import TroubleTicket from "../member/Support/TroubleTickets/page.jsx";
import TestingPage from "../member/Support/Testing/page.jsx";
import SupportFollowUp from "../member/Support/FollowUps/page.jsx";
import AddFollowUpInSupport from "../member/Support/FollowUps/Addfollowup/page.jsx";
import SupportMessagesDashboard from "../member/Support/Messages/page.jsx";
import SupportMyticket from "../member/Support/MyTicket/page.jsx";
import SupportTaskPage from "../member/Support/Tasks/page.jsx";
//acount
import AccountsReport from "../member/Accounts/Reports/page.jsx";
import AccountsMyTicket from "../member/Accounts/MyTicket/page.jsx";
import EnquiryPage from "../member/Communication/Enquiries/page.jsx";
import Didnumberenquiery from "../member/Communication/DIDEnquiries/page.jsx";
import CommunicationMyTicket from "../member/Communication/MyTicket/page.jsx";
import ChatPanel from "../member/Communication/ChatBot/page.jsx";
import CommunicationEmail from "../member/Communication/Email/page.jsx";
import CommunicationMessagesDashboard from "../member/Communication/Messages/page.jsx";
import CommunicationInternalAssistance from "../member/Communication/InternalAssistance/page.jsx";
//team management
import TaskManager from "../member/TeamManagement/WorkManagement/MyTask/page.jsx";
import MeetingManager from "../member/TeamManagement/WorkManagement/Meeting/page.jsx";
import GoalTracker from "../member/TeamManagement/WorkManagement/Targets/page.jsx";
import ProjectTaskManager from "../member/TeamManagement/WorkManagement/ProjectTask/page.jsx";
import MemberNotesPage from "../member/TeamManagement/WorkManagement/Notes/page.jsx";
import FollowupsPage from "../member/TeamManagement/WorkManagement/FollowUps/page.jsx";
import Calendar from "../member/TeamManagement/WorkManagement/Calendar/page.jsx";
//hr
import LeaveManagementPage from "../member/TeamManagement/HR&Administration/Leave/page.jsx";
import PayrollPage from "../member/TeamManagement/HR&Administration/Payroll/page.jsx";
import StaffPerformancePage from "../member/TeamManagement/HR&Administration/Performance/page.jsx";
import Training from "../member/TeamManagement/HR&Administration/Training/page.jsx";
import MemberProfilePage from "../member/TeamManagement/HR&Administration/Profile/page.jsx";
import Attendance from "../member/TeamManagement/HR&Administration/Attendance/page.jsx";
//team connect
import AdminNotificationPage from "../member/TeamManagement/TeamConnect/Notification/page.jsx";
import EmailClient from "../member/TeamManagement/TeamConnect/Email/page.jsx";
import TeamChatApp from "../member/TeamManagement/TeamConnect/Chat/page.jsx";
import DocumentLibrary from "../member/TeamManagement/TeamConnect/Document/page.jsx";
import EmployeeInfoPortal from "../member/TeamManagement/HR&Administration/information/page.jsx";

const MemberRoutes = () => {
  return (
    <Routes>
      <Route path="/signin" element={<AdminMemberSignInPage />} />
      <Route path="/verify-token" element={<MemberTokenVerification />} />

      <Route path="/*" element={
        <MemberRoute>
          <Routes>
            <Route path="/dashboard" element={< MemberDashboard />} />
            {/* Leads */}
            <Route path="/newLeads" element={<NewLeads />} />
            <Route path="/NewLeads/:customerId" element={<LeadDetails />} />
            <Route path="/Addlead" element={<AddCustomerPage />} />
            <Route path="/leads/assistance" element={<InternalAssistance />} />
            <Route path="/leads/messages" element={<LeadsMessage />} />
            <Route path="/notification" element={<FollowUp />} />
            <Route path="/detailfollowup/:followupId" element={<FollowUpDetails />} />
            <Route path="/leads/email" element={<LeadEmail />} />
            <Route path="/leads/report" element={<LeadReport />} />

            {/* Sale */}
            <Route path="/sale/leads" element={<CustomersPage />} />
            <Route path="/sale/addlead" element={<AddSaleCustomerPage />} />
            <Route path="/SaleLead/:customerId" element={<SaleLeadDetails />} />
            <Route path="/sale/ticket" element={<CreateSaleTroubleTicket />} />
            <Route path="/sale/customer" element={<SaleCustomersPage />} />
            <Route path="/sale/customer/addlead" element={<AddSaleCustomerPage />} />
            <Route path="/SaleLead/customer/:customerId" element={<SaleCustomerLeadDetails />} />
            <Route path="/sale/followups" element={<SaleFollowUp />} />
            <Route path="/sale/email" element={<SaleEmail />} />
            <Route path="/sale/report" element={<SalesReportPage />} />
            <Route path="/sale/messages" element={<SaleMessage />} />
            <Route path="/sale/assistance" element={<SaleInternalAssistance />} />

            {/* Carrier */}
            <Route path="/carrier/leads" element={<CarrierPage />} />
            <Route path="/carrier/addlead" element={<AddCarrierPage />} />
            <Route path="/carrier/lead-details/:customerId" element={<CarrierDetails />} />
            <Route path="/carrrier/ticket" element={<CreateCarrierTroubleTicket />} />
            <Route path="/carrier/carrier" element={<CarrierCustomersPage />} />
            <Route path="/carrier/customer/addlead" element={<AddCarrierCustomerPage />} />
            <Route path="/carrier/followup" element={<CarrierFollowUp />} />
            <Route path="/carrier/messages" element={<CarriersMessage />} />
            <Route path="/carrier/assistance" element={<CarrierInternalAssistance />} />
            <Route path="/carrier/carrier/:customerId" element={<CarriersCustomerLeadDetails />} />
            <Route path="/carrier/email" element={<CarrierEmail />} />
            <Route path="/carrier/report" element={<CarrierReport />} />

            {/* Accounts */}
            <Route path="/clirates" element={<CLIRatesPage />} />
            <Route path="/ccrates" element={<RatesPage />} />
            <Route path="/targetedrates" element={<TargetedRatePage />} />
            <Route path="/offer/rates" element={<OfferRatePage />} />
            <Route path="/specialrates" element={<SpecialRatePage />} />
            <Route path="/recharge" element={<RechargeForm />} />
            <Route path="/vendor_form" element={<VendorForm />} />
            <Route path="/recharge_requests" element={<RechargerequestPage />} />
            <Route path="/vendorpayment" element={<VendorRequestPage />} />
            <Route path="/overdraft_requests" element={<OverdraftRequestPage />} />
            <Route path="/privaterate_requests" element={<PrivateRateRequestPage />} />
            <Route path="/account/followup" element={<AccountFollowUp />} />
            <Route path="/account/addFollowup" element={<AddFollowUpInAccounts />} />
            <Route path="/account/messages" element={<AccountsMessagesDashboard />} />
            <Route path="/account/assistance" element={<AccountInternalAssistance />} />
            <Route path="/account/email" element={<AccountsEmail />} />
            <Route path="/account/report" element={<AccountsReport />} />
            <Route path="/account/myticket" element={<AccountsMyTicket />} />

            {/* support */}
            <Route path="/support/troubleTickets" element={<TroubleTicket />} />
            <Route path="/support/createTickets" element={<CreateTroubleTicket />} />
            <Route path="/support/testing" element={<TestingPage />} />
            <Route path="/support/email" element={<SupportEmail />} />
            <Route path="/support/internalassistence" element={<SupportInternalAssistance />} />
            <Route path="/support/followups" element={<SupportFollowUp />} />
            <Route path="/support/addFollowup" element={<AddFollowUpInSupport />} />
            <Route path="/support/messages" element={<SupportMessagesDashboard />} />
            <Route path="/support/myTickets" element={<SupportMyticket />} />
            <Route path="/support/task" element={<SupportTaskPage />} />

            {/* Communications */}
            <Route path="/communication/enquiry" element={<EnquiryPage />} />
            <Route path="/communication/didEnquiry" element={<Didnumberenquiery />} />
            <Route path="/communication/myTickets" element={<CommunicationMyTicket />} />
            <Route path="/communication/chatpanel" element={<ChatPanel />} />
            <Route path="/communication/email" element={<CommunicationEmail />} />
            <Route path="/communication/messages" element={<CommunicationMessagesDashboard />} />
            <Route path="/communication/assistance" element={<CommunicationInternalAssistance />} />

            {/* Team Work */}
            <Route path="/work/tasks" element={<TaskManager />} />
            <Route path="/work/meetings" element={<MeetingManager />} />
            <Route path="/work/projects" element={<ProjectTaskManager />} />
            <Route path="/work/targets" element={<GoalTracker />} />
            <Route path="/work/calendar" element={<Calendar />} />
            <Route path="/work/notes" element={<MemberNotesPage />} />
            <Route path="/work/followups" element={<FollowupsPage />} />

            <Route path="/hr/profile" element={<MemberProfilePage />} />
            <Route path="/hr/attendance" element={<Attendance />} />
            <Route path="/hr/leaves" element={<LeaveManagementPage />} />
            <Route path="/hr/performance" element={<StaffPerformancePage />} />
            <Route path="/hr/training" element={<Training />} />
            <Route path="/hr/payroll" element={<PayrollPage />} />
            <Route path="/hr/information" element={<EmployeeInfoPortal />} />

            <Route path="team/notifications" element={<AdminNotificationPage />} />
            <Route path="team/chat" element={<TeamChatApp />} />
            <Route path="team/emails" element={<EmailClient />} />
            <Route path="team/chat" element={<TeamChatApp />} />
            <Route path="team/files" element={<DocumentLibrary />} />
          </Routes>
        </MemberRoute>
      } />

    </Routes>
  );
};

export default MemberRoutes;