import { Select, Input, NumberInput, Button, Table } from '@mantine/core'
import { DateInput } from '@mantine/dates'
import { useEffect, useState } from "react";
import '../styles/orderEntry.css'

function OrderEntry() {
    const [orderCount, setOrderCount] = useState(null)
    const [products, setProducts] = useState([])
    const [shipperLocations, setShipperLocations] = useState([])
    const [customerLocations, setCustomerLocations] = useState([])
    const [customerId, setCustomerId] = useState(null)
    const [shipDate, setShipDate] = useState(Date.now())
    const [orderOriginId, setOrderOriginId] = useState(null)
    const [orderDestId, setOrderDestId] = useState(null)
    const [lineItems, setLineItems] = useState([{ id: 1, product: null, uom: null, quantity: 0 , weight: null }])

    const API_URL = import.meta.env.VITE_API_URL

    useEffect(() => {

        getOrderFormData()
    }, [])

    useEffect(() => {
        if (!orderDestId) {
            return
        }

        let matchLocation = customerLocations.find(loc => loc.id === orderDestId);

        if (!matchLocation) {
            return
        }

        setCustomerId(matchLocation.customer_id)
    }, [orderDestId])


    function addLineItem() {
        setLineItems([...lineItems, { id: Date.now(), product: null, quantity: 0 }])
    }

    function updateLineItem(lineItem, field, value) {
        setLineItems(lineItems.map(li => li.id === lineItem ? { ...li, [field]: value } : li))
    }

    async function getOrderFormData(){
        try{
            let response = await fetch(`${API_URL}/api/orders/order-form` , {
                headers: {
                    'Content-Type' : 'application/json'
                }
            });

            let result = await response.json()

            setCustomerLocations(result.customerLocations)
            setProducts(result.products)
            setOrderCount(result.orderCount)
            setShipperLocations(result.shipperLocations)
        }catch(error){
            console.log(error)
        }
    }


    async function submitNewOrder(){
        try{

            const payload = {
                customerId,
                orderOriginId,
                orderDestId,
                orderNumber: `PP-${orderCount + 1}`,
                custPoNumber: orderCount + 1,
                shipDate: new Date(shipDate).toISOString().split('T')[0],
                orderStatus: 'unplanned',
                lineItems: lineItems.map(li => {
                    const product = products.find(p=> p.id === li.product);
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

            let response = await fetch(`${API_URL}/api/orders/new` , {
                method: 'POST' , 
                headers: {
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify({
                    payload
                })
            });

            let result = await response.json()

            if(result.message === 'success'){
                setCustomerId(null);
                setOrderOriginId(null);
                setOrderDestId(null);
                setLineItems([{ id: 1, product: null, quantity: 0 }]);
                getOrderFormData()
            }
        }catch(error){
            console.log(error)
        }
    }


    return (
        <div style={{ width: '100%' }}>
            <h1>Order Entry</h1>
            <h3>Order Header Details</h3>
            <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center' }}>
                <Select placeholder='Select Origin' data={shipperLocations.map(loc => ({ value: loc.id, label: `${loc.erp_id} - ${loc.name}` }))} onChange={setOrderOriginId} />
                <Select placeholder='Select Customer Location' data={customerLocations.map(loc => ({ value: loc.id, label: loc.name }))} onChange={setOrderDestId} />
                <DateInput value={shipDate} onChange={setShipDate} />
            </div>

            <div style={{width: '75%' , display: 'flex' , justifyContent: 'center' , flexDirection: 'column' , alignItems: 'center' , margin: 'auto'}}>
                <h3>Add Line Items</h3>
                <Table>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>Product</Table.Th>
                            <Table.Th>Quantity</Table.Th>
                            <Table.Th>UoM</Table.Th>
                            <Table.Th colSpan={2}>{`Weight (lbs.)`}</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {lineItems.map(li => (
                            <Table.Tr key={li.id}>
                                <Table.Td className='table-d'>
                                    <Select
                                        placeholder='Select Product'
                                        data={products.map(p => ({ value: p.id, label: `${p.material_number} - ${p.description}` }))}
                                        onChange={(value) => updateLineItem(li.id, 'product', value)}
                                    />
                                </Table.Td>
                                <Table.Td className='table-d'>
                                    <NumberInput
                                    className='qty'
                                    styles={{wrapper: {width: '100%' , margin: '0'}}}
                                        placeholder='Qty'
                                        value={li.quantity}
                                        onChange={(value) => updateLineItem(li.id, 'quantity', value)}
                                    />
                                </Table.Td>
                                <Table.Td className='table-d'>
                                    {products.find(p=>p.id === li.product)? products.find(p=>p.id === li.product)?.unit_of_measure : '-'}
                                </Table.Td>
                                <Table.Td className='table-d'>
                                    {products.find(p=>p.id === li.product)?products.find(p=>p.id===li.product)?.weight*li.quantity : '-'}
                                </Table.Td>
                                 <Table.Td className='table-d'>
                                    <Button onClick={addLineItem}>+</Button>
                                </Table.Td>
                            </Table.Tr>
                        ))}
                    </Table.Tbody>
                </Table>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', width: '20%' , margin: 'auto' }}>
                <Button onClick={submitNewOrder}>Submit Order</Button>
            </div>
        </div>
    )
}

export default OrderEntry;