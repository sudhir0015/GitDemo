import React from "react";
import MenuList from "./MenuList";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Col from "react-bootstrap/Col";

function Menu() {

  return (
    <Router>
      <Switch>
          <Route exact path = "/">
            <Col className="border-right">
              <MenuList 
                getItemsQuery="/getTeams"
                createNewItemQuery="/createTeam"
                itemName="team"
              />
            </Col>
          </Route>
          <Route path = "/team/">
            <Col className="border-right">
              <MenuList
                getItemsQuery="/getSprints"
                createNewItemQuery="/createSprint"
                itemName="sprint"
                />
                <p/>
            </Col> 
          </Route>
      </Switch> 
    </Router>
  );
}

export default Menu;
