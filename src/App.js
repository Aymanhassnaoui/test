import React, { useEffect, useState } from 'react';
import './App.css';
import { MailOutlined, UserOutlined, CalendarOutlined, DeleteOutlined } from '@ant-design/icons';
import { Avatar, Card, Modal, Button, DatePicker } from 'antd'; // Ajout de DatePicker
import { afficherCards } from './api/Api';
import MenuNavigate from './compenent/MenuNavigate';

const { Meta } = Card;

function App() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [hoveredTexts, setHoveredTexts] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchDate, setSearchDate] = useState(null); 

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    try {
      const usersData = await afficherCards();
      const formattedUsers = usersData.map((user, index) => ({ ...user, id: index }));
      setUsers(formattedUsers);
      setFilteredUsers(formattedUsers);
      setHoveredTexts(new Array(usersData.length).fill(""));
    } catch (error) {
      console.error('Une erreur est survenue lors de la récupération des données :', error);
    }
  };

  const handleMouseOver = (index, text) => {
    const newTexts = [...hoveredTexts];
    newTexts[index] = text;
    setHoveredTexts(newTexts);
  };

  const handleMouseOut = (index) => {
    const newTexts = [...hoveredTexts];
    newTexts[index] = "";
    setHoveredTexts(newTexts);
  };

  const formatDate = (dateString) => {
    const dateObj = new Date(dateString);
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const year = dateObj.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleDelete = (id) => {
    setUsers(users.filter(user => user.id !== id));
    setFilteredUsers(filteredUsers.filter(user => user.id !== id));
  };

  const handleFilterByGender = (gender) => {
    const filtered = users.filter(user => user.gender && user.gender.toLowerCase() === gender.toLowerCase());
    setFilteredUsers(filtered);
  };
  const handleSearchByDateOfBirth = () => {
    if (!searchDate) {
      // Si la date de recherche est vide, afficher tous les utilisateurs
      setFilteredUsers(users);
    } else {
      // Formater la date de recherche pour correspondre au format des données (YYYY-MM-DD)
      const formattedSearchDate = searchDate.format('YYYY-MM-DD');
      // Filtrer les utilisateurs dont la date de naissance correspond à la date de recherche
      const filtered = users.filter(user => {
        // Formater la date de naissance de l'utilisateur pour correspondre au format de la recherche
        const userDOB = user.dob.date.substring(0, 10); // extraire la partie YYYY-MM-DD
        // Comparer la date de naissance de l'utilisateur avec la date de recherche
        return userDOB === formattedSearchDate;
      });
      // Mettre à jour la liste des utilisateurs filtrés
      setFilteredUsers(filtered);
    }
  };
  
  

  const handleAddUsers = async () => {
    try {
      const newUsersData = await afficherCards();
      if (!newUsersData) {
        return null;
      }
      const newUsers = newUsersData.map((user, index) => ({ ...user, id: index + users.length }));
      setUsers(prevUsers => [...prevUsers, ...newUsers]);
      setFilteredUsers(prevFilteredUsers => [...prevFilteredUsers, ...newUsers]);
      setHoveredTexts(prevTexts => [...prevTexts, ...new Array(newUsersData.length).fill("")]);
      return 'Utilisateurs ajoutés avec succès !';
    } catch (error) {
      console.error('Une erreur est survenue lors de l\'ajout des utilisateurs :', error);
      return 'Une erreur est survenue lors de l\'ajout des utilisateurs.';
    }
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <MenuNavigate 
        handleAddUsers={handleAddUsers} 
        handleFilterByGender={handleFilterByGender} 
      />
      <div style={{ position: 'fixed', zIndex: 1, left: 281, top: 39 }}>
    <DatePicker onChange={(date) => setSearchDate(date)} />
    <Button type="primary" style={{ marginLeft: 10 }} onClick={() => handleSearchByDateOfBirth(formatDate(searchDate))}>Chercher</Button>
</div>

        <div className='home'>
        {filteredUsers.map((item) => (
          <Card
            key={item.id}
            style={{ width: 500, margin: 10 }}
            cover={<img alt="example" src={item.picture.large} />}
            actions={[
              <div
                className="icon"
                title={`${item.name.first} ${item.name.last}`}
                onMouseOver={() => handleMouseOver(item.id, `${item.name.first} ${item.name.last}`)}
                onMouseOut={() => handleMouseOut(item.id)}
              >
                <UserOutlined />
              </div>,
              <div
                className="icon"
                title={`Email: ${item.email}`}
                onMouseOver={() => handleMouseOver(item.id, `Email: ${item.email}`)}
              >
                <MailOutlined />
              </div>,
              <div
                className="icon"
                title={`Date de l'utilisateur: ${formatDate(item.dob.date)}`}
                onMouseOver={() => handleMouseOver(item.id, `My birthday is: ${formatDate(item.dob.date)}`)}
              >
                <CalendarOutlined className="icon" />
              </div>,
              <div
                className="icon"
                onClick={() => handleDelete(item.id)}
                title="Supprimer"
              >
                <DeleteOutlined className="icon" />
              </div>
            ]}
          >
            <Meta
              avatar={<Avatar src={item.picture.thumbnail} />}
              title={hoveredTexts[item.id]}
              style={{ textAlign: 'center' }}
            />
            <div style={{ marginTop: 10, textAlign: 'center' }}>
              <Button type="primary" onClick={() => handleUserClick(item)}>Voir les détails</Button>
            </div>
          </Card>
        ))}
      </div>

      <Modal
        title="Détails utilisateur"
        visible={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
      >
        {selectedUser && (
          <div>
            <p>Nom : {selectedUser.name.first} {selectedUser.name.last}</p>
            <p>Email : {selectedUser.email}</p>
            <p>Date de naissance : {formatDate(selectedUser.dob.date)}</p>
            <p>Ville : {selectedUser.location.city}</p>
            <p>Pays : {selectedUser.location.country}</p>
            <img src={selectedUser.picture.large} alt="User" />
          </div>
        )}
      </Modal>
    </>
  );
}

export default App;
