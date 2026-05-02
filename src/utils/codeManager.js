import * as XLSX from 'xlsx';

/**
 * Parses an Excel file and extracts codes from the first column.
 * @param {File} file - The Excel file to parse.
 * @returns {Promise<string[]>} - A promise that resolves to an array of codes.
 */
export const parseCodesFromExcel = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        // Flatten the array and filter out empty values
        const codes = jsonData.flat().filter(cell => cell && typeof cell === 'string' && cell.trim() !== '');
        resolve(codes);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
};

/**
 * Generates a sample Excel file for the user.
 */
export const generateSampleExcel = () => {
  const data = [
    ["IPTV_CODES"],
    ["ELITE-X92-K82-Q91"],
    ["ELITE-P21-Z33-L12"],
    ["ELITE-M09-V54-B88"],
    ["ELITE-T11-R44-W99"],
    ["ELITE-G66-F77-D22"],
    ["ELITE-S33-A44-K99"],
    ["ELITE-R11-E22-V33"]
  ];
  
  const worksheet = XLSX.utils.aoa_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Codes");
  
  XLSX.writeFile(workbook, "iptv_codes_sample.xlsx");
};
