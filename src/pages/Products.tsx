import { useTitleContext } from '../context/TitleContext';
import { useState, useEffect, useContext } from 'react'
import { Table, Card, Image, Input, NumberInput, Select, Button } from '@mantine/core';
import plusIcon from '../assets/plus.svg'
import trashIcon from '../assets/trash.svg';
import '../styles/products.css';

interface ProductType{
    id: string,
    material_number: string,
    description: string,
    weight: string,
    freight_class: string | null,
    unit_of_measure: string
}

function Products() {
    const API_URL = import.meta.env.VITE_API_URL

    const data = useTitleContext()
    const setTitle = data.setTitle

    const [products, setProducts] = useState<ProductType[]>([])
    const [companyId , setCompanyId] = useState<string | null>(null)

    const [visibleEdit, setVisibleEdit] = useState<boolean>(false)

    const [materialNumber, setMaterialNumber] = useState('')
    const [description, setDescription] = useState('')
    const [weight, setWeight] = useState<number | string>('')
    const [freightClass, setFreightClass] = useState<string | null>('')

    const freightClasses = [50, 55, 60, 65, 70, 77.5, 85, 92.5, 100, 110, 125, 150, 175, 200, 250].map(String)

    useEffect(() => {
        setTitle('Products')
        getProducts()
        getCompany()
    }, [])

    async function getProducts() {
        try {
            let response = await fetch(`${API_URL}/api/products/finished-goods`, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            let result = await response.json()

            setProducts(result.products)
        } catch (error) {
            console.log(error)
        }
    }

    async function addProduct(){
        try{
            const payload = {
                companyId,
                materialNumber,
                description,
                weight,
                freightClass
            }
            let response = await fetch(`${API_URL}/api/products/new` , {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify({
                    payload
                })
            });

            let result = await response.json()

            if(!result.product) return
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

    async function handleAddProductClick(){
        await addProduct();
        setMaterialNumber('')
        setDescription('')
        setFreightClass('')
        setWeight('')
        setVisibleEdit(false)
        getProducts();
    }

    return (
        <div className='root'>
            <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: '75%' }}>
                <div style={{ width: '100%', display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center', margin: 'auto', gap: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                        <div style={{ display: 'flex', gap: '1rem', cursor: 'pointer' }}>
                            {!visibleEdit && <Image className='icon' onClick={() => setVisibleEdit(true)} src={plusIcon} h={32} w={'auto'} style={{ border: 'solid 2px #0D4479', borderRadius: '50%', backgroundColor: 'white' }} />}
                            {visibleEdit && 
                            <Button color='#1D9EAF' className='icon' onClick={()=>handleAddProductClick()}>Add Product</Button>
                            }
                            {visibleEdit && <Image className='icon' src={trashIcon} h={36} w={'auto'} onClick={() => setVisibleEdit(false)} style={{ display: 'block', margin: '0 auto' }} />}
                        </div>
                    </div>
                    <Table>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Material Number</Table.Th>
                                <Table.Th>Description</Table.Th>
                                <Table.Th>Weight</Table.Th>
                                <Table.Th>Freight Class</Table.Th>
                                <Table.Th>UoM</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {visibleEdit &&
                                <Table.Tr>
                                    <Table.Td>
                                        <Input
                                            value={materialNumber}
                                            onChange={(e) => setMaterialNumber(e.target.value)}
                                            className='input'
                                        />
                                    </Table.Td>
                                    <Table.Td>
                                        <Input
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            className='input'
                                        />
                                    </Table.Td>
                                    <Table.Td>
                                        <NumberInput
                                            value={weight}
                                            onChange={(value) => setWeight(value)}
                                            className='input'
                                        />
                                    </Table.Td>
                                    <Table.Td>
                                        <Select
                                            value={freightClass}
                                            data={freightClasses}
                                            onChange={setFreightClass}
                                            className='input'
                                        />
                                    </Table.Td>
                                    <Table.Td>EA</Table.Td>
                                </Table.Tr>
                            }
                            {products?.map((p: ProductType) => (
                                <Table.Tr key={p.id}>
                                    <Table.Td>{p.material_number}</Table.Td>
                                    <Table.Td>{p.description}</Table.Td>
                                    <Table.Td>{p.weight}</Table.Td>
                                    <Table.Td>{p.freight_class}</Table.Td>
                                    <Table.Td>{p.unit_of_measure}</Table.Td>
                                </Table.Tr>
                            ))}
                        </Table.Tbody>
                    </Table>

                </div>
            </Card>

        </div>
    )
}

export default Products;