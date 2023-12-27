import './App.css'

function matchRecords() {
    const x = `12/05/2023	Credit Received	2500
  12/06/2023	Debit Received	4000
  12/07/2023	Credit Issued	3500
  12/08/2023	Debit Received	2000
  12/09/2023	Credit Received	4500
  12/10/2023	Debit Issued	3000
  12/11/2023	Credit Received	3500
  12/12/2023	Debit Issued	4000
  12/13/2023	Credit Issued	2500
  12/14/2023	Debit Received	3500
  12/15/2023	Credit Issued	2000
  12/16/2023	Debit Issued	2500
  12/17/2023	Credit Received	3000
  12/18/2023	Debit Issued	4500
  12/19/2023	Credit Issued	4000
  12/20/2023	Debit Received	3500
  12/21/2023	Credit Received	3000
  12/22/2023	Debit Received	2500
  12/23/2023	Credit Issued	2000`
}

import React from 'react'
import * as XLSX from 'xlsx'

const ExcelReader = () => {
    const [glFile, setGlFile] = React.useState<File | undefined>()
    const [bankFile, setBankFile] = React.useState<File | undefined>()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [glData, setGlData] = React.useState<any[]>([])
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [bankData, setBankData] = React.useState<any[]>([])

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [combinedData, setCombinedData] = React.useState<any[][]>([[]])

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (files && files.length > 0) {
            const file = files[0]
            setGlFile(file)
            const reader = new FileReader()
            reader.onload = (e) => {
                const data = new Uint8Array(e.target?.result as ArrayBuffer)
                const workbook = XLSX.read(data, { type: 'array', cellDates: true })
                const sheetName = workbook.SheetNames[0]
                const worksheet = workbook.Sheets[sheetName]
                const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
                console.log('set gl data')
                setGlData(rows)
            }
            reader.readAsArrayBuffer(file)
        }
    }

    const handleBankFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (files && files.length > 0) {
            const file = files[0]
            setBankFile(file)
            const reader = new FileReader()
            reader.onload = (e) => {
                const data = new Uint8Array(e.target?.result as ArrayBuffer)
                const workbook = XLSX.read(data, { type: 'array', cellDates: true })
                const sheetName = workbook.SheetNames[0]
                const worksheet = workbook.Sheets[sheetName]
                const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
                console.log('set bank data')
                setBankData(rows)
            }
            reader.readAsArrayBuffer(file)
        }
    }

    const handleSubmit = () => {
        console.log('glData', glData)
        console.log('bankData', bankData)
        const amountMap: Record<number, Array<any>> = {}
        for (const row of glData) {
            if (row[2] in amountMap) {
                amountMap[row[2]].push(row)
            } else {
                amountMap[row[2]] = [row]
            }
        }

        for (const row of bankData) {
            if (row[2] in amountMap) {
                amountMap[row[2]].push(row)
            }
        }

        console.log(amountMap)

        const combined: Array<any> = []
        for (const key in amountMap) {
            if (amountMap[key].length > 1) {
                combined.push(...amountMap[key])
            }
        }
        console.log(combined)

        setCombinedData(combined)

        // const combined = glData.concat(bankData)

        // combined.sort(function (a, b) {
        //     return a[2] - b[2]
        // })
        // setCombinedData(combined)
    }

    return (
        <div>
            <form>
                <input
                    type='file'
                    name='filename'
                    onChange={handleFileUpload}
                    style={{ visibility: 'visible' }}
                />
                <input
                    type='file'
                    name='filename2'
                    onChange={handleBankFileUpload}
                    style={{ visibility: 'visible' }}
                />
            </form>
            <button onClick={handleSubmit}>Click here rahal</button>
            <div>
                {combinedData.map((data) => {
                    const date = new Date(data[0])
                    const formattedDate: string = date.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                    })

                    return <p>{`${formattedDate},${data[1]},${data[2]}`}</p>
                })}
            </div>
        </div>
    )
}

export function Banking() {
    return (
        <div style={{ color: 'white', height: '500px' }}>
            <h1>RAHALS SPECIAL TOOL</h1>
            <ExcelReader />
        </div>
    )
}

function App() {
    return (
        <>
            <Banking />
        </>
    )
}

export default App
