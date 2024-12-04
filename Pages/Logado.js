import { useState } from 'react';
// Importando a função que descreve como foi definida a navegação da aplicação
import { useNavigation } from '@react-navigation/native';
import { View, Modal, Pressable, Text, TextInput, Button, StyleSheet } from 'react-native';
import MeuCompHeader from '../components/MeuCompHeader';
import firebase from '../firebase/config';

function Logado() {
  // Recuperando o componente de navegação da aplicação
  const navigation = useNavigation();
  const [username, setUsername] = useState('alessandrocerq@gmail.com');
  
//-----------------------------------------------------------------------------


//-----------------------------------------------------------------------------

  const efetuarLogout = async () => {
    firebase.auth()
      .signOut()
      .then( () => {
          setTextoModal("Logout Realizado");
          setModalVisivel(true);
          return;
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        setTextoModal("Erro de Logout: " + errorMessage);
        setModalVisivel(true);
        console.log("#------->" + errorMessage + " " + errorCode);
      }); 
  };

//-----------------------------------------------------------------------------

  return (
    <View>
      <MeuCompHeader titulo="Menu Principal" />
      <Text style={styles.negrito}>Usuário: {}</Text>
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <Text> </Text>
      <Text style={styles.negrito}>Senha:</Text>
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Text> </Text>
      <Button
        title="Efetuar Login"
        onPress={() => efetuarLogin()}
      />
      <Text> </Text>
      <Button
        title="Criar Nova Conta"
        onPress={() => criarConta()}
      />
       <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisivel}
        onRequestClose={() => {
          setModalVisivel(false);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>{textoModal}</Text>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => {setModalVisivel(false); navigation.navigate('Auth');}}>
              <Text style={styles.textStyle}>Fechar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  negrito: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default Logado;
