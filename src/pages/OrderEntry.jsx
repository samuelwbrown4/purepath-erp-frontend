import { Select, Input, NumberInput, Button, Table, Image, Card , Radio , Group } from '@mantine/core'
import { DateInput } from '@mantine/dates'
import { useEffect, useState, useContext } from "react";
import { TitleContext } from '../context/TitleContext'
import plusIcon from '../assets/plus.svg';
import trashIcon from '../assets/trash.svg';
import '../styles/orderEntry.css'

function OrderEntry() {
    const [orderCount, setOrderCount] = useState(null)
    const [products, setProducts] = useState([])
    const [supplierProducts , setSupplierProducts] = useState([])
    const [shipperProducts , setShipperProducts] = useState([])
    const [shipperLocations, setShipperLocations] = useState([])
    const [customerLocations, setCustomerLocations] = useState([])
    const [company , setCompany] = useState(null)
    const [radioValue , setRadioValue] = useState('outbound')
    const [supplierLocations , setSupplierLocations] = useState([])
    const [customerId, setCustomerId] = useState(null)
    const [supplierId , setSupplierId] = useState(null)
    const [shipDate, setShipDate] = useState(Date.now())
    const [orderOriginId, setOrderOriginId] = useState(null)
    const [orderDestId, setOrderDestId] = useState(null)
    const [lineItems, setLineItems] = useState([{ id: 1, product: null, uom: null, quantity: 0, weight: null }])

    const API_URL = import.meta.env.VITE_API_URL

    const titleContext = useContext(TitleContext)
    const setTitle = titleContext.setTitle

    useEffect(() => {
        setTitle('Order Entry')
        getOrderFormData()
    }, [])

    useEffect(()=>{
        console.log('supplier locations' , supplierLocations)
    },[supplierLocations])

    useEffect(()=>{
        console.log(company)
    },[company])

    useEffect(() => {
        if (!orderDestId || radioValue === 'inbound') {
            return
        }
        
        let matchLocation = customerLocations.find(loc => loc.id === orderDestId);

        if (!matchLocation) {
            return
        }

        setCustomerId(matchLocation.customer_id)
    }, [orderDestId])

    useEffect(()=>{
        if(radioValue === 'outbound'){
            setOrderOriginId(null)
            setOrderDestId(null)
            setSupplierId(null)
            setLineItems([{ id: 1, product: null, quantity: 0 }]);
            setProducts(shipperProducts)
        }else{
            setOrderOriginId(null)
            setOrderDestId(null)
        }

    },[radioValue])


    useEffect(() => {
    if (radioValue === 'inbound' && orderOriginId) {
        getSupplierProducts()

        let matchLocation = supplierLocations.find(loc => loc.id === orderDestId);

        if (!matchLocation) {
            return
        }

        setSupplierId(matchLocation.id)
        
    }
    }, [orderOriginId])

    function addLineItem() {
        setLineItems([...lineItems, { id: Date.now(), product: null, quantity: 0 }])
    }

    function removeLineItem(id) {
        setLineItems(lineItems.filter(li => li.id !== id))
    }

    function updateLineItem(lineItem, field, value) {
        setLineItems(lineItems.map(li => li.id === lineItem ? { ...li, [field]: value } : li))
    }

    async function getSupplierProducts(){
        try{
            let response = await fetch(`${API_URL}/api/orders/supplier-products/${orderOriginId}` , {
                headers: {
                    'Content-Type' : 'application/json'
                }
            });

            let result = await response.json()

            setProducts(result.supplierProducts)
        }catch(error){
            console.log(error)
        }
    }

    async function getOrderFormData() {
        try {
            let response = await fetch(`${API_URL}/api/orders/order-form`, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            let result = await response.json()

            setCustomerLocations(result.customerLocations)
            setShipperProducts(result.products)
            setProducts(result.products)
            setOrderCount(result.orderCount)
            setShipperLocations(result.shipperLocations)
            setCompany(result.company[0])
            setSupplierLocations(result.supplierLocations)
        } catch (error) {
            console.log(error)
        }
    }


    async function submitNewOrder() {
        try {

            const payload = {
                directionCategory: radioValue,
                companyId: company.id, 
                customerId,
                supplierId,
                orderOriginId,
                orderDestId,
                orderNumber: `PP-${(orderCount + 1).toString().padStart(5, '0')}`,
                custPoNumber: radioValue === 'outbound' ? (orderCount + 1).toString().padStart(5, '0') : null,
                shipDate: new Date(shipDate).toISOString().split('T')[0],
                orderStatus: 'unplanned',
                lineItems: lineItems.map(li => {
                    const product = products.find(p => p.id === li.product);
                    return {
                        productId: li.product,
                        materialNumber: product.material_number,
                        description: product.description,
                        quantity: li.quantity,
                        weight: li.quantity * product.weight,
                        freightClass: product.freight_class,
                        unitOfMeasure: product.unit_of_measure
                    }
                })
            }

            let response = await fetch(`${API_URL}/api/orders/new`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    payload
                })
            });

            let result = await response.json()

            if (result.message === 'success') {
                setCustomerId(null);
                setOrderOriginId(null);
                setOrderDestId(null);
                setLineItems([{ id: 1, product: null, quantity: 0 }]);
                getOrderFormData()
            }
        } catch (error) {
            console.log(error)
        }
    }


    return (
        <div style={{ width: '100%', minHeight: '100vH', color: '#0D4479', display: 'flex', flexDirection: 'column', gap: '2rem', alignItems: 'center' }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder style={{ marginTop: '2rem', width: '75%' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div style={{ borderBottom: '1px solid #cccccc' }}>
                        <h3>Order Header Details</h3>
                    </div>
                    <div>
                        <Radio.Group label='Select Direction Category' value={radioValue} onChange={setRadioValue}>
                            <Group>
                                <Radio value='outbound' label='Outbound' />
                                <Radio value='inbound' label='Inbound' />
                            </Group>
                        </Radio.Group>
                    </div>
                    <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
                            <label style={{ fontSize: '.8rem', fontWeight: '500' }}>Origin:</label>
                            <Select
                                placeholder='Select Origin'
                                value={orderOriginId}
                                data={radioValue === 'outbound' ? shipperLocations.map(loc => ({ value: loc.id, label: `${loc.erp_id} - ${loc.name}` })) : supplierLocations?.map(loc => ({ value: loc.id, label: loc.name}))}
                                onChange={setOrderOriginId}
                                className='input' />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
                            <label style={{ fontSize: '.8rem', fontWeight: '500' }}>Destination:</label>
                            <Select
                                placeholder='Select Destination'
                                value={orderDestId}
                                data={radioValue === 'outbound' ? customerLocations.map(loc => ({ value: loc.id, label: loc.name })) : shipperLocations.map(loc => ({ value: loc.id, label: loc.name }))}
                                onChange={setOrderDestId}
                                className='input' />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
                            <label style={{ fontSize: '.8rem', fontWeight: '500' }}>Requested Ship Date:</label>
                            <DateInput
                                value={shipDate}
                                onChange={setShipDate}
                                className='input' />
                        </div>
                    </div>
                </div>

            </Card>

            {orderOriginId && orderDestId && <Card shadow="sm" padding="lg" radius="md" withBorder style={{ marginTop: '2rem', width: '75%' }}>
                <div style={{ width: '100%', display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center', margin: 'auto', gap: '2rem' }}>
                    <div style={{ borderBottom: '1px solid #cccccc', width: '100%' }}>
                        <h3>Line Items</h3>
                    </div>
                    <Table >
                        <Table.Thead>
                            <Table.Tr className='tr'>
                                <Table.Th>Product</Table.Th>
                                <Table.Th>Quantity</Table.Th>
                                <Table.Th>UoM</Table.Th>
                                <Table.Th>{`Weight (lbs.)`}</Table.Th>
                                <Table.Th></Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {lineItems.map(li => (
                                <Table.Tr className='tr' key={li.id}>
                                    <Table.Td className='table-d'>
                                        <Select
                                            className='input'
                                            value={li.product}
                                            placeholder='Select Product'
                                            data={products.map(p => ({ value: p.id, label: `${p.material_number} - ${p.description}` }))}
                                            onChange={(value) => updateLineItem(li.id, 'product', value)}
                                        />
                                    </Table.Td>
                                    <Table.Td className='table-d'>
                                        <NumberInput

                                            className='qty input'
                                            styles={{ wrapper: { width: '100%', margin: '0' } }}
                                            placeholder='Qty'
                                            value={li.quantity}
                                            onChange={(value) => updateLineItem(li.id, 'quantity', value)}
                                        />
                                    </Table.Td>
                                    <Table.Td className='table-d'>
                                        {products.find(p => p.id === li.product) ? products.find(p => p.id === li.product)?.unit_of_measure : '-'}
                                    </Table.Td>
                                    <Table.Td className='table-d'>
                                        {products.find(p => p.id === li.product) ? products.find(p => p.id === li.product)?.weight * li.quantity : '-'}
                                    </Table.Td>
                                    <Table.Td style={{ textAlign: 'center' }} className='table-d'>
                                        {li.id !== 1 && <Image className='icon' src={trashIcon} h={24} w={'auto'} onClick={() => removeLineItem(li.id)} style={{ display: 'block', margin: '0 auto' }} />}
                                    </Table.Td>
                                </Table.Tr>
                            ))}
                        </Table.Tbody>
                    </Table>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                        <div onClick={addLineItem} className='icon' style={{display: 'flex', gap: '.5rem' , cursor: 'pointer'}}>
                            <Image src={plusIcon} h={32} w={'auto'} style={{border: 'solid 2px #0D4479' , borderRadius: '50%' , backgroundColor: 'white'}} />
                        </div>
                    </div>
                </div>
            </Card>}
            <div style={{ display: 'flex', justifyContent: 'flex-end', width: '75%' }}>
                <Button style={{ backgroundColor: '#1D9EAF' }} onClick={submitNewOrder}>Submit Order</Button>
            </div>
        </div>
    )
}

export default OrderEntry;