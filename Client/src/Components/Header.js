import React, { useState, useEffect } from "react";
import Navbar from 'react-bootstrap/Navbar'
import Col from "react-bootstrap/Col";
import Config from "../Configuration";
import PubSub from 'pubsub-js'

const teamNameToIgnore = "http:";
const KChangeInVoteIdentifier = 'Change In Vote';

function Header() {

	const [totalVote, updateVote] = useState("");

	useEffect(() => {
		updateVoteCountForASprint(Config.getTeamName(), Config.getSprintName());
	}, []);


	PubSub.subscribe(KChangeInVoteIdentifier, function (msg, data) {
		updateVoteCountForASprint(Config.getTeamName(), Config.getSprintName());
	});

	const updateVoteCountForASprint = async (teamName, sprintName) => {

		if (teamName !== teamNameToIgnore) {
			let reqData = {
				params: {
					team: teamName,
					sprint: sprintName
				},
			};
			Config.getAxiosInstance().get("checkIfVotingAllowed", reqData).then(result => {
				updateVote(result.data[2]);
			})
		}
	}

	function checkIfVoteCountShouldBeDisplayed() {
		const regEx = RegExp(".+/team/.*/sprint/.*");
		let validBoard = regEx.test(window.location.href);

		if (validBoard) {
			updateVoteCountForASprint(Config.getTeamName(), Config.getSprintName());

			return <Col> <div class="float-right" style={{ padding: 10 }}>
				<form style={{
					backgroundColor: 'orange',
				}}><Col><h2>{"Vote Count " + totalVote}</h2></Col></form>
			</div><br /></Col>
		}
	}

	return (
		<div>
			<Navbar bg="light" variant="green" width="30">
				<Navbar.Brand href="/">
					<i className="fas fa-paw" />
				PandaBoard
			</Navbar.Brand>
				{checkIfVoteCountShouldBeDisplayed()}
			</Navbar>
		</div >
	)
}

export default Header;
