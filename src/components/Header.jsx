import { Image, Menu } from '@mantine/core';
import { useContext } from 'react';
import { Link, useNavigate } from 'react-router'
import { TitleContext } from '../context/TitleContext'
import meridianErp from '../assets/meridian_erp_logo.png'
import menuIcon from '../assets/list.svg'

function Header() {
    const titleContext = useContext(TitleContext)
    const title = titleContext.title

    const navigate = useNavigate()
    return (
        <div style={{ position: 'sticky', top: '0', zIndex: '100', backgroundColor: 'white', maxHeight: '10%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid black' }}>
            <div style={{ flex: '1', marginLeft: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>

                <Menu width={200} shadow='md' style={{zIndex: '10000'}}>
                    <Menu.Target>
                        <Image className='icon' src={menuIcon} h={24} w={'auto'} />
                    </Menu.Target>
                    <Menu.Dropdown >
                        <Menu.Item onClick={() => navigate('/home')}>Home</Menu.Item>
                        <Menu.Sub openDelay={120} closeDelay={150}>
                            <Menu.Sub.Target>
                                <Menu.Sub.Item>Orders</Menu.Sub.Item>
                            </Menu.Sub.Target>

                            <Menu.Sub.Dropdown>
                                <Menu.Item onClick={() => navigate('/orders/overview')}>Order Overview</Menu.Item>
                                <Menu.Item onClick={() => navigate('/orders/order-entry')}>Order Entry</Menu.Item>
                            </Menu.Sub.Dropdown>
                        </Menu.Sub>
                        <Menu.Sub openDelay={120} closeDelay={150}>
                            <Menu.Sub.Target>
                                <Menu.Sub.Item>Products</Menu.Sub.Item>
                            </Menu.Sub.Target>
                            <Menu.Sub.Dropdown>
                                <Menu.Item>Product Overview</Menu.Item>
                                <Menu.Item>Add Products</Menu.Item>
                            </Menu.Sub.Dropdown>
                        </Menu.Sub>
                    </Menu.Dropdown>
                </Menu>
                <h4>PurePath, Inc.</h4>
            </div>

            <h2 style={{ flex: '1', textAlign: 'center' }}>{title}</h2>
            <div style={{ flex: '1', display: 'flex', justifyContent: 'flex-end' }}>
                <Image src={meridianErp} mah={80} w={'auto'} style={{ objectFit: 'contain', marginRight: '1rem' }} />
            </div>

        </div>
    )
}

export default Header;