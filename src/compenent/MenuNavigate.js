import React, { useState } from 'react';
import { UsergroupAddOutlined, FilterOutlined,  } from '@ant-design/icons';
import { Menu, Modal } from 'antd';





const items = [
  {
    key: 'sub1',
    icon: <UsergroupAddOutlined />,
    label: 'Ajouter 10 personnes',
  },
  {
    key: 'sub2',
    icon: <FilterOutlined />,
    label: 'Filtrer par genre',
    children: [
      {
        key: '1',
        label: 'Masculin',
      },
      {
        key: '2',
        label: 'Féminin',
      },
    ],
  },
];

const MenuNavigate = ({ handleAddUsers, handleFilterByGender, handleSearchByDateOfBirth }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);




 

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    await handleAddUsers();
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };


  const onClick = async ({ key }) => {
    if (key === 'sub1') {
      showModal();
    } else if (key === '1') {
      handleFilterByGender('male');
    } else if (key === '2') {
      handleFilterByGender('female');
    }
  };

  return (
    <>
      <Menu
        onClick={onClick}
        style={{
          left: 552,
          justifyContent: 'space-between',
          display: 'flex',
          width: '848px',
          position: 'fixed',
          zIndex: 2,
          borderRadius: 12,
        }}
        mode="vertical"
      >
        {items.map(item => (
          item.children ? (
            <Menu.SubMenu key={item.key} icon={item.icon} title={item.label}>
              {item.children.map(child => (
                <Menu.Item key={child.key}>
                  {child.label}
                </Menu.Item>
              ))}
            </Menu.SubMenu>
          ) : (
            <Menu.Item key={item.key} icon={item.icon}>
              {item.label}
            </Menu.Item>
          )
        ))}
      </Menu>

      <Modal title="Confirmation" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <p>Voulez-vous ajouter 10 utilisateurs ?</p>
      </Modal>

  


    </>
  );
};

export default MenuNavigate;
