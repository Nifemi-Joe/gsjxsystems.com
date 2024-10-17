import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import ProfilePicture from "../../assets/images/person.png"
import {useAuth} from "../../store/auth/AuthContext";
import Select from "react-select";
// Styled components
const AccountSettingsWrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  //background-color: white;
  //border-radius: 8px;
  //box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const ProfileImg = styled.img`
  border-radius: 50%;
  width: 80px;
  height: 80px;
  margin-right: 20px;
`;

const EditButton = styled.button`
  color: white;
  border: none;
  padding: 10px 20px;
	width: 100px;
    background: #4182F9;
    border-radius: 8px;
	margin-left: auto;

  &:hover {
    background-color: #0056b3;
  }
`;

const AccountForm = styled.form`
  display: grid;
  gap: 20px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-weight: bold;
  margin-bottom: 5px;
`;

const Input = styled.input`
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const CompanyInfo = styled.div`
  margin-top: 30px;
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
`;

const CompanyDetail = styled.p`
  margin: 0;
  font-size: 14px;
`;

const SettingsCard = () => {
	const auth = useAuth();
	const [userData, setUserData] = useState({
		name: auth.userDetails ? auth.userDetails.name : "",
		email: auth.userDetails ? auth.userDetails.email : "",
		gender:  auth.userDetails ? auth.userDetails.gender : "",
		phone: auth.userDetails ? auth.userDetails.phone : "",
		country:  auth.userDetails ? auth.userDetails.country : "",
		company: {
			name: auth.userDetails ? auth.userDetails.companyName : "",
		},
		address:  auth.userDetails ? auth.userDetails.address : "",
		position: auth.userDetails ? auth.userDetails.position : "",
		department: auth.userDetails ? auth.userDetails.department : "",
		role: auth.userDetails ? auth.userDetails.role : "",
	});

	const [editMode, setEditMode] = useState(false);

	// useEffect(() => {
	// 	const id = localStorage.getItem("id")
	// 	// Fetch user data from API
	// 	axios
	// 		.get(   `http://localhost:8080/api/user/read-by-id/${id}`)
	// 		.then((response) => setUserData(response.data))
	// 		.catch((error) => console.error("Error fetching user data:", error));
	// }, []);

	const handleEdit = () => {
		setEditMode(true);
	};

	const handleSave = (e) => {
		e.preventDefault();
		axios
			.put(`https://tax-app-backend.onrender.com/api/user/update/${auth.userDetails._id}`, userData)
			.then((response) => {
				setEditMode(false);
			})
			.catch((error) => console.error("Error updating user data:", error));
	};
	const options =  [{
		value: "male",
		label: "Male"
	},
		{
			value: "female",
			label: "Female"
		}
	]
	return (
		<AccountSettingsWrapper>
			<ProfileHeader>
				<ProfileImg src={ProfilePicture} alt="Profile" />
				<div>
					<h2>{auth.userDetails && auth.userDetails.name}</h2>
					<p className="text-blue-500">{auth.userDetails && auth.userDetails.email}</p>
				</div>
				<EditButton onClick={handleEdit}>Edit</EditButton>
			</ProfileHeader>

			<AccountForm onSubmit={handleSave}>
				<InputGroup>
					<Label>Full Name</Label>
					{editMode ? (
						<Input
							type="text"
							value={userData.name}
							onChange={(e) =>
								setUserData({ ...userData, name: e.target.value })
							}
						/>
					) : (
						<Input type="text" value={userData.name} readOnly />
					)}
				</InputGroup>

				<InputGroup>
					<Label>Gender</Label>
					{editMode ? (
						<Select
							name="gender"
							onChange={(selectedOption) =>
								setUserData({ ...userData, gender: selectedOption.value })
							}
							value={options.find((option) => option.value === userData.gender)}
							options={options}
						/>
					) : (
						<Input type="text" value={userData.gender} readOnly />
					)}
				</InputGroup>
				<InputGroup>
					<Label>Phone Number</Label>
					{editMode ? (
						<Input
							type="tel"
							value={userData.phone}
							onChange={(e) =>
								setUserData({ ...userData, phone: e.target.value })
							}
						/>
					) : (
						<Input type="tel" value={userData.phone} readOnly />
					)}
				</InputGroup>
				<InputGroup>
					<Label>Country</Label>
					{editMode ? (
						<Input
							type="text"
							value={userData.country}
							onChange={(e) =>
								setUserData({ ...userData, country: e.target.value })
							}
						/>
					) : (
						<Input type="text" value={userData.country} readOnly />
					)}
				</InputGroup>

				<InputGroup>
					<Label>Email</Label>
					{editMode ? (
						<Input
							type="email"
							value={userData.email}
							onChange={(e) =>
								setUserData({ ...userData, email: e.target.value })
							}
						/>
					) : (
						<Input type="email" value={userData.email} readOnly />
					)}
				</InputGroup>
				<InputGroup>
					<Label>Address</Label>
					{editMode ? (
						<Input
							type="text"
							value={userData.address}
							onChange={(e) =>
								setUserData({ ...userData, address: e.target.value })
							}
						/>
					) : (
						<Input type="text" value={userData.address} readOnly />
					)}
				</InputGroup>
				<InputGroup>
					<Label>Role</Label>
					{editMode ? (
						<Input
							type="text"
							value={userData.role}
							onChange={(e) =>
								setUserData({ ...userData, role: e.target.value })
							}
						/>
					) : (
						<Input type="text" value={userData.role} readOnly />
					)}
				</InputGroup>
				<InputGroup>
					<Label>Department</Label>
					{editMode ? (
						<Input
							type="text"
							value={userData.department}
							onChange={(e) =>
								setUserData({ ...userData, department: e.target.value })
							}
						/>
					) : (
						<Input type="text" value={userData.department} readOnly />
					)}
				</InputGroup>
				<InputGroup>
					<Label>Position</Label>
					{editMode ? (
						<Input
							type="text"
							value={userData.position}
							onChange={(e) =>
								setUserData({ ...userData, position: e.target.value })
							}
						/>
					) : (
						<Input type="text" value={userData.position} readOnly />
					)}
				</InputGroup>


				{editMode && (
					<EditButton type="submit">
						Save
					</EditButton>
				)}
			</AccountForm>

			<h3>Company Details</h3>
			<CompanyInfo>
				<CompanyDetail>Company Name: {userData.companyName}</CompanyDetail>
				{/*<CompanyDetail>Company Email: {userData.company.email}</CompanyDetail>*/}
				{/*<CompanyDetail>Position: {userData.company.position}</CompanyDetail>*/}
			</CompanyInfo>
		</AccountSettingsWrapper>
	);
};

export default SettingsCard;
