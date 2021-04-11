import React from 'react';
import { Font, Page, Text, View, Document, StyleSheet, Image, pdf } from '@react-pdf/renderer';
import { Table, TableHeader, TableCell, TableBody, DataTableCell } from '@david.kucsai/react-pdf-table';
import logo from "../PDF_Renderer_Assets/Images/TT_Logo2019_RGB_75_minWht.png"
import Config from "../Configuration";
import lightFont from "../PDF_Renderer_Assets/Fonts/Roboto/Roboto-Light.ttf";
import regularFont from "../PDF_Renderer_Assets/Fonts/Roboto/Roboto-Regular.ttf";
import boldFont from "../PDF_Renderer_Assets/Fonts/Roboto/Roboto-Bold.ttf";
import { saveAs } from 'file-saver';

Font.register({ family: 'Roboto', src: lightFont, fontWeight: 'light' });
Font.register({ family: 'Roboto', src: regularFont, fontWeight: 'normal' });
Font.register({ family: 'Roboto', src: boldFont, fontWeight: 'bold' });

const currentDate = new Date();
var goodItems;
var badItems;
var uglyItems;
var columnNames;

// Create styles
const styles = StyleSheet.create({
  page: {
    backgroundColor: '#FFFFFF',
    fontFamily: 'Roboto',
    paddingBottom: 20
  },
  section_header: {
    flexGrow: 0,
    margin: 10,
    flexDirection: 'row'
  },
  section_body: {
    flexGrow: 0,
    margin: 10,
    flexDirection: 'row'
  },
  section_footer: {
    flexGrow: 0,
    marginBottom: 10,
    bottom: 0,
    flexDirection: 'row',
    position: "absolute"
  },
  section_vertical: {
    flexGrow: 0,
    margin: 20,
    flexDirection: 'column'
  },
  section_left_align: {
    padding: 1,
    flexGrow: 1,
    alignItems: "flex-start"
  },
  section_left_center: {
    padding: 1,
    flexGrow: 1,
    alignItems: "center"
  },
  section_right_align: {
    padding: 1,
    flexGrow: 1,
    alignItems: "flex-end"
  },
  image: {
    top: -10,
    width: "50%",
  },
});

// Create Document Component
const MyDocument = () => (
  <Document>
    <Page wrap size="A4" style={styles.page}>
      <View style={styles.section_header} fixed>
        <View style={styles.section_left_align}>
          <Text style={{ fontWeight: "regular", fontSize: "16pt" }}>Retrospective</Text>
          <Text style={{ fontWeight: "light", fontSize: "11pt" }}>Sprint: {Config.getSprintName()}</Text>
          <Text style={{ fontWeight: "light", fontSize: "11pt" }}>Team: {Config.getTeamName()}</Text>
          <Text style={{ fontWeight: "light", fontSize: "7pt" }}>Report date: {currentDate.toDateString()}</Text>
        </View>
        <View style={styles.section_right_align}>
          <Image style={styles.image} src={logo} alt="images"></Image>
        </View>
      </View>
      <View style={styles.section_vertical}>
        {!columnNames ? <Text style={{ fontWeight: "bold", fontSize: "9pt", textAlign: "left" }}>"Good"</Text> : <Text style={{ fontWeight: "bold", fontSize: "9pt", textAlign: "left" }}>{columnNames["Good"].replace(/[\r\n]+/gm, "") + '\n\n'}</Text>}
        <Table
          data={goodItems}
        >
          <TableHeader textAlign={"center"} fontWeight={"bold"} fontSize={"9pt"}>
            <TableCell weighting={1.0}>
              Comment
              </TableCell>
            <TableCell weighting={0.2}>
              Votes
              </TableCell>
            <TableCell weighting={1.0}>
              Action Points
              </TableCell>
          </TableHeader>
          <TableBody>
            <DataTableCell style={{ textAlign: "justify", fontWeight: "light", fontSize: "8pt", padding: "2" }} weighting={1.0} getContent={(r) => r.message} />
            <DataTableCell style={{ textAlign: "center", fontWeight: "light", fontSize: "8pt", padding: "1" }} weighting={0.195} getContent={(r) => r.votes} />
            <DataTableCell style={{ textAlign: "justify", fontWeight: "light", fontSize: "8pt", padding: "2" }} weighting={1.0} getContent={(r) => !r.actionPoints ? "None" : r.actionPoints.map((element, index) => (index + 1) + "\r" + element).splice(',').join("\n")} />
          </TableBody>
        </Table>
        <Text>{'\n'}</Text>
        {!columnNames ? <Text style={{ fontWeight: "bold", fontSize: "9pt", textAlign: "left" }}>"Bad"</Text> : <Text style={{ fontWeight: "bold", fontSize: "9pt", textAlign: "left" }}>{columnNames["Bad"].replace(/[\r\n]+/gm, "") + '\n\n'}</Text>}
        <Table
          data={badItems}
        >
          <TableHeader textAlign={"center"} fontWeight={"bold"} fontSize={"9pt"}>
            <TableCell weighting={1.0}>
              Comment
              </TableCell>
            <TableCell weighting={0.2}>
              Votes
              </TableCell>
            <TableCell weighting={1.0}>
              Action Points
              </TableCell>
          </TableHeader>
          <TableBody>
            <DataTableCell style={{ textAlign: "justify", fontWeight: "light", fontSize: "8pt", padding: "2" }} weighting={1.0} getContent={(r) => r.message} />
            <DataTableCell style={{ textAlign: "center", fontWeight: "light", fontSize: "8pt", padding: "1" }} weighting={0.195} getContent={(r) => r.votes} />
            <DataTableCell style={{ textAlign: "justify", fontWeight: "light", fontSize: "8pt", padding: "2" }} weighting={1.0} getContent={(r) => !r.actionPoints ? "None" : r.actionPoints.map((element, index) => (index + 1) + "\r" + element).splice(',').join("\n")} />
          </TableBody>
        </Table>
        <Text>{'\n'}</Text>
        {!columnNames ? <Text style={{ fontWeight: "bold", fontSize: "9pt", textAlign: "left" }}>"Ugly"</Text> : <Text style={{ fontWeight: "bold", fontSize: "9pt", textAlign: "left" }}>{columnNames["Ugly"].replace(/[\r\n]+/gm, "") + '\n\n'}</Text>}
        <Table
          data={uglyItems}
        >
          <TableHeader textAlign={"center"} fontWeight={"bold"} fontSize={"9pt"}>
            <TableCell weighting={1.0}>
              Comment
              </TableCell>
            <TableCell weighting={0.2}>
              Votes
              </TableCell>
            <TableCell weighting={1.0}>
              Action Points
              </TableCell>
          </TableHeader>
          <TableBody>
            <DataTableCell style={{ textAlign: "justify", fontWeight: "light", fontSize: "8pt", padding: "2" }} weighting={1.0} getContent={(r) => r.message} />
            <DataTableCell style={{ textAlign: "center", fontWeight: "light", fontSize: "8pt", padding: "1" }} weighting={0.195} getContent={(r) => r.votes} />
            <DataTableCell style={{ textAlign: "justify", fontWeight: "light", fontSize: "8pt", padding: "2" }} weighting={1.0} getContent={(r) => !r.actionPoints ? "None" : r.actionPoints.map((element, index) => (index + 1) + "\r" + element).splice(',').join("\n")} />
          </TableBody>
        </Table>
        <Text>{'\n'}</Text>
      </View>
      <View style={styles.section_footer} fixed>
        <Text style={{ textAlign: "center", fontWeight: "light", fontSize: "7pt" }}>
          Copyright {'\u00A9'} {currentDate.getFullYear()} TomTom N.V. All rights reserved.
        </Text>
      </View>
    </Page>
  </Document>
);

const UpdateData = async (list1, list2, list3, settings) => {
  goodItems = list1;
  badItems = list2;
  uglyItems = list3;
  columnNames = settings;
};

const GeneratePDF = async (filename) => {
  const blob = await pdf((
    <MyDocument />
  )).toBlob();
  saveAs(blob, filename);
};

export default MyDocument;
export { MyDocument, GeneratePDF, UpdateData };