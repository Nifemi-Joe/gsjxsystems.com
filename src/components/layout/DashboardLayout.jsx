import styled from "styled-components";
import Logo from "../../assets/images/Type=monday.svg"
import Clients from "../../assets/images/vuesax/linear/chart.svg"
import Revenue from "../../assets/images/money-dollar-circle-fill.svg"
import Expense from "../../assets/images/swap-box-fill.svg"
import Taxes from "../../assets/images/discount-percent-fill.svg"
import AuditLog from "../../assets/images/file-shield-2-line.svg";
import Product from "../../assets/images/emojione-monotone_bookmark-tabs.svg"
import Employee from "../../assets/images/user-6-line.svg"
import Settings from "../../assets/images/settings-4-fill.svg"
import Rate from "../../assets/images/exchange-line.svg"
import VAT from "../../assets/images/hand-heart-line.svg"
import axiosInstance from "../../services/baseService";
import Dashboard from "../../assets/images/home-3-line.svg"
import {Link} from "react-router-dom";
import {ToastContainer} from "react-toastify";
import React, {useContext, useEffect, useState} from "react";
import {DataContext} from "../../context/DataContext";
import {useAuth} from "../../store/auth/AuthContext";
import eventEmitter from "../../services/eventEmitter";
import UnauthorizedModal from "../modal/UnauthorizedModal";
import axios from "axios";


const Container = styled.div`
	min-height: 100vh;
    /* Dashboard */
    position: relative;
    width: 100%;
	height: 100%;
	display: flex;
    background: #101010;
	padding: 20px 20px 20px 0;
    //border-radius: 30px;
`

const Sidebar = styled.aside`
    display: flex;
    flex-direction: column;
    gap: 24px;
    width: 20%;
    margin-left: 8px;
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    background-color: #101010;
    padding: 20px 8px;
    overflow-y: auto;
`;


const SideCompanyContainer = styled.div`
	display: flex;
	align-items: center;
    justify-content: center;
    gap: 8px;
	img{
        border: 2px solid #DFE0EB;
        border-radius: 88px;
        width: 48px;
		height: 48px;
    }
`

const SideCompanyContent = styled.div`
	display: flex;
	flex-direction: column;
	gap: 4px;
	h2{
        font-style: normal;
        font-weight: 600;
        font-size: 18px;
        line-height: 22px;
        color: #FFFFFF;
    }
	p{
        font-weight: 400;
        font-size: 12px;
        line-height: 16px;
        color: #FFFFFF;
        mix-blend-mode: normal;
        opacity: 0.6;
    }
`

const MenuList = styled.ul`
	display: flex;
	flex-direction: column;
    gap: 12px;
	a{
        color: #FFFFFF;
        border-radius: 30px 0px 0px 30px;
        display: flex;
        gap: 18px;
        align-items: center;
        padding: 10px 12px 10px 12px;
        font-weight: 600;
        font-size: 14px;
        line-height: 17px;
        text-decoration: none;
        position: relative;
        z-index: 1;
        transition: all 0.3s ease-in-out;
        &:hover{
            background-color: #ffffff;
            color: #5459EA;
            border-radius: 30px 0px 0px 30px;
            img {
                filter: invert(41%) sepia(42%) saturate(2418%) hue-rotate(221deg) brightness(97%) contrast(97%);
            }
        }
        &.link-active {
            background-color: #ffffff;
            color: #5459EA !important;
            border-radius: 30px 0px 0px 30px;
            box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
            z-index: 2;
            //&::before {
            //    content: "";
            //    position: absolute;
            //    //top: 0;
            //    //left: -24px; /* Adjust based on design */
            //    //width: 24px;
            //    //height: 100%;
            //    //background-color: #ffffff;
            //    //border-top-right-radius: 20px;
            //    //border-bottom-right-radius: 20px;
            //    //z-index: -1;
            //    top: -10px;
            //    left: 216px;
            //    width: 40px;
            //    height: 66px;
            //    background-color: #ffffff;
            //    z-index: -1;
            //    border-radius: 80%;
            //}
            img {
                filter: invert(41%) sepia(42%) saturate(2418%) hue-rotate(221deg) brightness(97%) contrast(97%);
            }
        }
	}
`

const MenuLink = styled.a`
    
`;

const Section = styled.section`
    width: 80%;
    margin-left: 20%;
    height: 100%;
    background: #FFFFFF;
    border-radius: 30px;
    padding-bottom: 50px;
	z-index: 99;
	min-height: 700px;
`;

const DashboardLayout = ({children}) => {
	const links = [
		{
			id: 1,
			name: "Dashboard",
			image: Dashboard,
			href: "/dashboard",
			roles: ["clientAdmin", "employee"]  // All roles can access
		},
		{
			id: 2,
			name: "Clients",
			image: Clients,
			href: "/clients",
			roles: ["clientAdmin", "employee"]  // All roles can access
		},
		{
			id: 3,
			name: "Revenue",
			image: Revenue,
			href: "/revenue",
			roles: ["clientAdmin", "employee"]  // All roles can access
		},
		{
			id: 4,
			name: "Expense",
			image: Expense,
			href: "/expenses",
			roles: ["clientAdmin", "employee"]  // All roles can access
		},
		{
			id: 5,
			name: "Taxes",
			image: Taxes,
			href: "/tax",
			roles: ["clientAdmin", "employee"]  // All roles can access
		},
		{
			id: 6,
			name: "Product service",
			image: Product,
			href: "/services",
			roles: ["clientAdmin", "employee"]  // All roles can access
		},
		{
			id: 7,
			name: "Employee",
			image: Employee,
			href: "/employees",
			roles: ["clientAdmin", "employee"]  // All roles can access

		},
		{
			id: 8,
			name: "Rate",
			image: Rate,
			href: "/rate",
			roles: ["clientAdmin", "employee"]  // All roles can access

		},
		{
			id: 9,
			name: "VAT",
			image: VAT,
			href: "/vat",
			roles: ["clientAdmin", "employee"]  // All roles can access
		},
		{
			id: 10,
			name: "Admin",
			image: Dashboard,
			href: "/admin/dashboard",
			roles: ["admin", "superadmin"]  // All roles can access
		},
		{
			id: 11,
			name: "Users",
			image: Clients,
			href: "/admin/users",
			roles: ["admin", "superadmin"]  // All roles can access
		},
		{
			id: 12,
			name: "Company",
			image: Employee,
			href: "/admin/companies",
			roles: ["admin", "superadmin"]  // All roles can access
		},
		{
			id: 13,
			name: "Audit Logs",
			image: AuditLog,
			href: "/admin/audit-logs",
			roles: ["admin", "superadmin"]  // All roles can access
		},
	]
	const { userDetails, company } = useAuth();  // Assume user object has role property, e.g., {name: 'John', role: 'admin'}
	const userRole = userDetails?.role;
	const hasCompany = userDetails?.companyId;
	console.log(hasCompany)// Assume this property exists in userDetails
	const [isUnauthorizedModalOpen, setUnauthorizedModalOpen] = useState(false);

	const { setRates,setEmployees, setTaxes, setInvoices, setExpenses, setClients, setVat,allEmployees, setUsers, setAuditLogs, clients, expenses, companies,  invoices, taxes, setCompanies } = useContext(DataContext);
	const {getUserDetails, sessionTimeout}  = useAuth();
	const fetchData = async () => {
		try {
			const id = localStorage.getItem('id');
			const token = localStorage.getItem('token')
			await getUserDetails(token, id);

			const employeeRes = await axios.get(`https://tax-app-backend.onrender.com/api/employees/read`, {headers: {Authorization: `Bearer ${token}`}});
			const taxRes = await axios.get(`https://tax-app-backend.onrender.com/api/tax/`, {headers: {Authorization: `Bearer ${token}`}});
			const invoiceRes = await axios.get(`https://tax-app-backend.onrender.com/api/invoices/spoolInvoices`, {headers: {Authorization: `Bearer ${token}`}});
			const expenseRes = await axios.get(`https://tax-app-backend.onrender.com/api/expenses/read`, {headers: {Authorization: `Bearer ${token}`}});
			const clientRes = await axios.get(`https://tax-app-backend.onrender.com/api/clients/clients/`, {headers: {Authorization: `Bearer ${token}`}});
			const rateRes = await axios.get(`https://tax-app-backend.onrender.com/api/rate/read`, {headers: {Authorization: `Bearer ${token}`}});
			if (userRole === "superadmin" || userRole === "admin"){
				const userRes = await axios.get(`https://tax-app-backend.onrender.com/api/user/read`, {headers: {Authorization: `Bearer ${token}`}});
				const auditRes = await axios.get(`https://tax-app-backend.onrender.com/api/audit/`, {headers: {Authorization: `Bearer ${token}`}});
				console.log(auditRes);
				console.log(userRes)
				userRes.data.responseCode === "00" ? setUsers(userRes.data.responseData) : setUsers([]);
				auditRes.data ? setAuditLogs(auditRes.data) : setAuditLogs([])
			}
			if (employeeRes.data.responseCode === "00"){
				setEmployees(employeeRes.data.responseData);
			}
			else {
				setEmployees([]);
			}
			if (taxRes.data.responseCode === "00"){
				setTaxes(taxRes.data.responseData);
			}
			else {
				setTaxes([]);
			}
			invoiceRes.data.responseCode === "00" ? setInvoices(invoiceRes.data.responseData) : setInvoices([]);
			expenseRes.data.responseCode === "00" ? setExpenses(expenseRes.data.responseData) : setExpenses([]);
			clientRes.data.responseCode === "00" ? setClients(clientRes.data.responseData) : setClients([]);
			rateRes.data.responseCode === "00" ? setRates(rateRes.data.responseData) : setRates([]);
			const companyRes = await axios.get(`https://tax-app-backend.onrender.com/api/company/read/`, {headers: {Authorization: `Bearer ${token}`}});
			const response = await axios.get(`https://tax-app-backend.onrender.com/api/company/read-by-id/${userDetails.companyId}`, {headers: {Authorization: `Bearer ${token}`}});
			if (userRole === "superadmin" || userRole === "admin"){
				companyRes.data ? setCompanies(companyRes.data) : setCompanies([])
			}
			else{
				setCompanies(response.data.responseData);
			}
			const vatRes = await axios.get(`https://tax-app-backend.onrender.com/api/vat/read`, {headers: {Authorization: `Bearer ${token}`}});

			vatRes.data.responseCode === "00" ? setVat(vatRes.data.responseData) : setVat([]);

		}
		catch (error) {
			console.error("Error fetching data:", error);

			// Optionally handle other errors here
		}

	};

	useEffect(() => {
		fetchData()
	}, []);
	useEffect(() => {
		// Listen for the 'unauthorized' event
		const handleUnauthorized = () => {
			setUnauthorizedModalOpen(true);
		};

		eventEmitter.on('unauthorized', handleUnauthorized);

		// Clean up the listener on unmount
		return () => {
			eventEmitter.removeListener('unauthorized', handleUnauthorized);
		};
	}, []);

	const handleModalClose = () => {
		setUnauthorizedModalOpen(false);
	};
	return(
		<Container>
			<ToastContainer
				position="top-right"
				autoClose={5000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme="light"
			/>
			<Sidebar>
				<SideCompanyContainer>
					<img src={company.logo ? company.logo : Logo} alt="Logo"/>
					<SideCompanyContent>
						<h2>{company.name}</h2>
						<p>{company.contactNumber ?  company.contactNumber : "--"}</p>
					</SideCompanyContent>
				</SideCompanyContainer>
				<nav>
					<MenuList>
						{
							links.filter((link) => link.roles.includes(userRole)).map((link) => {
								const isDisabled = userRole === "superadmin" || userRole === "admin" ? false : !hasCompany; // Check if user has a company
								return (
									<li key={link.id}>
										<Link
											to={isDisabled && (link.href !== "/dashboard" || link.href.includes("admin"))  ? "/dashboard" : link.href} // Prevent navigation if disabled
											className={`${window.location.pathname === link.href ? "link-active" : ""} ${isDisabled && (link.href !== "/dashboard" || link.href.includes("admin")) ? 'disabled' : ''}`} // Add a disabled class
										>
											<img
												src={link.image}
												alt={link.name}
												style={{ filter: isDisabled && (link.href !== "/dashboard" || link.href.includes("admin"))? 'grayscale(100%)' : 'invert(41%) sepia(42%) saturate(2418%) hue-rotate(221deg) brightness(97%) contrast(97%)' }} // Greyscale the image if disabled
											/>
											<span style={{ color: isDisabled && (link.href !== "/dashboard" || link.href.includes("admin")) ? '#ccc' : '' }}>{link.name}</span> {/* Change text color */}
										</Link>
									</li>
								);
							})
						}
					</MenuList>
				</nav>
				<Link to="/settings" className="flex items-center gap-3 text-white font-bold p-3 mt-auto"><img src={Settings} alt="Settings"/>Settings </Link>
			</Sidebar>
			<Section>
				{children}
			</Section>
			<UnauthorizedModal isOpen={isUnauthorizedModalOpen || sessionTimeout} onClose={handleModalClose} />
		</Container>
	)
}
export default DashboardLayout