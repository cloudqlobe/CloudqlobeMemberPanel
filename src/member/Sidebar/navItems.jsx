import {
  FaChartLine, FaUsers, FaBell, FaEnvelope, FaFileAlt, FaComments, FaHandsHelping,
  FaTruck, FaShippingFast, FaMoneyBillWave, FaCreditCard, FaStar, FaBullseye,
  FaPercentage, FaWallet, FaFileInvoiceDollar, FaTools, FaTicketAlt, FaFlask,
  FaTasks, FaHeadset, FaPhoneAlt, FaHashtag, FaCalendarAlt, FaProjectDiagram,
  FaCalendarCheck, FaStickyNote, FaUser, FaPlaneDeparture, FaChalkboardTeacher,
  FaMoneyCheckAlt
} from 'react-icons/fa';

import { SiWebmoney } from 'react-icons/si';
import { HomeIcon } from "@heroicons/react/24/solid";

// Colors
const iconColors = {
  primary: "#3B82F6", secondary: "#10B981", accent: "#F59E0B", danger: "#EF4444",
  purple: "#8B5CF6", indigo: "#6366F1", pink: "#EC4899", teal: "#14B8A6",
  cyan: "#06B6D4", dark: "#1F2937", light: "#6B7280"
};

// Shared styles
const iconStyle = (c = 'primary') => ({
  color: iconColors[c] || iconColors.primary, fontSize: "25px", marginLeft: "12px", marginTop: "12px"
});
const boxStyle = { border: "1px solid", height: "50px", width: "50px", borderRadius: "7px", marginRight: "13px" };

// Label factory
const makeLabel = (Icon, color, text) => (
  <div className="flex items-center">
    <div style={boxStyle}><Icon style={iconStyle(color)} /></div>
    <span>{text}</span>
  </div>
);

export const getNavItems = (memberRole) => [
  {
    id: "dashboard",
    icon: <HomeIcon className="h-8 w-8 text-orange-400" />,
    href: "/member/dashboard",
    roles: ["all"],
    mobileOnly: true
  },
  {
    id: "leads", label: "Leads", roles: ["leadmember", "salemember"],
    subItems: [
      { label: makeLabel(SiWebmoney, "primary", "New Leads"), href: "/member/newLeads" },
      { label: makeLabel(FaBell, "accent", "Follow Up"), href: "/member/notification" },
      { label: makeLabel(FaEnvelope, "purple", "Emails"), href: "/member/leads/email" },
      { label: makeLabel(FaFileAlt, "indigo", "Reports"), href: "/member/leads/report" },
      { label: makeLabel(FaComments, "pink", "Messages"), href: "/member/leads/messages" },
      { label: makeLabel(FaHandsHelping, "danger", "Internal Assistance"), href: "/member/leads/assistance" }
    ]
  },
  {
    id: "sales", label: "Sales", roles: ["salemember"],
    subItems: [
      { label: makeLabel(FaChartLine, "primary", "Leads"), href: "/member/sale/leads" },
      { label: makeLabel(FaUsers, "secondary", "Customers"), href: "/member/sale/customer" },
      { label: makeLabel(FaBell, "accent", "Followups"), href: "/member/sale/followups" },
      { label: makeLabel(FaEnvelope, "purple", "Emails"), href: "/member/sale/email" },
      { label: makeLabel(FaFileAlt, "indigo", "Reports"), href: "/member/sale/report" },
      { label: makeLabel(FaComments, "pink", "Messages"), href: "/member/sale/messages" },
      { label: makeLabel(FaHandsHelping, "danger", "Internal Assistance"), href: "/member/sale/assistance" }
    ]
  },
  {
    id: "carriers", label: "Carriers", roles: ["salemember", "carriermember"],
    subItems: [
      { label: makeLabel(FaTruck, "primary", "Leads"), href: "/member/carrier/leads" },
      { label: makeLabel(FaShippingFast, "secondary", "Carriers"), href: "/member/carrier/carrier" },
      { label: makeLabel(FaBell, "accent", "Followups"), href: "/member/carrier/followup" },
      { label: makeLabel(FaEnvelope, "purple", "Emails"), href: "/member/carrier/email" },
      { label: makeLabel(FaFileAlt, "indigo", "Reports"), href: "/member/carrier/report" },
      { label: makeLabel(FaComments, "pink", "Messages"), href: "/member/carrier/messages" },
      { label: makeLabel(FaHandsHelping, "danger", "Internal Assistance"), href: "/member/carrier/assistance" }
    ]
  },
  {
    id: "accounts", label: "Accounts", roles: ["accountmember", "salemember", "carriermember"],
    subItems: [
      {
        label: "Rates", subMenu: true,
        items: [
          { label: makeLabel(FaMoneyBillWave, "primary", "CC Rates"), href: "/member/ccrates" },
          { label: makeLabel(FaCreditCard, "secondary", "CLI Rates"), href: "/member/clirates" },
          { label: makeLabel(FaStar, "accent", "Special Rates"), href: "/member/specialrates" },
          { label: makeLabel(FaBullseye, "purple", "Targeted Rates"), href: "/member/targetedrates" },
          { label: makeLabel(FaPercentage, "secondary", "Offer Rates"), href: "/member/offer/rates" }
        ]
      },
      {
        label: "Recharge", subMenu: true,
        items: [
          { label: makeLabel(FaWallet, "teal", "Recharge Form"), href: "/member/recharge" },
          { label: makeLabel(FaFileInvoiceDollar, "cyan", "Payment Form"), href: "/member/vendor_form" }
        ]
      },
      ...(["accountmember", "salemember"].includes(memberRole) ? [
        {
          label: "Requests", subMenu: true,
          items: [
            { label: makeLabel(FaWallet, "teal", "Recharge Requests"), href: "/member/recharge_requests" },
            { label: makeLabel(FaFileInvoiceDollar, "cyan", "Payment Requests"), href: "/member/vendorpayment" },
            ...(["accountmember"].includes(memberRole) ? [
              { label: makeLabel(FaMoneyBillWave, "primary", "Over Draft Requests"), href: "/member/overdraft_requests" },
              { label: makeLabel(FaStar, "accent", "Private Rate Requests"), href: "/member/privaterate_requests" }
            ] : [])
          ]
        },
        ...(["accountmember"].includes(memberRole) ? [
          { label: makeLabel(FaFileAlt, "indigo", "Reports"), href: "/member/account/report" },
          { label: makeLabel(FaEnvelope, "purple", "Email"), href: "/member/account/email" },
          { label: makeLabel(FaTicketAlt, "pink", "My Tickets"), href: "/member/account/myticket" }
        ] : []),
        { label: makeLabel(FaBell, "accent", "Follow-Ups"), href: "/member/account/followup" },
        { label: makeLabel(FaComments, "dark", "Messages"), href: "/member/account/messages" },
        { label: makeLabel(FaHandsHelping, "danger", "Internal Assistance"), href: "/member/account/assistance" }
      ] : [])
    ]
  },
  {
    id: "support", label: "Support", roles: ["supportmember", "salemember"],
    subItems: [
      { label: makeLabel(FaTools, "primary", "Trouble Tickets"), href: "/member/support/troubleTickets" },
      { label: makeLabel(FaFlask, "secondary", "Testing"), href: "/member/support/testing" },
      { label: makeLabel(FaBell, "accent", "Follow-Ups"), href: "/member/support/followups" },
      ...(["supportmember"].includes(memberRole) ? [
        { label: makeLabel(FaTasks, "purple", "Tasks"), href: "/member/support/task" },
        { label: makeLabel(FaTicketAlt, "pink", "My Tickets"), href: "/member/support/myTickets" },
        { label: makeLabel(FaEnvelope, "indigo", "Email"), href: "/member/support/email" }
      ] : []),
      { label: makeLabel(FaComments, "dark", "Messages"), href: "/member/support/messages" },
      { label: makeLabel(FaHeadset, "danger", "Internal Assistance"), href: "/member/support/internalassistence" }
    ]
  },
  {
    id: "communications", label: "Communications", roles: ["leadmember", "supportmember"],
    subItems: [
      { label: makeLabel(FaPhoneAlt, "primary", "Enquires"), href: "/member/communication/enquiry" },
      { label: makeLabel(FaHashtag, "secondary", "DID Numbers"), href: "/member/communication/didEnquiry" },
      { label: makeLabel(FaTicketAlt, "accent", "My Tickets"), href: "/member/communication/myTickets" },
      { label: makeLabel(FaEnvelope, "purple", "Emails"), href: "/member/communication/email" },
      { label: makeLabel(FaComments, "indigo", "Chat Panel"), href: "/member/communication/chatpanel" },
      // { label: makeLabel(FaComments, "pink", "Messages"), href: "/member/communication/messages" },
      // { label: makeLabel(FaHeadset, "danger", "Internal Assistance"), href: "/member/communication/assistance" }
    ]
  },
  {
    id: "team",
    label: "Team Management",
    roles: ["leadmember", "supportmember", "salemember", "carriermember", "accountmember"],
    subItems: [
      {
        label: "Work Management",
        subMenu: true,
        items: [
          { label: makeLabel(FaTasks, "primary", "My Tasks"), href: "/member/work/tasks" },
          { label: makeLabel(FaBell, "secondary", "Follow-ups"), href: "/member/work/followups" },
          { label: makeLabel(FaCalendarAlt, "accent", "Meetings"), href: "/member/work/meetings" },
          { label: makeLabel(FaProjectDiagram, "purple", "Project Tasks"), href: "/member/work/projects" },
          { label: makeLabel(FaBullseye, "indigo", "Targets / Goals"), href: "/member/work/targets" },
          { label: makeLabel(FaCalendarCheck, "pink", "Calendar"), href: "/member/work/calendar" },
          { label: makeLabel(FaStickyNote, "danger", "Notes / Activity Timeline"), href: "/member/work/notes" }
        ]
      },
      {
        label: "Team Connect",
        subMenu: true,
        items: [
          { label: makeLabel(FaEnvelope, "primary", "Emails"), href: "/member/team/emails" },
          { label: makeLabel(FaComments, "secondary", "Chat / Messages"), href: "/member/team/chat" },
          { label: makeLabel(FaFileAlt, "accent", "File Sharing / Document Library"), href: "/member/team/files" },
          { label: makeLabel(FaBell, "purple", "Notifications / Reminders"), href: "/member/team/notifications" },
          { label: makeLabel(FaUsers, "indigo", "Discussion Threads"), href: "/member/team/discussions" }
        ]
      },
      {
        label: "HR & Administration",
        subMenu: true,
        items: [
          { label: makeLabel(FaUser, "primary", "My Profile / Directory"), href: "/member/hr/profile" },
          { label: makeLabel(FaCalendarCheck, "secondary", "Attendance"), href: "/member/hr/attendance" },
          { label: makeLabel(FaPlaneDeparture, "accent", "Leave Management"), href: "/member/hr/leaves" },
          { label: makeLabel(FaChartLine, "purple", "Performance Tracker"), href: "/member/hr/performance" },
          { label: makeLabel(FaChalkboardTeacher, "indigo", "Training / Learning"), href: "/member/hr/training" },
          { label: makeLabel(FaMoneyCheckAlt, "pink", "Payroll"), href: "/member/hr/payroll" },
          { label: makeLabel(FaMoneyCheckAlt, "red", "Information"), href: "/member/hr/information" }
        ]
      }
    ]
  }


];
