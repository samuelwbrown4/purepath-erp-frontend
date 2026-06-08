import { useEffect, useState, useContext } from "react";
import { Table, Card , Select , Button } from '@mantine/core'
import { TitleContext } from "../context/TitleContext";
import CreateCustForm from "../components/CreateCustForm";
import '../styles/customerLocations.css';

function CustomerLocations() {

    const API_URL = import.meta.env.VITE_API_URL

    const data = useContext(TitleContext)
    const setTitle = data.setTitle

    const [companyId , setCompanyId] = useState(null)

    const [locations , setLocations] = useState([])
    const [customers , setCustomers] = useState([])
    const [customerFilter , setCustomerFilter] = useState(null)

    const [openCreateCustomer , setOpenCreateCustomer] = useState(false)
    const [custName , setCustName] = useState('')
    const [custAddress , setCustAddress] = useState('')
    const [custCity , setCustCity] = useState('')
    const [custState , setCustState] = useState('')
    const [custZip , setCustZip] = useState('')

    const [openCreateLocation , setOpenCreateLocation] = useState(false)
    const [customer , setCustomer] = useState(null)
    const [locName , setLocName] = useState('')
    const [locAddress , setLocAddress] = useState('')
    const [locCity , setLocCity] = useState('')
    const [locState , setLocState] = useState('')
    const [locZip , setLocZip] = useState('')

    const states = ["AK", "AL", "AR", "AZ", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "IA", "ID", "IL", "IN", "KS", "KY", "LA", "MA", "MD", "ME", "MI", "MN", "MO", "MS", "MT", "NC", "ND", "NE", "NH", "NJ", "NM", "NV", "NY", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VA", "VT", "WA", "WI", "WV", "WY"]

    useEffect(() => {
        setTitle('Customers')
        getAllCustomers()
        getAllLocations()
        getCompany()
    }, [])

    useEffect(()=>{
        if(openCreateCustomer === true) return
        setCustName('')
        setCustAddress('')
        setCustCity('')
        setCustState('')
        setCustZip('')
    },[openCreateCustomer])

    useEffect(()=> {
        if(openCreateLocation === true) return
        setLocName('')
        setLocAddress('')
        setLocCity('')
        setLocState('')
        setLocZip('')
        setCustomer(null)
    })


    const filteredLocations = customerFilter ? locations.filter(l => l.customer_id === customerFilter) : locations

    async function getAllCustomers(){
        try{
            let response = await fetch(`${API_URL}/api/customers/all` , {
                headers: {
                    'Content-Type' : 'application/json'
                }
            });

            let result = await response.json();

            setCustomers(result.customers);
        }catch(error){
            console.log(error)
        }
    }

    async function getAllLocations(){
        try{
            let response = await fetch(`${API_URL}/api/customers/locations/all` , {
                headers: {
                    'Content-Type' : 'application/json'
                }
            })

            let result = await response.json();

            setLocations(result.customerLocations);
        }catch(error){
            console.log(error)
        }
    }

        async function getCompany(){
        try{
            let response = await fetch(`${API_URL}/api/companies/all` , {
                headers: {
                    'Content-Type' : 'application/json'
                }
            });

            let result = await response.json();

            if(!result.companies) return

            setCompanyId(result.companies[0].id)
        }catch(error){
            console.log(error)
        }
    }

    async function createCustomer(){
        if(!custName || !custAddress || !custCity || !custState || !custZip) return
        try{
            let payload = {
                companyId,
                custName,
                custAddress,
                custCity,
                custState,
                custZip
            }
            let response = await fetch(`${API_URL}/api/customers/new` , {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify({payload})
            });

            let result = await response.json()

            if(result.customer){
                setOpenCreateCustomer(false)
                getAllCustomers()
            }

        }catch(error){
            console.log(error)
        }
    }

    async function createLocation(){
        if(!customer || !locName || !locAddress || !locCity || !locState || !locZip) return
        try{
            let payload = {
                customer,
                locName,
                locAddress,
                locCity,
                locState,
                locZip
            }

            let response = await fetch(`${API_URL}/api/customers/locations/new` , {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify({payload})
            });

            let result = await response.json()

            if(result.status === 201){
                setOpenCreateLocation(false)
                getAllLocations()
            }
        }catch(error){
            console.log(error)
        }
    }
    return (
        <div className='root'>
            <CreateCustForm name={custName} setName={setCustName} address={custAddress} setAddress={setCustAddress} city={custCity} setCity={setCustCity} state={custState} setState={setCustState} zip={custZip} setZip={setCustZip} custOrLoc={'cust'} customers={customers} customer={customer} setCustomer={setCustomer} openCreateCustomer={openCreateCustomer} setOpenCreateCustomer={setOpenCreateCustomer} openCreateLocation={openCreateLocation} setOpenCreateLocation={setOpenCreateLocation} states={states} handleCreationClick={createCustomer}/>
            <CreateCustForm name={locName} setName={setLocName} address={locAddress} setAddress={setLocAddress} city={locCity} setCity={setLocCity} state={locState} setState={setLocState} zip={locZip} setZip={setLocZip} custOrLoc={'loc'} customers={customers} customer={customer} setCustomer={setCustomer} openCreateCustomer={openCreateCustomer} setOpenCreateCustomer={setOpenCreateCustomer} openCreateLocation={openCreateLocation} setOpenCreateLocation={setOpenCreateLocation} states={states} handleCreationClick={createLocation}/>
            <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: '75%' }}>
                <div style={{ width: '100%', display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center', margin: 'auto', gap: '2rem' }}>
                    <div style={{display: 'flex' , gap: '1rem' , width: '100%' , overflowY: 'scroll'}}>
                        <div style={{display: 'flex' , gap: '1rem' , width: '100%' , alignItems: 'space-between'}}>
                        <span>Filter By Customer: </span>
                        <Select 
                            clearable
                            placeholder='Select Customer'
                            value={customerFilter}
                            onChange={(value)=>setCustomerFilter(value)}
                            data={customers.map(c=>(
                                {
                                    value: c.id,
                                    label: c.name
                                }
                            ))}
                        />
                        </div>
                        <div style={{display: 'flex' , gap: '1rem'}}>
                            <Button color='#1D9EAF' onClick={()=>setOpenCreateCustomer(true)}>Add Customer</Button>
                            <Button color='#1D9EAF' onClick={()=>setOpenCreateLocation(true)}>Add Location</Button>
                        </div>
                        
                    </div>
                    <Table className='table'>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Name</Table.Th>
                                <Table.Th>Address</Table.Th>
                                <Table.Th>City</Table.Th>
                                <Table.Th>State</Table.Th>
                                <Table.Th>Zip</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {filteredLocations.map(l => (
                                <Table.Tr key={l.id}>
                                    <Table.Td>{l.name}</Table.Td>
                                    <Table.Td>{l.address}</Table.Td>
                                    <Table.Td>{l.city}</Table.Td>
                                    <Table.Td>{l.state}</Table.Td>
                                    <Table.Td>{l.zip_code}</Table.Td>
                                </Table.Tr>
                            ))}
                        </Table.Tbody>
                    </Table>
                </div>

            </Card>
        </div>
    )
}

export default CustomerLocations;