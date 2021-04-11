import React from 'react'
import Card from 'react-bootstrap/Card'
import Nav from 'react-bootstrap/Nav'

function Footer() {
    return (
		<Card className="text-center">
			<Card.Body>
				<Nav.Link 
					href="https://tomtomslack.slack.com/archives/C010BSA9LGM"
				>
					Need help? Join #panda-retro-board
				</Nav.Link>
			</Card.Body>
			<Card.Footer className="text-muted">
				
				{new Date().getFullYear()} Copyright: TomTom N.V. All rights reserved
			</Card.Footer>
		</Card>
    )
}

export default Footer;