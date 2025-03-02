import { BlendMode, PDFDocument, StandardFonts, rgb } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import fs from "fs";
import { getUserData } from "./fetchUserData.js";
import { getJobData } from "./fetchJobData.js";

// Constants
const TEMPLATE_PATH = "/Users/timkiebler/HTML/Secure089/Secure089/backend/contractAutoFill/Arbeitsvertrag.pdf";
const OUTPUT_PATH = "backend/contractAutoFill/filled-arbeitsvertrag.pdf";

// Main function to fetch user data and fill the PDF
export async function fetchUserAndFillContract(email, jobName) {
  try {
    const userData = await getUserData(email);
    if (!userData) {
      throw new Error("User not found");
    }
    const jobData = await getJobData(jobName);
    if (!jobData) {
      throw new Error("Job not found");
    }

    //await fillPDF(userData, jobData);
    const pdfBytes = await fillPDF(userData, jobData);
    console.log("PDF saved as: arbeitsvertrag-badge.pdf");
    return pdfBytes;
  } catch (error) {
    console.error("Error fetching user data or filling PDF:", error);
  }
}

// Function to fill the PDF with user data
async function fillPDF(userData, jobData) {
  const pdfDoc = await loadPDFTemplate();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const [ firstPage, secondPage, thirdPage  ] = pdfDoc.getPages();
  

  const name = userData.firstName + " " + userData.lastName;
  const street = userData.additionalData?.address?.street + " " + userData.additionalData?.address?.houseNumber;
  const city = userData.additionalData?.address?.postalCode + " " + userData.additionalData?.address?.city;
  fillEmployeeInformation(firstPage, font, name, street, city,);

  const employedAs = jobData.employedAs;
  fillEmployedAsField(firstPage, font, employedAs);

  const contractType = jobData.contractType;
  fillContractTypeField(firstPage, secondPage, font, contractType);
  fillContractP3Field(secondPage, thirdPage, font, contractType);


  //await savePDF(pdfDoc);
  const pdfBytes = await pdfDoc.save(); // Save the PDF and return the bytes
  return pdfBytes;
}

// Function to load the PDF template
async function loadPDFTemplate() {
  const templateBytes = fs.readFileSync(TEMPLATE_PATH);
  const pdfDoc = await PDFDocument.load(templateBytes);
  pdfDoc.registerFontkit(fontkit);
  return pdfDoc;
}

// Function to fill the head of the contract with  employee inromation
function fillEmployeeInformation(page, font, name, street, city) {
    drawTextOnPdf({ x: 45, y: 260 }, name, font, page);
    drawTextOnPdf({ x: 45, y: 245 }, street, font, page);
    drawTextOnPdf({ x: 45, y: 230 }, city, font, page);
}

// Function to fill the wird eingestellt als ... field
function fillEmployedAsField(page, font, employedAs) {
  const positions = {
    Sicherheitsmitarbeiter: { x: 37, y: 100 },
    Servicemitarbeiter: { x: 252, y: 100 },
  };

  if (positions[employedAs]) {
    drawTextOnPdf(positions[employedAs], "X", font, page);
  }
}
// Function to fill the mit dem Arbeitsverhältnis ... field
function fillContractTypeField(page1, page2, font, contractType) {
  const positions = {
    Teilzeit: { x: 37, y: 49 },
    "538-euro-Basis": { x: 249, y: 49 },
    Gleitzone: { x: 407, y: 49 },
    "kurzfristige-Besch": { x: 37, y: 782 },
  };

  if (contractType == "kurzfristige-Besch") {
    console.log("test")
    drawTextOnPdf(positions[contractType], "X", font, page2);
  } else {
    drawTextOnPdf(positions[contractType], "X", font, page1);
  }
}

// Function to fill the §3 field
function fillContractP3Field(page2, page3, font, contractType) {
  const positions = {
    "538-euro-Basis": { x: 37, y: 100 },
    Gleitzone: { x: 37, y: 209 },
    "kurzfristige-Besch": { x: 37, y: 723 },
  };

  if (contractType == "kurzfristige-Besch") {
    drawTextOnPdf(positions[contractType], "X", font, page3);
  } else if (contractType == "Teilzeit") {
    return;
  } else {
    drawTextOnPdf(positions[contractType], "X", font, page2);
  }
}

// Function to draw text on the PDF
function drawTextOnPdf(position, text, font, page) {
  
  page.drawText(text, {
    x: position.x,
    y: position.y,
    size: 11, //position.size || 20,
    font,
    color: rgb(0, 0, 0),
  });
}

// Function to save the modified PDF
async function savePDF(pdfDoc) {
  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(OUTPUT_PATH, pdfBytes);
}

// Example usage
//fetchUserAndFillContract("tim.kiebler@gmx.de", "Servicejob");