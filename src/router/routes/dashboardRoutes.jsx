import { RouteConstant } from "../../util/constant/RouteConstant.js";
import DashboardPage from "../../pages/dashboard/DashboardPage";
import ClientPage from "../../pages/dashboard/ClientPage";
import RevenuePage from "../../pages/dashboard/RevenuePage";
import ExpensePage from "../../pages/dashboard/ExpensePage";
import TaxPage from "../../pages/dashboard/TaxPage";
import InvoicePage from "../../pages/dashboard/InvoicePage";
import TaxCalculatorPage from "../../pages/dashboard/TaxCalculatorPage";
import ProductServicePage from "../../pages/dashboard/ProductServicePage";
import EmployeePage from "../../pages/dashboard/EmployeePage";
import LoginPage from "../../pages/auth/LoginPage";
import RegisterPage from "../../pages/auth/RegisterPage";
import SettingsPage from "../../pages/dashboard/SettingsPage";
import RatePage from "../../pages/dashboard/RatePage";
import VATPage from "../../pages/dashboard/VATPage";
import AdminPage from "../../pages/admin/AdminPage";
import UserPage from "../../pages/admin/UserPage";
import AuditLogPage from "../../pages/admin/AuditLogPage";

/** @type {RouteType[]} */
export const dashboardRoutes = [
	{
		path: RouteConstant.dashboard.home.path,
		name: RouteConstant.dashboard.home.name,
		element: <LoginPage/>,
		metadata: { isProtected: false }
	},
	{
		path: RouteConstant.dashboard.dashboard.path,
		name: RouteConstant.dashboard.dashboard.name,
		element: <DashboardPage/>,
		metadata: { isProtected: false }
	},
	{
		path: RouteConstant.dashboard.client.path,
		name: RouteConstant.dashboard.client.name,
		element: <ClientPage/>,
		metadata: { isProtected: false }
	},
	{
		path: RouteConstant.dashboard.revenue.path,
		name: RouteConstant.dashboard.revenue.name,
		element: <RevenuePage/>,
		metadata: { isProtected: false }
	},
	{
		path: RouteConstant.dashboard.expense.path,
		name: RouteConstant.dashboard.expense.name,
		element: <ExpensePage />,
		metadata: { isProtected: false }
	},
	{
		path: RouteConstant.dashboard.tax.path,
		name: RouteConstant.dashboard.tax.name,
		element: <TaxPage />,
		metadata: { isProtected: false }
	},
	{
		path: RouteConstant.dashboard.invoice.path,
		name: RouteConstant.dashboard.invoice.name,
		element: <InvoicePage />,
		metadata: { isProtected: false }
	},
	{
		path: RouteConstant.dashboard.rate.path,
		name: RouteConstant.dashboard.rate.name,
		element: <RatePage />,
		metadata: { isProtected: false }
	},
	{
		path: RouteConstant.dashboard.taxCalculator.path,
		name: RouteConstant.dashboard.taxCalculator.name,
		element: <TaxCalculatorPage/>,
		metadata: { isProtected: false }
	},
	{
		path: RouteConstant.dashboard.service.path,
		name: RouteConstant.dashboard.service.name,
		element: <ProductServicePage/>,
		metadata: { isProtected: false }
	},
	{
		path: RouteConstant.dashboard.employee.path,
		name: RouteConstant.dashboard.employee.name,
		element: <EmployeePage/>,
		metadata: { isProtected: false }
	},
	{
		path: RouteConstant.landing.login.path,
		name: RouteConstant.landing.login.name,
			element: <LoginPage/>,
		metadata: { isProtected: false }
	},
	{
		path: RouteConstant.dashboard.settings.path,
		name: RouteConstant.dashboard.settings.name,
		element: <SettingsPage/>,
		metadata: { isProtected: false }
	},
	{
		path: RouteConstant.dashboard.vat.path,
		name: RouteConstant.dashboard.vat.name,
		element: <VATPage/>,
		metadata: { isProtected: false }
	},
	{
		path: RouteConstant.admin.dashboard.path,
		name: RouteConstant.admin.dashboard.name,
		element: <AdminPage/>,
		metadata: { isProtected: false }
	},
	{
		path: RouteConstant.admin.users.path,
		name: RouteConstant.admin.users.name,
		element: <UserPage/>,
		metadata: { isProtected: false }
	},
	{
		path: RouteConstant.admin.company.path,
		name: RouteConstant.admin.company.name,
		element: <UserPage/>,
		metadata: { isProtected: false }
	},
	{
		path: RouteConstant.admin.audit.path,
		name: RouteConstant.admin.audit.name,
		element: <AuditLogPage/>,
		metadata: { isProtected: false }
	},
];
