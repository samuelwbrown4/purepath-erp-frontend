import { useState, useEffect, useContext } from 'react'
import { Card, Input, NumberInput, Select, Button } from '@mantine/core'

import '../styles/products.css';

function ProductEntry() {
    const API_URL = import.meta.env.VITE_API_URL

    const data = useContext(TitleContext)
    const setTitle = data.setTitle

    const freightClasses = [50, 55, 60, 65, 70, 77.5, 85, 92.5, 100, 110, 125, 150, 175, 200, 250]

    const [materialNumber, setMaterialNumber] = useState('')
    const [description, setDescription] = useState('')
    const [weight, setWeight] = useState('')
    const [freightClass, setFreightClass] = useState('')


    return (
        <div className='root'>
            <Card id='new-product-card' shadow="sm" padding="lg" radius="md" withBorder style={{ marginTop: '2rem', width: '75%' }}>
                <div className='input-container'>
                    <div className='new-product-input'>
                        <span>Material Number</span>
                        <Input
                            value={materialNumber}
                            onChange={(e) => setMaterialNumber(e.target.value)}
                            className='input'
                        />
                    </div>
                    <div className='new-product-input'>
                        <span>Description</span>
                        <Input
                            value={description}
                            onChange={(e) => (e.target.value)}
                            className='input'
                        />
                    </div>
                    <div className='new-product-input'>
                        <span>Weight</span>
                        <NumberInput
                            value={weight}
                            onChange={(value) => setWeight(value)}
                            className='input'
                        />
                    </div>
                    <div className='new-product-input'>
                        <span>Freight Class</span>
                        <Select
                            value={freightClass}
                            data={freightClasses}
                            onChange={setFreightClass}
                            className='input'
                        />
                    </div>
                </div>
                <div id='btn-div'>
                    <Button id='submit-product-btn' color='#1D9EAF '>Add Product</Button>
                </div>
            </Card>
        </div>
    )
}

export default ProductEntry;