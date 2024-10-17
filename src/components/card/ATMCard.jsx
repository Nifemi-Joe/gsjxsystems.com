import {Button, Container, Header, HeaderLeft} from "./BalanceCard";
import BankCard from "../../assets/images/bank-card-line.svg"
import Plus from "../../assets/images/add-line.svg"
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
const ATMCard = () => {
	return (
		<Container>
			<Header>
				<HeaderLeft>
					<img src={BankCard} alt="Bank card"/>
					<h3>My Cards</h3>
				</HeaderLeft>
				<Button>
					<img src={Plus} alt="Add"/>
					<span>More option</span>
				</Button>
			</Header>
			<Tabs
				defaultActiveKey="virtual"
				id="uncontrolled-tab-example"
				className="mb-3"
			>
				<Tab eventKey="virtual" title="Virtual">
					Tab content for Home
				</Tab>
				<Tab eventKey="physical" title="Physical">
					Tab content for Profile
				</Tab>
			</Tabs>
		</Container>
	)
}
export default ATMCard