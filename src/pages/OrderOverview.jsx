import { TitleContext } from "../context/TitleContext";
import { useContext, useEffect, useState } from 'react';
import { Table, Card , Badge} from '@mantine/core'

function OrderOverview() {

    const titleContext = useContext(TitleContext);
    const setTitle = titleContext.setTitle

    const API_URL = import.meta.env.VITE_API_URL

    const [orders, setOrders] = useState([])

    useEffect(() => {
        setTitle('Order Overview')
        getOrders()
    }, [])

    useEffect(() => {
        console.log(orders)
    }, [orders])

    async function getOrders() {
        try {
            let response = await fetch(`${API_URL}/api/orders/all`, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            let result = await response.json()

            setOrders(result.orders)

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div style={{ height: '100vH' , display: 'flex' , justifyContent: 'center'}}>
            <Card style={{width: '85%' , marginTop: '2rem' , marginBottom: '2rem' , height: '85%'}}>
                {(orders.length > 0) && <Table>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>Order No.</Table.Th>
                            <Table.Th>Origin Name</Table.Th>
                            <Table.Th>Origin Address</Table.Th>
                            <Table.Th>Origin City</Table.Th>
                            <Table.Th>Origin State</Table.Th>
                            <Table.Th>Destination Name</Table.Th>
                            <Table.Th>Destination Address</Table.Th>
                            <Table.Th>Destination City</Table.Th>
                            <Table.Th>Destination State</Table.Th>
                            <Table.Th>Status</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {orders?.map(o => (
                            <Table.Tr key={o.id}>
                                <Table.Td>{o.order_number}</Table.Td>
                                <Table.Td><Badge className='status-badge'>{o.order_status ? o.order_status.toUpperCase().replaceAll('_',' ') : 'unplanned'}</Badge></Table.Td>
                                <Table.Td>{o.shipper_locations.name}</Table.Td>
                                <Table.Td>{o.shipper_locations.address}</Table.Td>
                                <Table.Td>{o.shipper_locations.city}</Table.Td>
                                <Table.Td>{o.shipper_locations.state}</Table.Td>
                                <Table.Td>{o.customer_locations.name}</Table.Td>
                                <Table.Td>{o.customer_locations.address}</Table.Td>
                                <Table.Td>{o.customer_locations.city}</Table.Td>
                                <Table.Td>{o.customer_locations.state}</Table.Td>
                                
                            </Table.Tr>
                        )
                        )
                        }
                    </Table.Tbody>
                </Table>}
            </Card>
        </div>
    )
}

export default OrderOverview;
