import readXlsxFile from 'read-excel-file';

async function to_dictionaries(rows)
{
    //The first row holds the column names. The rest of the rows hold the column values.
    let dictionaries=[];
    for(let i=1;i<rows.length;i++)
    {
        let dictionary={};
        for(let j=0;j<rows[0].length;j++)
        {
            dictionary[rows[0][j]]=rows[i][j];
        }
        dictionaries.push(dictionary)
    }
    return dictionaries;
}
export async function read_excel_file(file_name)
{
    return await fetch(file_name)
  .then(response => response.blob())
  .then(blob => readXlsxFile(blob,{ sheet: 'Data' }))
  .then(async(rows) => {
    // `rows` is an array of rows
    // each row being an array of cells.\
    console.log(rows);
    return await to_dictionaries(rows);
  })
}
export async function read_text_file(file_name)
{
    return await fetch(file_name)
    .then(response => response.text())
    .then(text => {
        const lines=text.split("\r\n");
        console.log(lines); // Output file content
        return lines;
    })
    .catch(error => console.error('Error fetching file:', error));
}