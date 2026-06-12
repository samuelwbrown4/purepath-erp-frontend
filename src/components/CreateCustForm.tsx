import {Modal , Input , Select , Button} from '@mantine/core';
import '../styles/customerLocations.css'

interface Customer{
    name: string,
    id: string
}
interface CustomerFormProps{
    name: string,
    setName: (value: string) => void,
    address: string,
    setAddress: (value: string) => void,
    city: string,
    setCity: (value: string) => void,
    state: string | null,
    setState: (value: string | null) => void,
    zip: string,
    setZip: (value: string) => void,
    custOrLoc: 'cust' | 'loc',
    customer: string | null,
    customers: Customer[],
    setCustomer: (value: string | null) => void,
    openCreateLocation: boolean,
    setOpenCreateLocation: (value: boolean) => void,
    openCreateCustomer: boolean,
    setOpenCreateCustomer: (value: boolean) => void,
    states: string[],
    handleCreationClick: () => void,
    createLocationLoading?: boolean
}

function CreateCustForm({name , setName , address , setAddress , city , setCity , state , setState , zip , setZip , custOrLoc , customers , customer , setCustomer , openCreateLocation , setOpenCreateLocation , openCreateCustomer , setOpenCreateCustomer , states , handleCreationClick , createLocationLoading}: CustomerFormProps){
    return (
        <Modal 
        opened={custOrLoc === 'cust' ? openCreateCustomer : openCreateLocation} 
        onClose={custOrLoc === 'cust' ? ()=>setOpenCreateCustomer(false) : ()=>setOpenCreateLocation(false)}
        title={<h3>{`${custOrLoc === 'cust' ? 'Create New Customer' : 'Create New Customer Location'}`}</h3>}
        size='xl'
        styles={{content: {padding: '2rem' , paddingTop: '0rem'}}}
        >
            <div style={{display: 'flex' , flexDirection: 'column' , gap: '2rem' , width: '100%' , alignItems: 'center'}}>
                {custOrLoc === 'loc' && <div style={{display: 'flex' , flexDirection: 'column' , gap: '.5rem' , width: '40%' , alignItems: 'center'}}>
                    <span>Select Customer</span>
                    <Select
                    className='input'
                    value={customer}
                    onChange={(value)=>setCustomer(value)}
                    data={customers.map(c=>(
                        {
                            value: c.id,
                            label: c.name
                        }
                    ))}
                    />
                </div>}
                <div style={{display: 'flex' , gap: '0.5rem' , width: '60%' , alignItems: 'center'}}>
                    <span>Name</span>
                    <Input 
                    className='input'
                    value={name} 
                    onChange={(e)=>setName(e.target.value)}
                    styles={{input: {width: '100%'} , wrapper: {width: '100%'}}}
                    />
                </div>
                <div style={{display: 'flex' , gap:'1rem'}}>
                    <div style={{display: 'flex' , flexDirection: 'column' , width: '40%'}}>
                        <span>Address</span>
                        <Input
                        placeholder='123 Oak Lane'
                        className='input'
                        value={address}
                        onChange={(e)=>setAddress(e.target.value)}
                        />
                    </div>
                    <div style={{display: 'flex' , flexDirection: 'column' }}>
                        <span>City</span>
                        <Input
                        placeholder='Metropolis'
                        className='input'
                        value={city}
                        onChange={(e)=>setCity(e.target.value)}
                        />
                    </div>
                    <div style={{display: 'flex' , flexDirection: 'column', width: '10%'}}>
                        <span>State</span>
                        <Select
                        className='input'
                        value={state}
                        onChange={(value)=>setState(value)}
                        data={states}
                        />
                    </div>
                    <div style={{display: 'flex' , flexDirection: 'column' , width: '15%'}}>
                        <span>Zip</span>
                        <Input
                        placeholder='12345'
                        className='input'
                        value={zip}
                        onChange={(e)=>setZip(e.target.value)}
                        />
                    </div>
                </div>
                <div>
                    <Button color='#1D9EAF' loading={createLocationLoading} onClick={()=>handleCreationClick()}>{`Add ${custOrLoc === 'cust' ? 'Customer' : 'Location'}`}</Button>
                </div>
            </div>
        </Modal>
    )
}

export default CreateCustForm;